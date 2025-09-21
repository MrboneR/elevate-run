import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroRunner from "@/assets/hero-runner.jpg";
import { Play, Zap, Brain, Target } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroRunner})` }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-hero bg-clip-text text-transparent">
              RunAI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Your hyper-personalized AI running coach that adapts daily to your sleep, recovery, and performance data
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl" className="group">
              <Play className="w-5 h-5 group-hover:scale-110 transition-quick" />
              Start Training
            </Button>
            <Button variant="outline" size="xl">
              View Demo
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 transition-performance hover:shadow-performance hover:-translate-y-2">
              <div className="text-center">
                <div className="gradient-performance w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">Adaptive AI Coach</h3>
                <p className="text-muted-foreground text-sm">
                  Plans update daily based on your sleep, HRV, stress, and recovery data
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 transition-performance hover:shadow-achievement hover:-translate-y-2">
              <div className="text-center">
                <div className="gradient-achievement w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">Smart Adaptation</h3>
                <p className="text-muted-foreground text-sm">
                  Auto-reschedule workouts and adjust pace based on fatigue signals
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 transition-performance hover:shadow-glow hover:-translate-y-2">
              <div className="text-center">
                <div className="gradient-recovery w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-card-foreground">Injury Prevention</h3>
                <p className="text-muted-foreground text-sm">
                  Early detection of injury risk with personalized recovery routines
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;