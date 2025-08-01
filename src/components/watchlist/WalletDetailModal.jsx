
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  PlusCircle, 
  TrendingUp,
  Activity,
  DollarSign,
  Zap,
  ChevronsRight,
  ShieldX // Added ShieldX icon
} from 'lucide-react';
import WalletIdentifier from '../wallet/WalletIdentifier';
import { formatDistanceToNow } from 'date-fns';

const getScoreColor = (score) => {
  if (!score) return "text-gray-400";
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

const getImpactColor = (impact) => {
  return impact >= 0 ? "text-green-400" : "text-red-400";
};

// Mini chart components
const MetricCard = ({ title, value, icon: Icon, colorClass, description }) => (
  <Card className="bg-[var(--surface)] border-gray-700">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${colorClass}/20`}>
          <Icon className={`w-4 h-4 text-${colorClass}`} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-400">{title}</h4>
          <p className="text-lg font-bold text-white">{value}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function WalletDetailModal({ isOpen, onOpenChange, selectedWallet, onRemoveWallet }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!selectedWallet) return null;

  const hasFullReport = selectedWallet && selectedWallet.behavior_profile && selectedWallet.health_score_breakdown;
  const healthScore = selectedWallet.overall_score || selectedWallet.health?.overall_score || 0;
  const lastChecked = selectedWallet.last_checked || new Date().toISOString();

  // Mock data for metrics (in real app, this would come from the wallet data)
  const mockMetrics = {
    portfolioValue: selectedWallet.health?.portfolio_value || 0,
    dailyChange: selectedWallet.health?.daily_change || 0,
    defiProtocols: selectedWallet.health?.defi_protocols || 0,
    gasSpent: selectedWallet.health?.gas_fees_30d || 0,
    smartMoneyScore: selectedWallet.health?.smart_money_score || 0,
    nftActivity: selectedWallet.health?.nft_activity_score || 0
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-[var(--surface)] border-[var(--glass-border)] text-white p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between gap-4">
            {/* Left Side: Wallet Identifier */}
            <div className="flex-shrink-0">
              <WalletIdentifier wallet={selectedWallet} showToggle={false} size="large" />
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize text-gray-300 border-gray-600">
                  {selectedWallet.blockchain}
                </Badge>
                <p className="text-xs text-gray-400">
                  Last checked: {formatDistanceToNow(new Date(lastChecked), { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Center: Behavior Profile */}
            {hasFullReport && (
              <div className="flex-1 flex justify-center items-start gap-4 mx-6 hidden lg:flex">
                <Target className="w-8 h-8 text-purple-400 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-bold text-white text-lg">{selectedWallet.behavior_profile.tag}</h3>
                  <ul className="space-y-1 mt-1">
                    {selectedWallet.behavior_profile.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-1.5 text-xs text-gray-400">
                        <ChevronsRight className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0"/>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Right Side: Health Score */}
            <div className="text-center flex-shrink-0">
              <p className="text-sm text-gray-400 mb-2">Health Score</p>
              <h2 className={`text-4xl font-bold ${getScoreColor(healthScore)}`}>
                {healthScore}<span className="text-xl text-gray-500">/100</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 bg-[var(--background)] m-4 mb-0">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-black">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-black">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="data-[state=active]:bg-[var(--primary)] data-[state=active]:text-black">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Details
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="overview" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MetricCard
                    title="Portfolio Value"
                    value={`$${mockMetrics.portfolioValue.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="green-500"
                    description="Total estimated value"
                  />
                  <MetricCard
                    title="24h Change"
                    value={`${mockMetrics.dailyChange >= 0 ? '+' : ''}${mockMetrics.dailyChange.toFixed(2)}%`}
                    icon={TrendingUp}
                    colorClass={mockMetrics.dailyChange >= 0 ? "green-500" : "red-500"}
                    description="Portfolio change"
                  />
                  <MetricCard
                    title="DeFi Protocols"
                    value={mockMetrics.defiProtocols}
                    icon={Activity}
                    colorClass="blue-500"
                    description="Active protocols"
                  />
                  <MetricCard
                    title="Gas Spent (30d)"
                    value={`$${mockMetrics.gasSpent}`}
                    icon={Zap}
                    colorClass="orange-500"
                    description="Recent network fees"
                  />
                  <MetricCard
                    title="Smart Money Score"
                    value={`${mockMetrics.smartMoneyScore}/100`}
                    icon={Target}
                    colorClass="purple-500"
                    description="Following smart money"
                  />
                  <MetricCard
                    title="NFT Activity"
                    value={`${mockMetrics.nftActivity}/100`}
                    icon={Sparkles}
                    colorClass="pink-500"
                    description="NFT engagement level"
                  />
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4 mt-0">
                {hasFullReport ? (
                  <div className="space-y-4">
                    <Card className="bg-[var(--background)] border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Target className="w-5 h-5 text-purple-400" />
                          Behavior Profile: "{selectedWallet.behavior_profile.tag}"
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="italic text-gray-300 mb-4">"{selectedWallet.behavior_profile.summary}"</p>
                        <p className="text-gray-200 leading-relaxed mb-4">{selectedWallet.ai_summary}</p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-white">Key Behaviors:</h4>
                          <ul className="space-y-1">
                            {selectedWallet.behavior_profile.details.map((detail, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-200">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-[var(--background)] border-gray-700">
                    <CardContent className="p-8 text-center">
                      <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">No AI Analysis Available</h3>
                      <p className="text-gray-400">Run a full analysis on this wallet to see detailed AI insights and behavior profiling.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="breakdown" className="space-y-4 mt-0">
                {hasFullReport ? (
                  <div className="grid gap-4">
                    <Card className="bg-[var(--background)] border-gray-700">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-white">
                              <ShieldCheck className="w-5 h-5 text-blue-400" />
                              Health Score Breakdown
                            </CardTitle>
                            <p className="text-xs text-gray-400 mt-1">
                              🟢 Green = Strengths that boost the score | 🔴 Red = Risks that lower the score
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Baseline: 75 points</p>
                            <p className="text-xs text-gray-500">
                              75 represents a typical crypto wallet with standard activity and moderate diversification
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedWallet.health_score_breakdown.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-[var(--surface)]">
                              <div className="flex items-center gap-2">
                                {item.score_impact > 0 ? <ShieldCheck className="w-4 h-4 text-green-400"/> : <ShieldX className="w-4 h-4 text-red-400"/>}
                                <div>
                                  <p className="text-white font-medium">{item.category}</p>
                                  <p className="text-gray-400 text-sm">{item.description}</p>
                                </div>
                              </div>
                              <p className={`font-mono font-semibold text-lg ${getImpactColor(item.score_impact)}`}>
                                {item.score_impact >= 0 ? '+' : ''}{item.score_impact}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[var(--background)] border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <PlusCircle className="w-5 h-5 text-green-400" />
                          Recommendations to Improve
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {selectedWallet.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface)]">
                              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-green-400">{index + 1}</span>
                              </div>
                              <span className="text-green-300">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-[var(--background)] border-gray-700">
                    <CardContent className="p-8 text-center">
                      <ShieldCheck className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">No Detailed Breakdown Available</h3>
                      <p className="text-gray-400">Run a full analysis to see score breakdowns and recommendations.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer with remove button */}
        {onRemoveWallet && (
          <div className="p-4 border-t border-gray-700">
            <Button
              onClick={() => onRemoveWallet(selectedWallet.id)}
              variant="destructive"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
            >
              Remove from Watchlist
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
