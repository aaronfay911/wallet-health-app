
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Shield, TrendingUp, Loader2, AlertTriangle } from "lucide-react";
import { User } from "@/api/entities";
import { UserSubscription } from "@/api/entities";
import { WalletReport } from "@/api/entities";
import { WatchedWallet } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { performWalletAnalysis } from "../components/analyzer/analysisHelper";
import WalletAnalysisForm from "../components/analyzer/WalletAnalysisForm";
import ReportDisplay from "../components/analyzer/ReportDisplay";
import SubscriptionLimits from "../components/analyzer/SubscriptionLimits";
import AddToWatchlistButton from "../components/analyzer/AddToWatchlistButton";
import LimitReachedModal from "../components/watchlist/LimitReachedModal";
import { planConfig } from "./Pricing";
import { toast } from "@/components/ui/use-toast"; // Import for toast notifications

export default function Analyzer() {
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("ethereum");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [error, setError] = useState(null);
  const [userSubscription, setUserSubscription] = useState(null);
  const [user, setUser] = useState(null);
  const [walletCount, setWalletCount] = useState(0);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  useEffect(() => {
    loadUserData();
    
    // Check for successful upgrade
    const urlParams = new URLSearchParams(window.location.search);
    const upgradeSuccess = urlParams.get('upgrade_success');
    const planName = urlParams.get('plan');
    
    if (upgradeSuccess === 'true' && planName) {
      toast({
        title: "Upgrade Successful!",
        description: `Welcome to the ${planName} plan! Your new features are now active.`,
        className: "bg-green-900 border-green-700 text-white"
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const watchedWallets = await WatchedWallet.filter({ created_by: currentUser.email, is_active: true });
      setWalletCount(watchedWallets.length);

      // Get or create user subscription
      let subscriptions = await UserSubscription.filter({ created_by: currentUser.email });
      let currentSub;

      if (subscriptions.length === 0) {
        currentSub = await UserSubscription.create({
          plan: "free",
          reports_used_this_month: 0,
          reports_limit: planConfig.free.reports_limit,
          watchlist_limit: planConfig.free.watchlist_limit,
          subscription_start: new Date().toISOString()
        });
      } else {
        currentSub = subscriptions[0];
      }
      
      // Check for upgrade parameter in URL and handle it
      const urlParams = new URLSearchParams(window.location.search);
      const upgradeTo = urlParams.get('upgrade_to');
      if (upgradeTo && planConfig[upgradeTo] && currentSub.plan !== upgradeTo) {
        const upgradedSub = await handleUpgrade(upgradeTo, currentSub);
        setUserSubscription(upgradedSub);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setUserSubscription(currentSub);
      }

    } catch (e) {
      console.error("Error loading user data:", e);
    }
  };

  const handleUpgrade = async (planId, currentSub = userSubscription) => {
    if (!currentSub || !planConfig[planId]) return;

    const newPlanDetails = planConfig[planId];
    const updatedSubData = {
      plan: newPlanDetails.name,
      reports_used_this_month: 0,
      reports_limit: newPlanDetails.reports_limit,
      watchlist_limit: newPlanDetails.watchlist_limit,
      subscription_start: new Date().toISOString()
    };
    
    await UserSubscription.update(currentSub.id, updatedSubData);
    const newSub = { ...currentSub, ...updatedSubData };
    return newSub;
  };

  const canAnalyze = () => {
    if (!userSubscription) return false;
    if (userSubscription.reports_limit === null) {
      return true;
    }
    return userSubscription.reports_used_this_month < userSubscription.reports_limit;
  };

  const analyzeWallet = async () => {
    if (!walletAddress || !canAnalyze()) return;

    setIsAnalyzing(true);
    setError(null);
    setCurrentReport(null);

    try {
        const currentUser = await User.me();
        
        // Use the refactored helper function
        const analysisResult = await performWalletAnalysis(walletAddress, selectedBlockchain);

        // Create the detailed WalletReport
        const report = await WalletReport.create({
          ...analysisResult,
          created_by: currentUser.email,
        });

        // Update usage count
        if (userSubscription.reports_limit !== null) {
          const updatedUsage = userSubscription.reports_used_this_month + 1;
          await UserSubscription.update(userSubscription.id, {
            reports_used_this_month: updatedUsage
          });
          setUserSubscription({
            ...userSubscription,
            reports_used_this_month: updatedUsage
          });
        }
        
        setCurrentReport(report);

    } catch (err) {
      console.error("Analysis error:", err);
      setError("Unable to generate the new report. The AI model may be busy. Please try again.");
    }

    setIsAnalyzing(false);
  };

  const getRemainingReports = () => {
    if (!userSubscription) return 0;
    if (userSubscription.reports_limit === null) {
      return "Unlimited";
    }
    return Math.max(0, userSubscription.reports_limit - userSubscription.reports_used_this_month);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="gradient-text">Wallet Watchdog</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            AI-powered on-chain intelligence. Analyze any crypto wallet for risk, alpha, and trading patterns.
          </p>
        </div>

        {/* Subscription Status */}
        <SubscriptionLimits 
          subscription={userSubscription}
          remainingReports={getRemainingReports()}
        />

        {/* Analysis Form */}
        <WalletAnalysisForm
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          selectedBlockchain={selectedBlockchain}
          setSelectedBlockchain={setSelectedBlockchain}
          onAnalyze={analyzeWallet}
          isAnalyzing={isAnalyzing}
          canAnalyze={canAnalyze()}
        />
        
        {/* Analysis Progress */}
        {isAnalyzing && (
          <Card className="glass-effect border-[var(--primary)]/30 bg-[var(--primary)]/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white">Analyzing Wallet...</h3>
                  <p className="text-sm text-gray-400">
                    Our AI is researching this wallet across multiple data sources. This may take 30-60 seconds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="glass-effect border-red-500/30 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-400 mb-1">Analysis Failed</h3>
                  <p className="text-sm text-gray-300">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Display with Add to Watchlist Button */}
        {currentReport && (
          <div className="space-y-6">
            <ReportDisplay report={currentReport} subscription={userSubscription} />
            
            {/* Add to Watchlist Button */}
            <div className="flex justify-center">
              <AddToWatchlistButton 
                report={currentReport}
                subscription={userSubscription}
                walletCount={walletCount}
                onLimitReached={() => setIsLimitModalOpen(true)}
                onWalletAdded={() => setWalletCount(prev => prev + 1)}
              />
            </div>
          </div>
        )}
      </div>
      <LimitReachedModal isOpen={isLimitModalOpen} onClose={() => setIsLimitModalOpen(false)} />
    </div>
  );
}
