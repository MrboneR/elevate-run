import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import coachPersonalities from "@/assets/coach-personalities.jpg";
import { MessageCircle, Users, Trophy, Heart, Smile, Target, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CoachSectionProps {
  onCoachSelect?: (style: 'supportive' | 'motivational' | 'analytical' | 'tough') => void;
}

const CoachSection = ({ onCoachSelect }: CoachSectionProps) => {
  const { t } = useLanguage();
  const coaches = [
    {
      id: "analytical",
      name: "The Professional",
      personality: "Analytical & Data-Driven",
      icon: Target,
      description: "Focuses on precise metrics, structured training, and evidence-based coaching",
      style: "gradient-performance",
      sample: "Based on your HRV data, I recommend reducing tomorrow's intensity by 15%.",
      coachStyle: 'analytical' as const
    },
    {
      id: "supportive",
      name: "The Mentor", 
      personality: "Supportive & Encouraging",
      icon: Heart,
      description: "Provides emotional support, celebrates progress, and builds confidence",
      style: "gradient-recovery",
      sample: "You've been so consistent this week! Let's build on that momentum together.",
      coachStyle: 'supportive' as const
    },
    {
      id: "tough",
      name: "The Challenger",
      personality: "Tough & Motivational",
      icon: Zap,
      description: "Pushes you harder, doesn't accept excuses, focuses on breakthrough performance",
      style: "gradient-achievement",
      sample: "I know you can push harder. Your body is ready - let your mind catch up!",
      coachStyle: 'tough' as const
    },
    {
      id: "motivational",
      name: "The Enthusiast",
      personality: "Motivational & Fun",
      icon: Smile,
      description: "Makes training fun, uses gamification, keeps things light and enjoyable",
      style: "gradient-hero",
      sample: "Time for another adventure! Let's see if we can beat yesterday's split time! 🚀",
      coachStyle: 'motivational' as const
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Meet Your AI Coaches</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('coach.selectStyle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <Card className="overflow-hidden shadow-glow">
            <div className="grid lg:grid-cols-2 gap-0">
              <div 
                className="h-64 lg:h-auto bg-cover bg-center"
                style={{ backgroundImage: `url(${coachPersonalities})` }}
              />
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Conversational AI Coaching</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Chat with your AI coach anytime. Ask questions about your training, get real-time feedback during runs, 
                  or receive motivational support when you need it most.
                </p>
                <div className="flex gap-4">
                  <Button variant="performance">
                    <MessageCircle className="w-4 h-4" />
                    Chat Now
                  </Button>
                  <Button variant="outline">
                    Voice Commands
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {coaches.map((coach, index) => (
            <Card key={coach.id} className="transition-performance hover:shadow-performance hover:-translate-y-2 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className={`${coach.style} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-quick`}>
                  <coach.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{coach.name}</CardTitle>
                <Badge variant="outline" className="mx-auto">
                  {t(`coach.${coach.coachStyle}`)}
                </Badge>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {coach.description}
                </p>
                
                <div className="bg-muted p-3 rounded-lg text-left">
                  <div className="text-xs text-muted-foreground mb-1">Sample coaching style:</div>
                  <div className="text-sm italic">"{coach.sample}"</div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-quick"
                  onClick={() => onCoachSelect?.(coach.coachStyle)}
                >
                  {t('coach.selectCoach')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Social Features */}
        <div className="mt-16">
          <Card className="max-w-4xl mx-auto shadow-achievement">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Users className="w-6 h-6 text-secondary" />
                Social Training & Gamification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="gradient-achievement w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Achievements & XP</h4>
                  <p className="text-sm text-muted-foreground">Earn points for consistency, personal bests, and completing challenges</p>
                </div>
                
                <div>
                  <div className="gradient-performance w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Virtual Group Runs</h4>
                  <p className="text-sm text-muted-foreground">Join AI-led group challenges and compete with runners worldwide</p>
                </div>
                
                <div>
                  <div className="gradient-recovery w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h4 className="font-semibold mb-2">Smart Challenges</h4>
                  <p className="text-sm text-muted-foreground">AI creates personalized challenges based on your progress and goals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CoachSection;