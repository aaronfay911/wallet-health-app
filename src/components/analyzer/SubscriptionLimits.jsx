
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const planDetails = {
  free: { name: "Free", color: "bg-gray-500/20 text-gray-400", icon: AlertTriangle },
  starter: { name: "Starter", color: "bg-blue-500/20 text-blue-400", icon: Zap },
  pro: { name: "Pro", color: "bg-purple-500/20 text-purple-400", icon: Crown },
  enterprise: { name: "Enterprise", color: "bg-gold-500/20 text-yellow-400", icon: Crown }
};

export default function SubscriptionLimits({ subscription, remainingReports }) {
  if (!subscription) return null;

  const plan = planDetails[subscription.plan];
  const Icon = plan.icon;
  const isAtLimit = subscription.plan === "free" && remainingReports === 0;

  return (
    <Card className={`glass-effect border-[var(--glass-border)] bg-[var(--glass)] ${isAtLimit ? 'border-red-500/30' : ''}`}>
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${plan.color} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <Badge className={`${plan.color} w-fit`}>
                  {plan.name} Plan
                </Badge>
                <span className="text-xs md:text-sm text-gray-400 break-words">
                  {subscription.reports_limit !== null
                    ? `${remainingReports} of ${subscription.reports_limit} reports remaining`
                    : "Unlimited reports"
                  }
                </span>
              </div>
              {isAtLimit && (
                <p className="text-xs md:text-sm text-red-400 mt-1 leading-relaxed">
                  You've used all your free reports this month. Upgrade to continue analyzing.
                </p>
              )}
            </div>
          </div>
          
          {subscription.plan === "free" && (
            <Button asChild variant="outline" size="sm" className="border-[var(--primary)] text-[var(--primary)] flex-shrink-0 font-semibold hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]">
              <Link to={createPageUrl("Pricing")}>
                Upgrade Now
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

