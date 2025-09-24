import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Activity, ChevronRight, ChevronLeft } from "lucide-react";

interface OnboardingQuizProps {
  onComplete: () => void;
}

const OnboardingQuiz = ({ onComplete }: OnboardingQuizProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const [quizData, setQuizData] = useState({
    running_experience: "",
    race_goal: "",
    weekly_mileage_goal: 10,
    preferred_coach_style: ""
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    const { error } = await supabase
      .from('profiles')
      .update(quizData)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      toast({
        title: t('onboarding.error'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t('onboarding.success'),
        description: t('onboarding.successDescription'),
      });
      onComplete();
    }
    setIsLoading(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return quizData.running_experience !== "";
      case 1: return quizData.race_goal !== "";
      case 2: return true; // weekly mileage always has a value
      case 3: return quizData.preferred_coach_style !== "";
      default: return false;
    }
  };

  const steps = [
    // Step 1: Running Experience
    <div key="experience" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t('onboarding.experienceTitle')}</h2>
        <p className="text-muted-foreground">{t('onboarding.experienceDescription')}</p>
      </div>
      
      <div className="space-y-4">
        {['beginner', 'intermediate', 'advanced', 'professional'].map((level) => (
          <button
            key={level}
            onClick={() => setQuizData(prev => ({ ...prev, running_experience: level }))}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              quizData.running_experience === level
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <div className="font-medium">{t(`onboarding.experience.${level}`)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {t(`onboarding.experienceDesc.${level}`)}
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Running Goal
    <div key="goal" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t('onboarding.goalTitle')}</h2>
        <p className="text-muted-foreground">{t('onboarding.goalDescription')}</p>
      </div>
      
      <div className="space-y-4">
        {['fitness', '5k', '10k', 'half_marathon', 'marathon', 'ultra'].map((goal) => (
          <button
            key={goal}
            onClick={() => setQuizData(prev => ({ ...prev, race_goal: goal }))}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              quizData.race_goal === goal
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <div className="font-medium">{t(`onboarding.goal.${goal}`)}</div>
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Weekly Training Time
    <div key="weekly" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t('onboarding.weeklyTitle')}</h2>
        <p className="text-muted-foreground">{t('onboarding.weeklyDescription')}</p>
      </div>
      
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">
            {quizData.weekly_mileage_goal} {t('onboarding.hoursPerWeek')}
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>{t('onboarding.selectHours')}</Label>
          <Slider
            value={[quizData.weekly_mileage_goal]}
            onValueChange={(value) => setQuizData(prev => ({ ...prev, weekly_mileage_goal: value[0] }))}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>1 {t('onboarding.hour')}</span>
            <span>20 {t('onboarding.hours')}</span>
          </div>
        </div>
      </div>
    </div>,

    // Step 4: Coach Style
    <div key="coach" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t('onboarding.coachTitle')}</h2>
        <p className="text-muted-foreground">{t('onboarding.coachDescription')}</p>
      </div>
      
      <div className="space-y-4">
        {['supportive', 'motivational', 'analytical', 'tough'].map((style) => (
          <button
            key={style}
            onClick={() => setQuizData(prev => ({ ...prev, preferred_coach_style: style }))}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              quizData.preferred_coach_style === style
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <div className="font-medium">{t(`onboarding.coach.${style}`)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {t(`onboarding.coachDesc.${style}`)}
            </div>
          </button>
        ))}
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen bg-gradient-athletic flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm border-border">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">RunAI</h1>
          </div>
          <CardTitle>{t('onboarding.title')}</CardTitle>
          <CardDescription>
            {t('onboarding.subtitle')} ({currentStep + 1}/4)
          </CardDescription>
          <div className="w-full bg-secondary rounded-full h-2 mt-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {steps[currentStep]}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t('onboarding.back')}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
            >
              {currentStep === 3 ? (
                isLoading ? t('onboarding.completing') : t('onboarding.complete')
              ) : (
                <>
                  {t('onboarding.next')}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingQuiz;