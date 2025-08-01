import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function RecoveryStats({ title, value, subtitle, icon: Icon, color, bgColor }) {
  return (
    <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)] relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgColor} rounded-full opacity-20 transform translate-x-8 -translate-y-8`} />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <div className="text-3xl font-bold text-white">{value}</div>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}