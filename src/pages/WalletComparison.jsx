
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Plus, 
  X, 
  Search, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Activity,
  Eye,
  Loader2,
  Zap, // New import for Gas Fees
  Users, // New import for Smart Money
  Image // New import for NFT Activity
} from "lucide-react";
import { User } from "@/api/entities";
import { WatchedWallet } from "@/api/entities";
import { WalletReport } from "@/api/entities";
import { UserSubscription } from "@/api/entities"; // Added import for UserSubscription
import { InvokeLLM } from "@/api/integrations";
import WalletIdentifier from "../components/wallet/WalletIdentifier";
import { getWalletName } from "../components/wallet/walletNaming";
import { useToast } from "@/components/ui/use-toast";
import LimitReachedModal from "../components/watchlist/LimitReachedModal";
import { planConfig } from "./Pricing"; // Added import for planConfig

// Mock health data generator
const generateMockHealthData = (wallet) => {
  const seed = wallet.wallet_address.slice(-4);
  const seedNum = parseInt(seed, 16);
  const baseScore = 65 + (seedNum % 30);
  const riskLevels = ['low', 'medium', 'high'];

  return {
    overall_score: baseScore,
    portfolio_value: 12500 + (seedNum % 100 * 180),
    daily_change: ((seedNum % 21) - 10) / 10,
    security_posture: Math.max(70, baseScore + (seedNum % 10) - 5),
    performance_trends: Math.max(40, baseScore + (seedNum % 25) - 12),
    defi_protocols: 3 + (seedNum % 8),
    risk_level: riskLevels[seedNum % riskLevels.length], // Use a more distributed risk level
    profit_loss_30d: (seedNum % 2 === 0 ? 1 : -1) * (1000 + (seedNum % 50 * 20)), // Mock 30d P&L
    gas_fees_30d: 50 + (seedNum % 100), // Mock gas fees
    smart_money_score: 50 + (seedNum % 50), // Mock smart money score
    nft_activity_score: 30 + (seedNum % 70) // Mock NFT activity score
  };
};

