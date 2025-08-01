
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import WalletIdentifier from '../wallet/WalletIdentifier';

const MoverItem = ({ wallet, onWalletSelect }) => {
  const dailyChange = wallet.health?.daily_change;
  const isGain = typeof dailyChange === 'number' && dailyChange >= 0;
  const hasValue = typeof dailyChange === 'number';
  
  const color = isGain ? 'text-green-400' : 'text-red-400';
  const Icon = isGain ? ArrowUpRight : ArrowDownRight;

  return (
    <div 
      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 cursor-pointer"
      onClick={() => onWalletSelect(wallet)}
    >
      <WalletIdentifier wallet={wallet} showToggle={false} size="small" />
      {hasValue ? (
        <div className={`flex items-center font-mono text-sm ${color}`}>
          <Icon className="w-4 h-4 mr-1" />
          {isGain ? '+' : ''}{dailyChange.toFixed(2)}%
        </div>
      ) : (
        <div className="font-mono text-sm text-gray-500">N/A</div>
      )}
    </div>
  );
};

export default function TopMoversChart({ healthData, onWalletSelect }) {
  const { topMovers, bottomMovers } = useMemo(() => {
    if (!healthData || healthData.length === 0) {
      return { topMovers: [], bottomMovers: [] };
    }

    const sorted = [...healthData].sort((a, b) => b.health.daily_change - a.health.daily_change);
    
    const topMovers = sorted.slice(0, 5);
    const bottomMovers = sorted.slice(-5).reverse();

    return { topMovers, bottomMovers };
  }, [healthData]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
        <CardHeader>
          <CardTitle className="text-white">Top 5 Performers (24h)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topMovers.map(wallet => <MoverItem key={wallet.id} wallet={wallet} onWalletSelect={onWalletSelect} />)}
        </CardContent>
      </Card>
      <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
        <CardHeader>
          <CardTitle className="text-white">Bottom 5 Performers (24h)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {bottomMovers.map(wallet => <MoverItem key={wallet.id} wallet={wallet} onWalletSelect={onWalletSelect} />)}
        </CardContent>
      </Card>
    </div>
  );
}
