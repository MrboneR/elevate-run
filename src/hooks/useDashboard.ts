import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface WorkoutData {
  id: string;
  workout_type: string;
  planned_date: string;
  planned_distance_km: number;
  planned_duration_minutes: number;
  planned_pace_per_km: string;
  completed_at?: string;
  actual_distance_km?: number;
  actual_duration_minutes?: number;
  effort_level?: number;
}

export interface RecoveryData {
  recovery_score: number;
  hrv_score: number;
  sleep_quality: number;
  sleep_duration_hours: number;
  stress_level: number;
  date: string;
}

export const useDashboard = () => {
  const { user } = useAuth();
  const [todaysWorkout, setTodaysWorkout] = useState<WorkoutData | null>(null);
  const [recoveryData, setRecoveryData] = useState<RecoveryData | null>(null);
  const [weeklyProgress, setWeeklyProgress] = useState({
    completedDistance: 0,
    targetDistance: 0,
    completedWorkouts: 0,
    targetWorkouts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's workout
      const { data: workout } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('planned_date', today)
        .maybeSingle();

      setTodaysWorkout(workout);

      // Fetch today's recovery data
      const { data: recovery } = await supabase
        .from('recovery_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      setRecoveryData(recovery);

      // Calculate weekly progress
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));

      const { data: weekWorkouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .gte('planned_date', weekStart.toISOString().split('T')[0])
        .lte('planned_date', weekEnd.toISOString().split('T')[0]);

      if (weekWorkouts) {
        const completed = weekWorkouts.filter(w => w.completed_at);
        const completedDistance = completed.reduce((sum, w) => sum + (w.actual_distance_km || 0), 0);
        const targetDistance = weekWorkouts.reduce((sum, w) => sum + (w.planned_distance_km || 0), 0);
        
        setWeeklyProgress({
          completedDistance,
          targetDistance,
          completedWorkouts: completed.length,
          targetWorkouts: weekWorkouts.length,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeWorkout = async (workoutId: string, actualData: {
    distance: number;
    duration: number;
    effortLevel: number;
    notes?: string;
  }) => {
    if (!user) return;

    const { error } = await supabase
      .from('workouts')
      .update({
        completed_at: new Date().toISOString(),
        actual_distance_km: actualData.distance,
        actual_duration_minutes: actualData.duration,
        effort_level: actualData.effortLevel,
        notes: actualData.notes,
      })
      .eq('id', workoutId)
      .eq('user_id', user.id);

    if (!error) {
      fetchDashboardData(); // Refresh data
    }

    return { error };
  };

  return {
    todaysWorkout,
    recoveryData,
    weeklyProgress,
    loading,
    completeWorkout,
    refreshData: fetchDashboardData,
  };
};