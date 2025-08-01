import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Loader2, BarChart3, Table, Upload } from "lucide-react";
import { User } from "@/api/entities";
import { WatchedWallet } from "@/api/entities";
import { UserSubscription } from "@/api/entities";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useToast } from "@/components/ui/use-toast";
import WalletDetailModal from "../components/watchlist/WalletDetailModal";
import WalletDataTable from "../components/watchlist/WalletDataTable";
import WatchlistFilters from "../components/watchlist/WatchlistFilters";
import WatchlistDashboardView from "../components/watchlist/WatchlistDashboardView";
import BulkUploadModal from "../components/watchlist/BulkUploadModal";

// This mock generator is now a FALLBACK for wallets that don't have real data.
const generateMockHealthData = (wallet) => {
  if (!wallet || !wallet.wallet_address) {
    return { overall_score: 0, portfolio_value: 0, daily_change: 0, risk_level: 'medium', defi_protocols: 0, profit_loss_30d: 0, gas_fees_30d: 0, smart_money_score: 0, nft_activity_score: 0 };
  }
  const seed = wallet.wallet_address.slice(-4);
  const seedNum = parseInt(seed, 16);
  const baseScore = 65 + (seedNum % 30);
  const riskLevels = ['low', 'medium', 'high'];
  return {
    overall_score: baseScore,
    portfolio_value: 12500 + (seedNum % 100 * 180),
    daily_change: ((seedNum % 21) - 10) / 10,
    risk_level: riskLevels[seedNum % riskLevels.length],
    defi_protocols: 3 + (seedNum % 8),
    profit_loss_30d: ((seedNum % 61) - 30) * 100,
    gas_fees_30d: 50 + (seedNum % 200),
    smart_money_score: 40 + (seedNum % 60),
    nft_activity_score: seedNum % 100,
  };
};

