import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Shield, Activity, Wallet, TrendingUp, Zap, Users, Image } from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, colorClass, subValue }) => (
  <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
    <CardContent className="p-4">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${colorClass}/20`}>
          <Icon className={`w-5 h-5 text-${colorClass}`} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </div>
      {subValue && <p className="text-xs text-gray-400 mt-2">{subValue}</p>}
    </CardContent>
  </Card>
);

const safeNumber = (value, fallback = 0) => {
  return isNaN(value) || value === null || value === undefined ? fallback : value;
};

const formatValue = (value) => {
  const safe = safeNumber(value);
  return safe >= 0 ? `+$${safe.toLocaleString()}` : `-$${Math.abs(safe).toLocaleString()}`;
};

export default function AggregateKPIs({ healthData }) {
  if (!healthData || healthData.length === 0) {
    return null;
  }

  const totalWallets = healthData.length;
  const totalValue = healthData.reduce((acc, wallet) => acc + safeNumber(wallet.health?.portfolio_value), 0);
  const avgHealthScore = healthData.reduce((acc, wallet) => acc + safeNumber(wallet.health?.overall_score), 0) / totalWallets;
  const totalActiveProtocols = healthData.reduce((acc, wallet) => acc + safeNumber(wallet.health?.defi_protocols), 0);
  
  // New Aggregate Metrics with safe number handling
  const totalPL = healthData.reduce((acc, wallet) => acc + safeNumber(wallet.health?.profit_loss_30d), 0);
  const totalGas = healthData.reduce((acc, wallet) => acc + safeNumber(wallet.health?.gas_fees_30d), 0);
  const avgSmartMoney = healthData.reduce((acc, wallet) => acc + safeNumber(wallet.health?.smart_money_score), 0) / totalWallets;
  const avgNftActivity = healthData.reduce((acc, wallet) => acc + safeNumber(wallet.health?.nft_activity_score), 0) / totalWallets;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard 
        title="Total Value" 
        value={`$${safeNumber(totalValue).toLocaleString()}`} 
        icon={DollarSign} 
        colorClass="green-500"
      />
      <KPICard 
        title="Avg. Health Score" 
        value={`${safeNumber(avgHealthScore).toFixed(0)}/100`} 
        icon={Shield} 
        colorClass="blue-500"
      />
      <KPICard 
        title="Total Wallets" 
        value={totalWallets} 
        icon={Wallet} 
        colorClass="purple-500"
      />
       <KPICard 
        title="Active Protocols" 
        value={safeNumber(totalActiveProtocols)} 
        icon={Activity} 
        colorClass="orange-500"
      />
      <KPICard
        title="Aggregated 30d P&L"
        value={formatValue(totalPL)}
        icon={TrendingUp}
        colorClass={totalPL >= 0 ? 'green-500' : 'red-500'}
      />
      <KPICard
        title="Total Gas Fees (30d)"
        value={`$${safeNumber(totalGas).toLocaleString()}`}
        icon={Zap}
        colorClass="red-500"
      />
      <KPICard
        title="Avg. Smart Money"
        value={`${safeNumber(avgSmartMoney).toFixed(0)}/100`}
        icon={Users}
        colorClass="yellow-500"
      />
      <KPICard
        title="Avg. NFT Activity"
        value={`${safeNumber(avgNftActivity).toFixed(0)}/100`}
        icon={Image}
        colorClass="pink-500"
      />
    </div>
  );
}