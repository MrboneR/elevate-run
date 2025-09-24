import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardSection from "@/components/DashboardSection";
import CoachSection from "@/components/CoachSection";
import IntegrationSection from "@/components/IntegrationSection";
import WearableIntegration from "@/components/WearableIntegration";
import AICoachChat from "@/components/AICoachChat";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Activity, MessageCircle, Watch, BarChart3 } from "lucide-react";
import TrainingPlanDisplay from "@/components/TrainingPlanDisplay";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const [selectedCoachStyle, setSelectedCoachStyle] = useState<'supportive' | 'motivational' | 'analytical' | 'tough'>('supportive');
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {t('dashboard.overview')}
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {t('dashboard.aiCoach')}
            </TabsTrigger>
            <TabsTrigger value="wearables" className="flex items-center gap-2">
              <Watch className="w-4 h-4" />
              {t('dashboard.devices')}
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t('dashboard.training')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardSection />
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <CoachSection onCoachSelect={setSelectedCoachStyle} />
            <div className="max-w-4xl mx-auto">
              <AICoachChat coachStyle={selectedCoachStyle} />
            </div>
          </TabsContent>

          <TabsContent value="wearables">
            <div className="max-w-4xl mx-auto">
              <WearableIntegration />
            </div>
          </TabsContent>

          <TabsContent value="training">
            <TrainingPlanDisplay />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;