export default function Watchlist() {
  const [watchedWallets, setWatchedWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [filters, setFilters] = useState({ ownership: 'all', health: 'all' });
  const [viewMode, setViewMode] = useState('dashboard');
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    loadWatchlistData();
  }, [location]);

  // CORRECTED: This hook now prioritizes REAL data and only uses mock data as a fallback.
  const healthData = useMemo(() => {
    return watchedWallets.map(wallet => {
      // If the wallet has a real score, use the real data.
      if (wallet.overall_score !== null && wallet.overall_score !== undefined) {
        return {
          ...wallet,
          // The 'health' object is kept for downward compatibility with charting components.
          health: {
            overall_score: wallet.overall_score,
            portfolio_value: wallet.portfolio_value || 0,
            risk_level: wallet.risk_level || 'medium',
            // Mocking data that is not yet saved for older wallets.
            daily_change: ((parseInt(wallet.wallet_address.slice(-4), 16) % 21) - 10) / 10,
            defi_protocols: 3 + (parseInt(wallet.wallet_address.slice(-4), 16) % 8),
            profit_loss_30d: ((parseInt(wallet.wallet_address.slice(-4), 16) % 61) - 30) * 100,
            gas_fees_30d: 50 + (parseInt(wallet.wallet_address.slice(-4), 16) % 200),
            smart_money_score: 40 + (parseInt(wallet.wallet_address.slice(-4), 16) % 60),
            nft_activity_score: parseInt(wallet.wallet_address.slice(-4), 16) % 100,
          }
        };
      }
      // Otherwise, use the mock data generator as a fallback.
      return {
        ...wallet,
        health: generateMockHealthData(wallet)
      };
    });
  }, [watchedWallets]);

  const filteredWallets = useMemo(() => {
    return healthData.filter(wallet => {
      const ownershipMatch = filters.ownership === 'all' || wallet.ownership_tag === filters.ownership;
      
      // Filter is now based on the unified 'health.overall_score'.
      const healthScore = wallet.health.overall_score;
      let healthMatch = true;
      if (filters.health === 'good') healthMatch = healthScore >= 80;
      else if (filters.health === 'okay') healthMatch = healthScore >= 70 && healthScore < 80;
      else if (filters.health === 'poor') healthMatch = healthScore < 70;

      return ownershipMatch && healthMatch;
    });
  }, [healthData, filters]);

  const loadWatchlistData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const wallets = await WatchedWallet.filter(
        { created_by: user.email, is_active: true },
        "-created_date"
      );
      setWatchedWallets(wallets);
      
      const subs = await UserSubscription.filter({ created_by: user.email });
      if (subs.length > 0) {
        setSubscription(subs[0]);
      } else {
        setSubscription(null);
      }

    } catch (error) {
      console.error("Error loading watchlist data:", error);
      toast({
        title: "Error Loading Wallets",
        description: "Could not fetch your watchlist data.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleUpdateTag = async (walletId, newTag) => {
    const originalWallets = [...watchedWallets];
    const updatedWallets = watchedWallets.map(w => w.id === walletId ? {...w, ownership_tag: newTag} : w);
    setWatchedWallets(updatedWallets);

    try {
      await WatchedWallet.update(walletId, { ownership_tag: newTag });
      toast({
        title: "Tag Updated",
        description: "Wallet ownership tag has been changed.",
        className: "bg-green-900 border-green-700 text-white"
      });
    } catch (error) {
      console.error("Failed to update tag:", error);
      setWatchedWallets(originalWallets);
      toast({
        title: "Update Failed",
        description: "Could not save the new tag.",
        variant: "destructive"
      });
    }
  };

  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
    setIsModalOpen(true);
  };

  const handleRemoveWallet = async (walletId) => {
    try {
      await WatchedWallet.update(walletId, { is_active: false });
      toast({
        title: "Wallet Removed",
        description: "The wallet has been removed from your watchlist.",
        className: "bg-green-900 border-green-700 text-white"
      });
      setIsModalOpen(false);
      setSelectedWallet(null);
      loadWatchlistData(); 
    } catch (error) {
      console.error("Error removing wallet:", error);
      toast({
        title: "Error",
        description: "Could not remove the wallet.",
        variant: "destructive"
      });
    }
  };

  const EmptyState = () => (
    <div className="text-center py-20 px-6 rounded-xl glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
      <Eye className="w-16 h-16 text-[var(--primary)] mx-auto mb-6 opacity-50" />
      <h3 className="text-2xl font-bold text-white mb-3">Your Watchlist is Empty</h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Add wallets via the Analyzer to start monitoring.
      </p>
      <Button asChild className="bg-gradient-to-r from-[var(--primary)] to-blue-500 hover:from-[var(--primary-dark)] hover:to-blue-600 text-black font-bold">
        <Link to={createPageUrl("Analyzer")}>
          <Plus className="w-5 h-5 mr-2" />
          Analyze a Wallet
        </Link>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Wallet Intelligence Center</h1>
            <p className="text-gray-400">An overview of your tracked wallets and their performance.</p>
          </div>
          <div className="flex items-center gap-2">
            {watchedWallets.length > 0 && (
              <div className="flex items-center bg-[var(--surface)] rounded-lg p-1">
                <Button
                  variant={viewMode === 'dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('dashboard')}
                  className={viewMode === 'dashboard' ? 'bg-[var(--primary)] text-black' : 'text-white'}
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-[var(--primary)] text-black' : 'text-white'}
                >
                  <Table className="w-4 h-4 mr-1" />
                  Grid
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={() => setIsBulkUploadOpen(true)}>
              <Upload className="w-4 h-4 mr-2"/>
              Bulk Upload
            </Button>
            <Button asChild>
              <Link to={createPageUrl("Analyzer")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
          </div>
        ) : watchedWallets.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {viewMode === 'dashboard' ? (
              <WatchlistDashboardView 
                healthData={filteredWallets} 
                onWalletSelect={handleWalletSelect}
              />
            ) : (
              <>
                <WatchlistFilters onFilterChange={setFilters} />
                <WalletDataTable 
                  wallets={filteredWallets} 
                  onUpdateTag={handleUpdateTag}
                  onWalletSelect={handleWalletSelect}
                  onWalletsRemoved={loadWatchlistData}
                />
              </>
            )}
          </div>
        )}
      </div>

      <WalletDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedWallet={selectedWallet}
        onRemoveWallet={handleRemoveWallet}
      />
      
      <BulkUploadModal 
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onWalletsAdded={loadWatchlistData}
        subscription={subscription}
        currentWalletCount={watchedWallets.length}
      />
    </div>
  );
}