export default function WalletComparison() {
  const [watchedWallets, setWatchedWallets] = useState([]);
  const [selectedWallets, setSelectedWallets] = useState([null, null, null]);
  const [manualAddress, setManualAddress] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("ethereum");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null); // New state for subscription
  const [walletCount, setWalletCount] = useState(0); // New state for wallet count
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false); // New state for limit modal
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const wallets = await WatchedWallet.filter(
        { created_by: currentUser.email, is_active: true },
        "-created_date"
      );
      setWatchedWallets(wallets);
      setWalletCount(wallets.length); // Set wallet count

      const subs = await UserSubscription.filter({ created_by: currentUser.email });
      if (subs.length > 0) {
        setSubscription(subs[0]); // Set user's subscription
      }

    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleWalletSelect = (index, walletId) => {
    const wallet = watchedWallets.find(w => w.id === walletId);
    if (wallet) {
      const newSelected = [...selectedWallets];
      newSelected[index] = { ...wallet, health: generateMockHealthData(wallet) };
      setSelectedWallets(newSelected);
    }
  };

  const handleManualAdd = async () => {
    if (!manualAddress.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Check if we already have a report for this wallet
      const existingReports = await WalletReport.filter({
        wallet_address: manualAddress,
        blockchain: selectedBlockchain,
        created_by: user.email
      }, "-created_date", 1);

      let report = null;
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      if (existingReports.length > 0 && 
          new Date(existingReports[0].created_date) > oneHourAgo) {
        report = existingReports[0];
      } else {
        // Generate quick analysis for comparison
        const analysisPrompt = `
        Analyze the ${selectedBlockchain} wallet: ${manualAddress}
        
        Provide a brief analysis focusing on:
        1. Risk assessment
        2. Portfolio overview
        3. Recent activity patterns
        
        Keep it concise for comparison purposes.
        `;

        const aiAnalysis = await InvokeLLM({
          prompt: analysisPrompt,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              risk_score: { type: "string", enum: ["low", "medium", "high"] },
              portfolio_value_usd: { type: "number" },
              ai_summary: { type: "string" }
            },
            required: ["risk_score", "ai_summary"]
          }
        });

        report = {
          wallet_address: manualAddress,
          blockchain: selectedBlockchain,
          risk_score: aiAnalysis.risk_score || "medium",
          portfolio_value_usd: aiAnalysis.portfolio_value_usd || 0,
          ai_summary: aiAnalysis.ai_summary || "Analysis completed.",
          analysis_date: new Date().toISOString()
        };
      }

      // Find first empty slot
      const emptyIndex = selectedWallets.findIndex(w => w === null);
      if (emptyIndex !== -1) {
        const formalName = getWalletName(manualAddress);
        const walletForComparison = {
          ...report,
          nickname: formalName?.name,
          health: generateMockHealthData(report), // Generate health data for manual wallets too
          isNewWallet: true
        };
        
        const newSelected = [...selectedWallets];
        newSelected[emptyIndex] = walletForComparison;
        setSelectedWallets(newSelected);
        setManualAddress("");
        
        toast({
          title: "Wallet Added",
          description: "Wallet has been added to comparison",
          className: "bg-green-900 border-green-700 text-white"
        });
      }
    } catch (error) {
      console.error("Error analyzing wallet:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the wallet. Please try again.",
        variant: "destructive",
        className: "bg-red-900 border-red-700 text-white"
      });
    }
    setIsAnalyzing(false);
  };

  const addToWatchlist = async (wallet) => {
    // Enforce watchlist limit
    const limit = planConfig[subscription?.plan]?.watchlist_limit;
    if (limit !== null && walletCount >= limit) {
      setIsLimitModalOpen(true);
      return;
    }

    try {
      const formalName = getWalletName(wallet.wallet_address);
      const nickname = formalName?.name || `Wallet ${wallet.wallet_address.slice(0, 6)}...`;
      
      await WatchedWallet.create({
        wallet_address: wallet.wallet_address,
        blockchain: wallet.blockchain,
        nickname: nickname,
        ai_summary: wallet.ai_summary,
        last_checked: new Date().toISOString(),
        is_active: true
      });
      
      toast({
        title: "Added to Watchlist",
        description: `${nickname} is now being monitored`,
        className: "bg-green-900 border-green-700 text-white"
      });
      
      setWalletCount(prev => prev + 1); // Increment wallet count on success
      loadData(); // Refresh the watched wallets list
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast({
        title: "Error",
        description: "Failed to add wallet to watchlist.",
        variant: "destructive",
        className: "bg-red-900 border-red-700 text-white"
      });
    }
  };

  const clearWallet = (index) => {
    const newSelected = [...selectedWallets];
    newSelected[index] = null;
    setSelectedWallets(newSelected);
  };

  const clearAll = () => {
    setSelectedWallets([null, null, null]);
  };

  const ComparisonCard = ({ wallet, index }) => {
    if (!wallet) {
      return (
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)] h-full">
          <CardContent className="p-6 flex items-center justify-center h-96">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Select a wallet to compare</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    const getRiskColor = (risk) => {
      switch (risk) {
        case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
        default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      }
    };

    return (
      <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)] h-full">
        {/* Security Risk Header - Prominent Display */}
        <div className={`p-4 rounded-t-lg border-2 ${getRiskColor(wallet.health?.risk_level)}`}>
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-6 h-6" />
            <div className="text-center">
              <div className="text-lg font-bold uppercase">
                {wallet.health?.risk_level || 'medium'} Risk
              </div>
              <div className="text-sm opacity-80">Security Assessment</div>
            </div>
          </div>
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <WalletIdentifier wallet={wallet} showToggle={false} />
            <div className="flex items-center gap-2">
              {wallet.isNewWallet && (
                <Button
                  onClick={() => addToWatchlist(wallet)}
                  size="sm"
                  variant="outline"
                  className="text-[var(--primary)] border-[var(--primary)]"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Watch
                </Button>
              )}
              <Button
                onClick={() => clearWallet(index)}
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Badge variant="outline" className="capitalize text-gray-300 border-gray-600 w-fit">
            {wallet.blockchain}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* All 8 KPI Metrics in a comprehensive grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--surface)] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">Portfolio</span>
              </div>
              <div className="text-lg font-bold text-white">
                ${wallet.health?.portfolio_value?.toLocaleString() || 0}
              </div>
            </div>
            
            <div className="bg-[var(--surface)] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Health</span>
              </div>
              <div className="text-lg font-bold text-white">
                {wallet.health?.overall_score || 0}/100
              </div>
            </div>
            
            <div className="bg-[var(--surface)] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Performance</span>
              </div>
              <div className="text-lg font-bold text-white">
                {wallet.health?.performance_trends || 0}%
              </div>
            </div>
            
            <div className="bg-[var(--surface)] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-400">Protocols</span>
              </div>
              <div className="text-lg font-bold text-white">
                {wallet.health?.defi_protocols || 0}
              </div>
            </div>

            {/* NEW Enhanced KPIs */}
            <div className="bg-[var(--surface)] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-gray-400">30d P&L</span>
              </div>
              <div className={`text-lg font-bold ${(wallet.health?.profit_loss_30d || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(wallet.health?.profit_loss_30d || 0) >= 0 ? '+' : ''}${(wallet.health?.profit_loss_30d || 0).toLocaleString()}
              </div>
            </div>

            <div className="bg-[var(--surface)] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-400">Gas Fees</span>
              </div>
              <div className="text-lg font-bold text-white">
                ${(wallet.health?.gas_fees_30d || 0).toLocaleString()}
              </div>
            </div>

            <div className="bg-[var(--surface)] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">Smart Money</span>
              </div>
              <div className="text-lg font-bold text-white">
                {wallet.health?.smart_money_score || 0}/100
              </div>
            </div>

            <div className="bg-[var(--surface)] p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Image className="w-4 h-4 text-pink-400" />
                <span className="text-xs text-gray-400">NFT Activity</span>
              </div>
              <div className="text-lg font-bold text-white">
                {wallet.health?.nft_activity_score || 0}/100
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {wallet.ai_summary && (
            <div className="bg-[var(--surface)] p-3 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">AI Analysis</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                {wallet.ai_summary.length > 150 
                  ? `${wallet.ai_summary.substring(0, 150)}...` 
                  : wallet.ai_summary
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Wallet Comparison Tool</h1>
            <p className="text-gray-400">Compare up to 3 wallets side by side to identify the best opportunities.</p>
          </div>
          <Button onClick={clearAll} variant="outline" className="text-gray-300 border-gray-600">
            Clear All
          </Button>
        </div>

        {/* Wallet Selection Controls */}
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="text-white">Add Wallets to Compare</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Select from Watched Wallets */}
            <div className="grid md:grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Wallet {index + 1}
                  </label>
                  <Select onValueChange={(value) => handleWalletSelect(index, value)}>
                    <SelectTrigger className="bg-[var(--surface)] border-gray-700 text-white">
                      <SelectValue placeholder="Select from watchlist" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--surface)] border-gray-700">
                      {watchedWallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id} className="text-white">
                          {wallet.nickname || `${wallet.wallet_address.slice(0, 6)}...${wallet.wallet_address.slice(-4)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Manual Entry */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Or analyze a new wallet</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter wallet address"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    className="bg-[var(--surface)] border-gray-700 text-white"
                  />
                </div>
                <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
                  <SelectTrigger className="w-32 bg-[var(--surface)] border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--surface)] border-gray-700">
                    <SelectItem value="ethereum" className="text-white">Ethereum</SelectItem>
                    <SelectItem value="solana" className="text-white">Solana</SelectItem>
                    <SelectItem value="bitcoin" className="text-white">Bitcoin</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleManualAdd}
                  disabled={!manualAddress.trim() || isAnalyzing}
                  className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {[0, 1, 2].map((index) => (
            <ComparisonCard 
              key={index} 
              wallet={selectedWallets[index]} 
              index={index}
            />
          ))}
        </div>
      </div>
      {/* Limit Reached Modal */}
      <LimitReachedModal isOpen={isLimitModalOpen} onClose={() => setIsLimitModalOpen(false)} />
    </div>
  );
}
