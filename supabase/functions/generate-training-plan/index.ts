import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log('Generating training plan for user:', user.id);

    // Get user profile with quiz results
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error('Could not fetch user profile');
    }

    // Get recent workouts for performance analysis
    const { data: recentWorkouts, error: workoutsError } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('planned_date', { ascending: false })
      .limit(10);

    if (workoutsError) {
      console.error('Workouts error:', workoutsError);
    }

    // Get latest recovery metrics
    const { data: recoveryMetrics, error: recoveryError } = await supabase
      .from('recovery_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(7);

    if (recoveryError) {
      console.error('Recovery metrics error:', recoveryError);
    }

    // Create comprehensive prompt for AI plan generation
    const systemPrompt = `You are RunAI, a world-class running coach AI. Generate a personalized 4-week training plan based on the user's assessment and running history.

User Assessment Results:
- Running Experience: ${profile.running_experience || 'Not specified'}
- Race Goal: ${profile.race_goal || 'Not specified'}  
- Weekly Training Hours: ${profile.weekly_mileage_goal || 'Not specified'}
- Preferred Coach Style: ${profile.preferred_coach_style || 'Not specified'}
- Age: ${profile.age || 'Not specified'}
- Weight: ${profile.weight_kg || 'Not specified'} kg
- Height: ${profile.height_cm || 'Not specified'} cm

Recent Workout History (last 10 workouts):
${recentWorkouts?.length ? recentWorkouts.map(w => 
  `- ${w.workout_type} on ${w.planned_date}: ${w.actual_distance_km || w.planned_distance_km || 'N/A'}km in ${w.actual_duration_minutes || w.planned_duration_minutes || 'N/A'} mins, effort: ${w.effort_level || 'N/A'}/10`
).join('\n') : '- No previous workouts recorded'}

Recent Recovery Data (last 7 days):
${recoveryMetrics?.length ? recoveryMetrics.map(r => 
  `- ${r.date}: Recovery score ${r.recovery_score || 'N/A'}/100, Sleep quality ${r.sleep_quality || 'N/A'}/10, HRV ${r.hrv_score || 'N/A'}`
).join('\n') : '- No recovery data available'}

Generate a structured training plan with:
1. Plan name and description
2. Weekly breakdown (4 weeks)
3. Specific workouts for each week with: type, distance, duration, pace guidance, effort level
4. Progressive difficulty based on experience level
5. Recovery recommendations
6. Goal-specific focus areas

Format as JSON with this structure:
{
  "name": "Plan Name",
  "description": "Brief description", 
  "difficulty_level": "beginner/intermediate/advanced/professional",
  "weeks": [
    {
      "week": 1,
      "focus": "Week focus description",
      "workouts": [
        {
          "day": 1,
          "workout_type": "easy_run/tempo/intervals/long_run/rest/cross_training",
          "planned_distance_km": 5.0,
          "planned_duration_minutes": 30,
          "effort_level": 6,
          "notes": "Specific instructions"
        }
      ]
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate my personalized training plan now.' }
        ],
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResult = await response.json();
    const planContent = aiResult.choices[0].message.content;
    
    console.log('AI generated plan:', planContent);

    let planData;
    try {
      planData = JSON.parse(planContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }

    // Calculate plan dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 28); // 4 weeks

    // Create training plan record
    const { data: newPlan, error: planError } = await supabase
      .from('training_plans')
      .insert({
        user_id: user.id,
        name: planData.name,
        goal: profile.race_goal || 'fitness',
        difficulty_level: planData.difficulty_level,
        weekly_mileage: profile.weekly_mileage_goal || 10,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        is_active: true
      })
      .select()
      .single();

    if (planError) {
      console.error('Plan creation error:', planError);
      throw new Error('Could not create training plan');
    }

    // Create individual workout records
    const workouts = [];
    for (let weekIndex = 0; weekIndex < planData.weeks.length; weekIndex++) {
      const week = planData.weeks[weekIndex];
      for (const workout of week.workouts) {
        const workoutDate = new Date(startDate);
        workoutDate.setDate(startDate.getDate() + (weekIndex * 7) + (workout.day - 1));
        
        workouts.push({
          user_id: user.id,
          training_plan_id: newPlan.id,
          workout_type: workout.workout_type,
          planned_date: workoutDate.toISOString().split('T')[0],
          planned_distance_km: workout.planned_distance_km,
          planned_duration_minutes: workout.planned_duration_minutes,
          effort_level: workout.effort_level,
          notes: workout.notes || `Week ${week.week}: ${week.focus}`
        });
      }
    }

    // Deactivate any existing active plans
    await supabase
      .from('training_plans')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .neq('id', newPlan.id);

    // Insert workouts in batches
    const { error: workoutsError2 } = await supabase
      .from('workouts')
      .insert(workouts);

    if (workoutsError2) {
      console.error('Workouts creation error:', workoutsError2);
      throw new Error('Could not create workout schedule');
    }

    console.log(`Created training plan with ${workouts.length} workouts`);

    return new Response(JSON.stringify({ 
      success: true, 
      plan: newPlan,
      workoutsCreated: workouts.length,
      planData: planData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-training-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});