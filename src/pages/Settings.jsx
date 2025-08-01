import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoading(true);
        const user = await User.me();
        // Future user settings would be loaded here
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Future user settings would be saved here
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-400">Manage your general user preferences.</p>
        </div>

        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-[var(--primary)]" />
              General User Settings
            </CardTitle>
            <CardDescription>
              This section is for general user preferences and profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Info className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">Coming Soon</p>
                    <p>Additional user-specific settings will be added here in future updates.</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}