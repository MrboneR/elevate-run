import HeroSection from "@/components/HeroSection";
import Dashboard from "./Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard />;
  }

  // If not authenticated, show hero/landing page with CTA to auth
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="fixed top-4 right-4 z-50">
        <Button asChild>
          <a href="/auth">Get Started</a>
        </Button>
      </div>
    </div>
  );
};

export default Index;
