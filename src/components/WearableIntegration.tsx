import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { 
  Watch, 
  Smartphone, 
  Activity, 
  Wifi, 
  WifiOff, 
  CheckCircle,
  Clock,
  Heart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

interface WearableDevice {
  id: string;
  name: string;
  type: 'garmin' | 'apple_watch' | 'whoop' | 'oura' | 'polar' | 'fitbit';
  connected: boolean;
  lastSync?: string;
  batteryLevel?: number;
}

const WearableIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [devices, setDevices] = useState<WearableDevice[]>([
    {
      id: 'garmin-1',
      name: 'Garmin Forerunner 955',
      type: 'garmin',
      connected: true,
      lastSync: '2 minutes ago',
      batteryLevel: 78
    },
    {
      id: 'apple-1',
      name: 'Apple Watch Series 9',
      type: 'apple_watch',
      connected: false,
      lastSync: '2 hours ago',
      batteryLevel: 45
    },
    {
      id: 'whoop-1',
      name: 'Whoop 4.0',
      type: 'whoop',
      connected: true,
      lastSync: '5 minutes ago',
      batteryLevel: 92
    }
  ]);

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [dataQuality, setDataQuality] = useState({
    heartRate: 95,
    sleep: 88,
    activity: 92,
    recovery: 90
  });

  const deviceIcons = {
    garmin: Watch,
    apple_watch: Watch,
    whoop: Activity,
    oura: Activity,
    polar: Watch,
    fitbit: Smartphone
  };

  const handleConnect = async (deviceId: string) => {
    // Simulate connection process
    setSyncStatus('syncing');
    
    try {
      // In a real app, this would initiate OAuth flow with the device manufacturer
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true, lastSync: 'Just now' }
          : device
      ));
      
      setSyncStatus('success');
      toast({
        title: "Device Connected",
        description: "Successfully connected your wearable device",
      });
    } catch (error) {
      setSyncStatus('error');
      toast({
        title: "Connection Failed",
        description: "Failed to connect device. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: false }
        : device
    ));
    
    toast({
      title: "Device Disconnected",
      description: "Device has been disconnected from RunAI",
    });
  };

  const syncData = async () => {
    if (!user) return;
    
    setSyncStatus('syncing');
    
    try {
      // Simulate data sync
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update last sync times
      setDevices(prev => prev.map(device => 
        device.connected 
          ? { ...device, lastSync: 'Just now' }
          : device
      ));
      
      // Simulate adding wearable data to database
      const mockData = [
        {
          device_type: 'garmin',
          data_type: 'heart_rate',
          value: Math.floor(Math.random() * 40) + 60,
          unit: 'bpm',
          recorded_at: new Date().toISOString()
        },
        {
          device_type: 'whoop',
          data_type: 'recovery',
          value: Math.floor(Math.random() * 30) + 70,
          unit: 'percent',
          recorded_at: new Date().toISOString()
        }
      ];

      for (const data of mockData) {
        await supabase
          .from('wearable_data')
          .insert({
            user_id: user.id,
            ...data
          });
      }
      
      setSyncStatus('success');
      toast({
        title: "Sync Complete",
        description: "All wearable data has been synchronized",
      });
    } catch (error) {
      setSyncStatus('error');
      toast({
        title: "Sync Failed",
        description: "Failed to sync wearable data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            {t('wearable.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map((device) => {
              const IconComponent = deviceIcons[device.type];
              return (
                <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{device.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {device.connected ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            Last sync: {device.lastSync}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <WifiOff className="w-3 h-3 text-red-500" />
                            Not connected
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {device.connected && device.batteryLevel && (
                      <div className="text-sm text-muted-foreground">
                        {device.batteryLevel}%
                      </div>
                    )}
                    <Badge variant={device.connected ? "default" : "secondary"}>
                      {device.connected ? t('wearable.connected') : 'Disconnected'}
                    </Badge>
                    <Button
                      variant={device.connected ? "outline" : "default"}
                      size="sm"
                      onClick={() => device.connected 
                        ? handleDisconnect(device.id) 
                        : handleConnect(device.id)
                      }
                    >
                      {device.connected ? 'Disconnect' : t('wearable.connect')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <Button 
              onClick={syncData}
              disabled={syncStatus === 'syncing'}
              className="w-full"
            >
              {syncStatus === 'syncing' ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Syncing Data...
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 mr-2" />
                  Sync All Devices
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            {t('integration.dataQuality')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(dataQuality).map(([metric, quality]) => (
              <div key={metric} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                  <span>{quality}%</span>
                </div>
                <Progress value={quality} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WearableIntegration;