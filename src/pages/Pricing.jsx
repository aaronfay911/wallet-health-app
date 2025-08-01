import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Building, Rocket, Star, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { createStripeCheckoutSession } from "@/api/functions";
import { useToast } from "@/components/ui/use-toast";

export const planConfig = {
  free: { 
    name: "Free",
    price: "$0",
    period: "forever",
    description: "3 reports/month, AI view, limited metrics, no watchlist",
    reports_limit: 3, 
    watchlist_limit: 0,
    features: [
      "3 wallet reports per month",
      "Basic risk assessment",
      "AI-powered insights"
    ]
  },
  starter: { 
    name: "Starter",
    price: "$29.99",
    period: "/mo",
    description: "All features unlocked",
    reports_limit: null, 
    watchlist_limit: 20,
    features: ["All features unlocked"]
  },
  builder: { 
    name: "Builder",
    price: "$49.99",
    period: "/mo",
    description: "All features unlocked",
    reports_limit: null, 
    watchlist_limit: 50,
    features: ["All features unlocked"]
  },
  operator: { 
    name: "Operator",
    price: "$79.99",
    period: "/mo",
    description: "All features unlocked",
    reports_limit: null, 
    watchlist_limit: 100,
    features: ["All features unlocked"]
  },
  power: { 
    name: "Power",
    price: "$129.99",
    period: "/mo",
    description: "All features unlocked",
    reports_limit: null, 
    watchlist_limit: 250,
    features: ["All features unlocked"]
  },
  enterprise: { 
    name: "Enterprise",
    price: "$199.99+",
    period: "/mo",
    description: "All features unlocked",
    reports_limit: null, 
    watchlist_limit: 500,
    features: ["All features unlocked"]
  },
};

const icons = {
  free: Zap,
  starter: Star,
  builder: Rocket,
  operator: Crown,
  power: Building,
  enterprise: Building
};

const planOrder = ["free", "starter", "builder", "operator", "power", "enterprise"];

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const { toast } = useToast();

  const handleUpgrade = async (planId) => {
    if (planId === 'free') {
      // Free plan - redirect to analyzer
      window.location.href = createPageUrl("Analyzer");
      return;
    }

    setLoadingPlan(planId);
    
    try {
      const { data } = await createStripeCheckoutSession({ planId });
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Payment Error",
        description: "Unable to start checkout process. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="gradient-text">Find Your Edge</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Simple, powerful pricing that scales with you. All paid plans include every feature we offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {planOrder.map((planId) => {
            const plan = planConfig[planId];
            if (!plan) return null;
            const Icon = icons[planId];
            const isPopular = planId === 'builder';
            const isLoading = loadingPlan === planId;

            return (
              <Card 
                key={plan.name}
                className={`glass-effect border-[var(--glass-border)] bg-[var(--glass)] relative flex flex-col ${
                  isPopular ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary)]/25' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[var(--primary)] text-black px-3 py-1 text-xs">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-3 px-4">
                   <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-500/20 flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 text-gray-300`} />
                  </div>
                  
                  <CardTitle className="text-white text-lg md:text-xl mb-2">{plan.name}</CardTitle>
                  
                  <div className="mb-3">
                    <span className="text-2xl md:text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 px-4 pb-4 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="text-center mb-4 p-3 bg-[var(--surface)] rounded-lg">
                      <p className="font-bold text-white">
                        {plan.watchlist_limit > 0 ? `Up to ${plan.watchlist_limit} Wallets` : "No Watchlist"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-3 h-3 md:w-4 md:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs md:text-sm text-gray-300 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleUpgrade(planId)}
                    disabled={isLoading}
                    className={`w-full text-sm py-2 font-semibold mt-6 ${
                      isPopular
                        ? 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black' 
                        : 'bg-[var(--surface)] hover:bg-gray-700 text-white border border-gray-600'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      planId === "free" ? "Get Started" : "Upgrade Now"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}