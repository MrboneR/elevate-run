import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import OnboardingQuiz from "@/components/OnboardingQuiz";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignUp = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Show onboarding quiz after successful signup
      setShowOnboarding(true);
    }
    setIsLoading(false);
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: t('auth.error'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
    setIsLoading(false);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate("/");
  };

  if (showOnboarding) {
    return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-athletic flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-border">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">RunAI</h1>
          </div>
          <CardTitle>{t('auth.title')}</CardTitle>
          <CardDescription>
            {t('auth.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
              <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <AuthForm
                type="signin"
                onSubmit={handleSignIn}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <AuthForm
                type="signup"
                onSubmit={handleSignUp}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface AuthFormProps {
  type: "signin" | "signup";
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
}

const AuthForm = ({ type, onSubmit, isLoading }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('auth.password')}</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? t('auth.loading') : type === "signin" ? t('auth.signInButton') : t('auth.signUpButton')}
      </Button>
    </form>
  );
};

export default AuthPage;