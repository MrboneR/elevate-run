import HeroSection from "@/components/HeroSection";
import DashboardSection from "@/components/DashboardSection";
import CoachSection from "@/components/CoachSection";
import IntegrationSection from "@/components/IntegrationSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <DashboardSection />
      <CoachSection />
      <IntegrationSection />
    </div>
  );
};

export default Index;
