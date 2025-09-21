import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, coachStyle = 'supportive', userProfile, recentWorkouts } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create a personalized prompt based on coach style and user data
    const systemPrompt = getCoachPrompt(coachStyle, userProfile, recentWorkouts);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-coach function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getCoachPrompt(coachStyle: string, userProfile: any, recentWorkouts: any[]): string {
  const basePrompt = `You are RunAI, an expert AI running coach. Your role is to provide personalized training advice, motivation, and guidance.`;
  
  const stylePrompts = {
    supportive: "Be encouraging, empathetic, and focus on positive reinforcement. Celebrate small wins and help build confidence.",
    motivational: "Be energetic, inspiring, and push for excellence. Use motivational language and challenge the runner to reach their potential.",
    analytical: "Be data-driven, precise, and technical. Provide detailed explanations and focus on metrics, pacing, and scientific training principles.",
    tough: "Be direct, no-nonsense, and demanding. Push hard while maintaining respect. Focus on discipline and mental toughness."
  };

  let prompt = basePrompt + " " + (stylePrompts[coachStyle as keyof typeof stylePrompts] || stylePrompts.supportive);
  
  if (userProfile) {
    prompt += `\n\nRunner Profile:
    - Experience: ${userProfile.running_experience || 'Unknown'}
    - Weekly mileage goal: ${userProfile.weekly_mileage_goal || 'Not set'} miles
    - Race goal: ${userProfile.race_goal || 'General fitness'}
    - Weight: ${userProfile.weight_kg || 'Not provided'} kg
    - Age: ${userProfile.age || 'Not provided'}`;
  }

  if (recentWorkouts && recentWorkouts.length > 0) {
    prompt += `\n\nRecent Workouts:`;
    recentWorkouts.forEach((workout, index) => {
      prompt += `\n${index + 1}. ${workout.workout_type} - ${workout.actual_distance_km || workout.planned_distance_km}km in ${workout.actual_duration_minutes || workout.planned_duration_minutes} minutes (Effort: ${workout.effort_level || 'N/A'}/10)`;
    });
  }

  prompt += `\n\nProvide helpful, actionable advice. Keep responses concise but informative. Always consider the runner's current fitness level and goals.`;
  
  return prompt;
}