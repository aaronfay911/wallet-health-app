import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, UserCheck } from "lucide-react";
import ChainToggle from "../components/admin/ChainToggle";
import { User } from "@/api/entities";

export default function AdminSettings() {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const currentUser = await User.me();
        setUserRole(currentUser.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole('guest');
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserRole();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <p className="text-gray-400">Loading admin settings...</p>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)] p-8 text-center">
          <UserCheck className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You must be an administrator to view this page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Admin Settings
          </h1>
          <p className="text-gray-400">Manage application-wide configurations.</p>
        </div>

        <ChainToggle />

        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="w-5 h-5 text-[var(--primary)]" />
              Future Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              This section is reserved for future administrative settings such as feature toggles, default values, or integration status displays.
              Sensitive API keys and secrets are managed securely at the Base44 platform level and are not exposed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}