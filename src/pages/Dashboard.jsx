import React, { useState, useEffect } from "react";
import { WatchedWallet } from "@/api/entities";
import { User } from "@/api/entities";
import { TrendingUp, Shield, DollarSign, Activity, AlertTriangle } from "lucide-react";
import RecoveryStats from "../components/dashboard/RecoveryStats";
import RecentActivity from "../components/dashboard/RecentActivity";
import NetworkBreakdown from "../components/dashboard/NetworkBreakdown";

export default function Dashboard() {
  const [watchedWallets, setWatchedWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        loadData(currentUser.email);
      } catch (e) {
        console.error("User not logged in");
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const loadData = async (userEmail) => {
    setIsLoading(true);
    try {
      const wallets = await WatchedWallet.filter({ created_by: userEmail, is_active: true }, "-created_date", 500);
      setWatchedWallets(wallets);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const getStats = () => {
    if (!watchedWallets || watchedWallets.length === 0) {
        return {
            totalWallets: 0,
            totalValue: 0,
            averageScore: 0,
            highRiskCount: 0
        };
    }
    
    const totalWallets = watchedWallets.length;
    const totalValue = watchedWallets.reduce((sum, wallet) => sum + (wallet.portfolio_value || 0), 0);
    const totalScore = watchedWallets.reduce((sum, wallet) => sum + (wallet.overall_score || 0), 0);
    const averageScore = totalWallets > 0 ? (totalScore / totalWallets) : 0;
    const highRiskCount = watchedWallets.filter(wallet => wallet.risk_level === "high").length;

    return {
      totalWallets,
      totalValue,
      averageScore,
      highRiskCount
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Intelligence <span className="gradient-text">Overview</span>
            </h1>
            <p className="text-gray-400">A high-level view of your wallet watchlist.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-[var(--glass-border)]">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300">System Active</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RecoveryStats
            title="Total Watched Wallets"
            value={stats.totalWallets?.toString() || '0'}
            subtitle="Actively monitored"
            icon={Activity}
            color="text-purple-400"
            bgColor="bg-purple-500/20"
          />
          <RecoveryStats
            title="Total Portfolio Value"
            value={`$${stats.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
            subtitle="Across all wallets"
            icon={DollarSign}
            color="text-green-400"
            bgColor="bg-green-500/20"
          />
          <RecoveryStats
            title="Average Health Score"
            value={`${stats.averageScore?.toFixed(1) || '0.0'}`}
            subtitle="From 1 to 100"
            icon={Shield}
            color="text-[var(--primary)]"
            bgColor="bg-[var(--primary)]/20"
          />
          <RecoveryStats
            title="High-Risk Wallets"
            value={stats.highRiskCount?.toString() || '0'}
            subtitle="Requiring attention"
            icon={AlertTriangle}
            color="text-yellow-400"
            bgColor="bg-yellow-500/20"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity 
              wallets={watchedWallets}
              isLoading={isLoading}
            />
          </div>

          {/* Network Breakdown */}
          <div>
            <NetworkBreakdown 
              wallets={watchedWallets}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}