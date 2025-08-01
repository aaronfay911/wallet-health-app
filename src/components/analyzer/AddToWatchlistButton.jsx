
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Check, Loader2, Plus } from 'lucide-react';
import { WatchedWallet } from '@/api/entities';
import { User } from '@/api/entities';
import { useToast } from '@/components/ui/use-toast';
import { planConfig } from '../../pages/Pricing';

export default function AddToWatchlistButton({ report, subscription, walletCount, onLimitReached, onWalletAdded }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnWatchlist, setIsOnWatchlist] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if this wallet is already on the user's watchlist
    const checkWatchlist = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        const existing = await WatchedWallet.filter({
          wallet_address: report.wallet_address,
          blockchain: report.blockchain,
          created_by: user.email,
          is_active: true
        }, '', 1);

        setIsOnWatchlist(existing.length > 0);
      } catch (error) {
        console.error("Error checking watchlist:", error);
      }
      setIsLoading(false);
    };

    if (report) {
      checkWatchlist();
    }
  }, [report]);

  const handleAddToWatchlist = async () => {
    // Check against plan limits BEFORE adding
    const limit = planConfig[subscription?.plan]?.watchlist_limit;
    if (limit !== null && walletCount >= limit) {
      if (onLimitReached) onLimitReached();
      return;
    }

    setIsAdding(true);
    try {
      // Determine risk level from AI summary
      const riskLevel = report.ai_summary.toLowerCase().includes("high-risk") ? "high" : 
                        (report.ai_summary.toLowerCase().includes("medium risk") ? "medium" : "low");

      // Now saves the entire report structure, not just flattened fields.
      const watchlistData = {
        wallet_address: report.wallet_address,
        blockchain: report.blockchain,
        nickname: report.wallet_label || `${report.wallet_address.slice(0, 6)}...${report.wallet_address.slice(-4)}`,
        
        // Storing the full, rich data structures
        ai_summary: report.ai_summary,
        behavior_profile: report.behavior_profile,
        health_score_breakdown: report.health_score_breakdown,
        recommendations: report.recommendations,
        score_trend: report.score_trend,
        overall_score: report.overall_health_score,
        
        portfolio_value: 0, // This data is not available from the report currently
        risk_level: riskLevel,
        last_checked: report.analysis_date,
        is_active: true
      };

      await WatchedWallet.create(watchlistData);
      setIsOnWatchlist(true);
      if (onWalletAdded) onWalletAdded();
      
      toast({
        title: "Added to Watchlist",
        description: `${watchlistData.nickname} is now being monitored in your watchlist.`,
        className: "bg-green-900 border-green-700 text-white"
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast({
        title: "Error",
        description: "Could not add wallet to watchlist. Please try again.",
        variant: "destructive"
      });
    }
    setIsAdding(false);
  };

  if (isLoading) {
    return (
      <Button disabled size="sm" variant="outline">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Checking...
      </Button>
    );
  }

  if (isOnWatchlist) {
    return (
      <Button disabled size="sm" variant="outline" className="text-green-400 border-green-400">
        <Check className="w-4 h-4 mr-2" />
        On Watchlist
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleAddToWatchlist}
      disabled={isAdding}
      size="sm" 
      className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black"
    >
      {isAdding ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Plus className="w-4 h-4 mr-2" />
      )}
      {isAdding ? "Adding..." : "Add to Watchlist"}
    </Button>
  );
}
