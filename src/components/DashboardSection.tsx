import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Heart,
  Zap,
  Trophy,
  Play,
  User,
  LogOut,
  Activity,
  Moon
} from "lucide-react";

const DashboardSection = () => {
  const { user, signOut } = useAuth();
  const { todaysWorkout, recoveryData, weeklyProgress, loading, completeWorkout } = useDashboard();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [workoutData, setWorkoutData] = useState({
    distance: '',
    duration: '',
    effortLevel: '5',
    notes: ''
  });

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: t('auth.error'),
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteWorkout = async () => {
    if (!todaysWorkout) return;

    const { error } = await completeWorkout(todaysWorkout.id, {
      distance: parseFloat(workoutData.distance),
      duration: parseInt(workoutData.duration),
      effortLevel: parseInt(workoutData.effortLevel),
      notes: workoutData.notes
    });

    if (error) {
      toast({
        title: t('auth.error'),
        description: "Failed to complete workout. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: t('dashboard.workoutCompleted'),
        description: t('dashboard.congratulations'),
      });
      setIsCompleteDialogOpen(false);
      setWorkoutData({ distance: '', duration: '', effortLevel: '5', notes: '' });
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header with user info and sign out */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">Performance Command Center</h2>
            <p className="text-xl text-muted-foreground">
              Real-time insights from your wearables, personalized training adaptations, and AI-driven coaching
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Today's Training */}
          <Card className="lg:col-span-2 shadow-performance">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today's Training
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {todaysWorkout ? (
                <>
                  <div className="gradient-performance p-6 rounded-lg text-primary-foreground">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold capitalize">{todaysWorkout.workout_type.replace('_', ' ')}</h3>
                        <p className="text-primary-foreground/80">
                          {todaysWorkout.completed_at ? 'Completed!' : 'Ready for today\'s workout'}
                        </p>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {todaysWorkout.completed_at ? 'Completed' : 'Scheduled'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-primary-foreground/80">Distance</div>
                        <div className="text-xl font-bold">{todaysWorkout.planned_distance_km} km</div>
                      </div>
                      <div>
                        <div className="text-sm text-primary-foreground/80">Target Pace</div>
                        <div className="text-xl font-bold">{todaysWorkout.planned_pace_per_km}</div>
                      </div>
                      <div>
                        <div className="text-sm text-primary-foreground/80">Duration</div>
                        <div className="text-xl font-bold">{todaysWorkout.planned_duration_minutes} min</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <Heart className="w-6 h-6 mx-auto mb-2 text-destructive" />
                      <div className="text-sm text-muted-foreground">Effort Level</div>
                      <div className="font-semibold">
                        {todaysWorkout.effort_level ? `${todaysWorkout.effort_level}/10` : 'Moderate'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-card rounded-lg border">
                      <Target className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="font-semibold">
                        {todaysWorkout.completed_at ? 'Done' : 'Pending'}
                      </div>
                    </div>
                  </div>

                  {!todaysWorkout.completed_at ? (
                    <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="performance" size="lg" className="w-full">
                          <Play className="w-5 h-5 mr-2" />
                          {t('dashboard.completeWorkout')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{t('dashboard.completeWorkout')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="distance">Distance (km)</Label>
                              <Input
                                id="distance"
                                type="number"
                                step="0.1"
                                placeholder="6.2"
                                value={workoutData.distance}
                                onChange={(e) => setWorkoutData(prev => ({
                                  ...prev,
                                  distance: e.target.value
                                }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="duration">Duration (min)</Label>
                              <Input
                                id="duration"
                                type="number"
                                placeholder="30"
                                value={workoutData.duration}
                                onChange={(e) => setWorkoutData(prev => ({
                                  ...prev,
                                  duration: e.target.value
                                }))}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="effort">Effort Level (1-10)</Label>
                            <Input
                              id="effort"
                              type="number"
                              min="1"
                              max="10"
                              value={workoutData.effortLevel}
                              onChange={(e) => setWorkoutData(prev => ({
                                ...prev,
                                effortLevel: e.target.value
                              }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="notes">Notes (optional)</Label>
                            <Textarea
                              id="notes"
                              placeholder="How did the workout feel?"
                              value={workoutData.notes}
                              onChange={(e) => setWorkoutData(prev => ({
                                ...prev,
                                notes: e.target.value
                              }))}
                            />
                          </div>
                          <Button onClick={handleCompleteWorkout} className="w-full">
                            Save Workout
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="text-green-700 font-medium">Workout Completed!</p>
                      <p className="text-sm text-green-600">
                        {todaysWorkout.actual_distance_km}km in {todaysWorkout.actual_duration_minutes} minutes
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No workout scheduled for today.</p>
                  <p className="text-sm">Check back tomorrow or create a new training plan!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Column */}
          <div className="space-y-6">
            {/* Recovery Score */}
            <Card className="shadow-achievement">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Moon className="w-5 h-5 text-accent" />
                  Recovery Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recoveryData ? (
                  <>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold gradient-recovery bg-clip-text text-transparent">
                        {recoveryData.recovery_score}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {recoveryData.recovery_score >= 80 ? 'Excellent' : 
                         recoveryData.recovery_score >= 60 ? 'Good' : 
                         recoveryData.recovery_score >= 40 ? 'Fair' : 'Poor'}
                      </div>
                    </div>
                    <Progress value={recoveryData.recovery_score} className="mb-3" />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-muted-foreground">HRV</div>
                        <div className="font-semibold text-success">{recoveryData.hrv_score}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground">Sleep</div>
                        <div className="font-semibold text-success">{recoveryData.sleep_duration_hours}h</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    <p>Connect your wearables to see recovery data</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Distance Goal</span>
                    <span className="font-semibold">
                      {weeklyProgress.completedDistance.toFixed(1)}/{weeklyProgress.targetDistance.toFixed(1)} km
                    </span>
                  </div>
                  <Progress value={(weeklyProgress.completedDistance / weeklyProgress.targetDistance) * 100} />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Workouts</span>
                    <span className="font-semibold">
                      {weeklyProgress.completedWorkouts}/{weeklyProgress.targetWorkouts}
                    </span>
                  </div>
                  <Progress value={(weeklyProgress.completedWorkouts / weeklyProgress.targetWorkouts) * 100} />
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-secondary" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {recoveryData && recoveryData.recovery_score > 80 
                    ? "Your recovery is excellent! Consider adding an extra easy run this week."
                    : recoveryData && recoveryData.recovery_score < 60
                    ? "Focus on recovery today. Consider a rest day or light cross-training."
                    : "Your training is progressing well. Stay consistent with your current plan."
                  }
                </div>
                <Button variant="ghost" size="sm" className="mt-3 w-full">
                  View More Insights
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;