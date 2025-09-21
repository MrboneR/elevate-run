import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Watch, 
  Smartphone, 
  Heart, 
  Activity, 
  Moon, 
  Utensils,
  CheckCircle,
  Clock,
  Zap,
  Shield
} from "lucide-react";

const IntegrationSection = () => {
  const wearables = [
    { name: "Garmin", status: "connected", icon: Watch, color: "text-success" },
    { name: "Apple Watch", status: "available", icon: Watch, color: "text-muted-foreground" },
    { name: "Whoop", status: "available", icon: Activity, color: "text-muted-foreground" },
    { name: "Oura Ring", status: "available", icon: Moon, color: "text-muted-foreground" },
  ];

  const dataPoints = [
    { name: "Heart Rate", value: 98, icon: Heart, status: "excellent" },
    { name: "Sleep Quality", value: 85, icon: Moon, status: "good" },
    { name: "HRV Tracking", value: 92, icon: Activity, status: "excellent" },
    { name: "Recovery Score", value: 78, icon: Zap, status: "good" },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Seamless Wearable Integration</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect your favorite devices and let AI analyze every aspect of your performance, recovery, and health for truly personalized coaching.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Device Integration */}
          <Card className="shadow-performance">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Connected Devices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {wearables.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <device.icon className={`w-5 h-5 ${device.color}`} />
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {device.status === "connected" ? "Syncing data" : "Not connected"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.status === "connected" ? (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 gradient-performance rounded-lg text-primary-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Last Sync: 2 minutes ago</span>
                </div>
                <div className="text-xs opacity-90">
                  All your training and recovery data is automatically synchronized and analyzed in real-time
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Insights */}
          <Card className="shadow-achievement">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-secondary" />
                Data Quality Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {dataPoints.map((point, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <point.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{point.name}</span>
                    </div>
                    <div className="text-sm font-bold">{point.value}%</div>
                  </div>
                  <Progress 
                    value={point.value} 
                    className={`h-2 ${
                      point.status === "excellent" 
                        ? "bg-success/20" 
                        : point.status === "good" 
                        ? "bg-primary/20" 
                        : "bg-warning/20"
                    }`}
                  />
                </div>
              ))}

              <div className="mt-6 p-4 gradient-recovery rounded-lg text-accent-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Data Privacy Protected</span>
                </div>
                <div className="text-xs opacity-90">
                  Your health data is encrypted and never shared with third parties
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="text-center p-6 transition-performance hover:shadow-performance hover:-translate-y-2">
            <div className="gradient-performance w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Continuous heart rate, HRV, and stress tracking during training and recovery
            </p>
          </Card>

          <Card className="text-center p-6 transition-performance hover:shadow-achievement hover:-translate-y-2">
            <div className="gradient-achievement w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nutrition Sync</h3>
            <p className="text-sm text-muted-foreground">
              AI-driven meal suggestions based on training load, race prep, and weight goals
            </p>
          </Card>

          <Card className="text-center p-6 transition-performance hover:shadow-glow hover:-translate-y-2">
            <div className="gradient-recovery w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Moon className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sleep Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Training plans automatically adjust based on sleep quality and recovery metrics
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;