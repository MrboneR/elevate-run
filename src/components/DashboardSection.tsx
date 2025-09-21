import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Heart, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Zap,
  Moon
} from "lucide-react";

const DashboardSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Your Performance Command Center</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time insights from your wearables, personalized training adaptations, and AI-driven coaching
          </p>
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
              <div className="gradient-performance p-6 rounded-lg text-primary-foreground">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">Tempo Run</h3>
                    <p className="text-primary-foreground/80">AI-adapted based on your recovery</p>
                  </div>
                  <Badge className="bg-secondary text-secondary-foreground">
                    Adjusted
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-primary-foreground/80">Distance</div>
                    <div className="text-xl font-bold">6.2 km</div>
                  </div>
                  <div>
                    <div className="text-sm text-primary-foreground/80">Target Pace</div>
                    <div className="text-xl font-bold">4:20/km</div>
                  </div>
                  <div>
                    <div className="text-sm text-primary-foreground/80">Duration</div>
                    <div className="text-xl font-bold">27 min</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-card rounded-lg border">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-destructive" />
                  <div className="text-sm text-muted-foreground">HR Zone</div>
                  <div className="font-semibold">Zone 3-4</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <Target className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <div className="text-sm text-muted-foreground">Effort</div>
                  <div className="font-semibold">Comfortably Hard</div>
                </div>
              </div>

              <Button variant="performance" size="lg" className="w-full">
                <Activity className="w-5 h-5" />
                Start Workout
              </Button>
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
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold gradient-recovery bg-clip-text text-transparent">87</div>
                  <div className="text-sm text-muted-foreground">Excellent</div>
                </div>
                <Progress value={87} className="mb-3" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-muted-foreground">HRV</div>
                    <div className="font-semibold text-success">+12%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Sleep</div>
                    <div className="font-semibold text-success">8.2h</div>
                  </div>
                </div>
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
                    <span className="font-semibold">32/40 km</span>
                  </div>
                  <Progress value={80} />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Training Load</span>
                    <span className="font-semibold">142/150</span>
                  </div>
                  <Progress value={95} />
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
                  Your HRV is 12% above baseline. Consider adding an extra easy run this week to capitalize on this excellent recovery.
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