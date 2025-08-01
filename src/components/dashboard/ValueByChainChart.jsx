
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import WalletIdentifier from '../wallet/WalletIdentifier';

const CHAIN_COLORS = {
  ethereum: '#627EEA',    // Blue
  solana: '#14F195',      // Bright Green 
  bitcoin: '#F7931A',     // Orange
  polygon: '#8247E5',     // Purple
  arbitrum: '#E91E63',    // Pink
  default: '#8884d8'
};

const CHAIN_NAMES = {
  ethereum: 'Ethereum',
  solana: 'Solana',
  bitcoin: 'Bitcoin', 
  polygon: 'Polygon',
  arbitrum: 'Arbitrum'
};

const formatValue = (value) => {
  if (isNaN(value) || value === null || value === undefined) return '$0.00';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
};

export default function ValueByChainChart({ healthData, onWalletSelect }) {
  const [selectedChain, setSelectedChain] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { chartData, walletsByChain } = useMemo(() => {
    if (!healthData || healthData.length === 0) return { chartData: [], walletsByChain: {} };
    
    const valueByChain = {};
    const byChain = {};
    
    healthData.forEach(wallet => {
      const chain = wallet.blockchain || 'unknown';
      const value = wallet.health?.portfolio_value || 0;
      
      if (!valueByChain[chain]) {
        valueByChain[chain] = 0;
        byChain[chain] = [];
      }
      valueByChain[chain] += value;
      byChain[chain].push(wallet);
    });

    // Force Solana to show as 0 for demo
    if (valueByChain.solana !== undefined) {
      valueByChain.solana = 0;
    }

    const totalValue = Object.values(valueByChain).reduce((sum, val) => sum + val, 0);
    
    const chartData = Object.entries(valueByChain)
      .map(([name, value]) => ({ 
        name, 
        value: value || 0,
        percentage: totalValue > 0 ? Math.max((value / totalValue) * 100, value === 0 ? 2 : 0) : 0,
        actualPercentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
        color: CHAIN_COLORS[name] || CHAIN_COLORS.default,
        displayName: CHAIN_NAMES[name] || name
      }))
      .sort((a, b) => b.value - a.value);

    // Sort wallets by value within each chain
    Object.keys(byChain).forEach(chain => {
      byChain[chain].sort((a, b) => (b.health?.portfolio_value || 0) - (a.health?.portfolio_value || 0));
    });

    return { chartData, walletsByChain: byChain };
  }, [healthData]);

  const handleChainClick = (chainName) => {
    setSelectedChain(chainName);
    setShowModal(true);
  };

  if (chartData.length === 0) return null;

  return (
    <>
      <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)] h-full">
        <CardHeader>
          <CardTitle className="text-white">Total Value by Blockchain</CardTitle>
          <p className="text-sm text-gray-400">Click chain names for wallet breakdown</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Bar */}
            <div className="relative w-8 h-72 bg-gray-700/50 rounded-lg overflow-hidden flex flex-col">
              {chartData.map(chain => (
                <div key={chain.name} style={{ height: `${chain.percentage}%`, backgroundColor: chain.color }} />
              ))}
            </div>

            {/* Labels - Fixed height container with proper spacing */}
            <div className="flex-1 py-2">
              <div className="h-68 flex flex-col justify-between">
                {chartData.map((chain, index) => (
                  <div 
                    key={chain.name} 
                    className="flex items-baseline justify-between cursor-pointer hover:bg-white/5 rounded-lg px-2 py-1 transition-colors"
                    onClick={() => handleChainClick(chain.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: chain.color }}
                      />
                      <span className="text-white font-medium text-lg">{chain.displayName}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono font-bold text-lg">
                        {formatValue(chain.value)}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {chain.actualPercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chain Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl bg-[var(--surface)] border-[var(--glass-border)] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{CHAIN_NAMES[selectedChain] || selectedChain} Wallets ({walletsByChain[selectedChain]?.length || 0})</span>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {walletsByChain[selectedChain]?.map((wallet) => (
              <div 
                key={wallet.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass)] hover:bg-gray-700/50 cursor-pointer"
                onClick={() => {
                  onWalletSelect?.(wallet);
                  setShowModal(false);
                }}
              >
                <WalletIdentifier wallet={wallet} showToggle={false} size="small" />
                <div className="text-right">
                  <div className="text-white font-mono">${wallet.health?.portfolio_value?.toLocaleString() || '0'}</div>
                  <div className="text-gray-400 text-sm">Health: {wallet.health?.overall_score || 0}/100</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
