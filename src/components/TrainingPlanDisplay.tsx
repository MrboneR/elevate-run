import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { CalendarDays, Target, TrendingUp, Clock } from "lucide-react";

interface TrainingPlan {
  id: string;
  name: string;
  goal: string;
  difficulty_level: string;
  weekly_mileage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface Workout {
  id: string;
  workout_type: string;
  planned_date: string;
  planned_distance_km: number;
  planned_duration_minutes: number;
  effort_level: number;
  notes: string;
  completed_at: string | null;
}

const TrainingPlanDisplay = () => {
  const [activePlan, setActivePlan] = useState<TrainingPlan | null>(null);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(1);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchActivePlan();
  }, []);

  const fetchActivePlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get active training plan
      const { data: plan, error: planError } = await supabase
        .from('training_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (planError && planError.code !== 'PGRST116') {
        console.error('Error fetching plan:', planError);
        return;
      }

      if (plan) {
        setActivePlan(plan);
        
        // Calculate current week based on start date
        const startDate = new Date(plan.start_date);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        const week = Math.max(1, Math.min(4, Math.floor(daysDiff / 7) + 1));
        setCurrentWeek(week);

        // Get workouts for the plan
        const { data: workouts, error: workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .eq('training_plan_id', plan.id)
          .order('planned_date', { ascending: true });

        if (workoutsError) {
          console.error('Error fetching workouts:', workoutsError);
        } else {
          setWeeklyWorkouts(workouts || []);
        }
      }
    } catch (error) {
      console.error('Error fetching training plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-training-plan');
      
      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      toast({
        title: "New Plan Generated!",
        description: "Your personalized training plan has been updated.",
      });

      await fetchActivePlan();
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate new training plan. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getWorkoutsForWeek = (weekNumber: number) => {
    if (!activePlan) return [];
    
    const startDate = new Date(activePlan.start_date);
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return weeklyWorkouts.filter(workout => {
      const workoutDate = new Date(workout.planned_date);
      return workoutDate >= weekStart && workoutDate <= weekEnd;
    });
  };

  const getWorkoutTypeIcon = (type: string) => {
    switch (type) {
      case 'easy_run': return '🏃‍♂️';
      case 'tempo': return '⚡';
      case 'intervals': return '🔄';
      case 'long_run': return '🏃‍♀️💨';
      case 'cross_training': return '🚴';
      case 'rest': return '😴';
      default: return '🏃';
    }
  };

  const formatWorkoutType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!activePlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Training Plan
          </CardTitle>
          <CardDescription>
            Complete your RunAI Assessment to generate your personalized training plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateNewPlan} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Training Plan'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {activePlan.name}
              </CardTitle>
              <CardDescription>
                {activePlan.goal} • {activePlan.difficulty_level} level
              </CardDescription>
            </div>
            <Button variant="outline" onClick={generateNewPlan} disabled={loading}>
              Update Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Duration</div>
                <div className="text-xs text-muted-foreground">4 weeks</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Level</div>
                <div className="text-xs text-muted-foreground">{activePlan.difficulty_level}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Weekly Hours</div>
                <div className="text-xs text-muted-foreground">{activePlan.weekly_mileage}h</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Current Week</div>
                <div className="text-xs text-muted-foreground">Week {currentWeek}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Training Schedule</CardTitle>
          <CardDescription>
            Your personalized weekly workouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={`week-${currentWeek}`} onValueChange={(value) => setCurrentWeek(Number(value.split('-')[1]))}>
            <TabsList className="grid w-full grid-cols-4">
              {[1, 2, 3, 4].map((week) => (
                <TabsTrigger key={week} value={`week-${week}`}>
                  Week {week}
                  {week === currentWeek && <Badge variant="secondary" className="ml-1 text-xs">Current</Badge>}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {[1, 2, 3, 4].map((week) => (
              <TabsContent key={week} value={`week-${week}`} className="space-y-4">
                <div className="grid gap-3">
                  {getWorkoutsForWeek(week).map((workout) => (
                    <div
                      key={workout.id}
                      className={`p-4 rounded-lg border transition-all ${
                        workout.completed_at 
                          ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                          : 'bg-card border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getWorkoutTypeIcon(workout.workout_type)}</span>
                          <div>
                            <div className="font-medium">
                              {formatWorkoutType(workout.workout_type)}
                              {workout.completed_at && <Badge variant="secondary" className="ml-2">✓ Completed</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(workout.planned_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {workout.planned_distance_km}km • {workout.planned_duration_minutes}min
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Effort: {workout.effort_level}/10
                          </div>
                        </div>
                      </div>
                      {workout.notes && (
                        <div className="mt-2 text-sm text-muted-foreground border-t pt-2">
                          {workout.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingPlanDisplay;