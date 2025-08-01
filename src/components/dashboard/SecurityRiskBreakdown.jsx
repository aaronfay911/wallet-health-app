
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, ShieldX, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import WalletIdentifier from '../wallet/WalletIdentifier';

const SecurityGaugeCard = ({ title, value, total, icon: Icon, colorClass, bgColorClass }) => {
  const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value;
  const safeTotal = isNaN(total) || total === null || total === undefined || total === 0 ? 1 : total;
  const percentage = Math.round((safeValue / safeTotal) * 100);
  const gaugeProgress = (safeValue / safeTotal) * 180; // 180 degrees for half circle

  return (
    <Card className={`${bgColorClass} border-${colorClass}/30`}>
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <Icon className={`w-8 h-8 text-${colorClass}`} />
        </div>

        {/* Gauge/Meter SVG */}
        <div className="relative w-32 h-16 mx-auto mb-4">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke={`var(--${colorClass.replace('-', '-')})`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${gaugeProgress * 2.51} 502`}
              className={`text-${colorClass}`}
              style={{
                stroke: colorClass === 'green-400' ? '#10B981' :
                       colorClass === 'yellow-400' ? '#F59E0B' : '#EF4444'
              }}
            />
          </svg>

          {/* Center value */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold text-${colorClass}`}>{safeValue}</div>
              <div className="text-xs text-gray-400">of {safeTotal}</div>
            </div>
          </div>
        </div>

        <h3 className="text-sm font-medium text-gray-300 mb-1">{title}</h3>
        <div className={`text-lg font-bold text-${colorClass}`}>{percentage}%</div>
        <div className="text-xs text-gray-400">of total wallets</div>
      </CardContent>
    </Card>
  );
};

export default function SecurityRiskBreakdown({ healthData, onWalletSelect }) {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { riskCounts, totalWallets, walletsByRisk } = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    const byRisk = { low: [], medium: [], high: [] };
    let total = 0;

    if (healthData) {
      healthData.forEach(wallet => {
        const risk = wallet.health.risk_level;
        if (counts[risk] !== undefined) {
          counts[risk]++;
          byRisk[risk].push(wallet);
          total++;
        }
      });
    }
    return { riskCounts: counts, totalWallets: total, walletsByRisk: byRisk };
  }, [healthData]);

  const handleRiskClick = (riskLevel) => {
    setSelectedRiskLevel(riskLevel);
    setShowModal(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Security Risk Dashboard</h2>
          <p className="text-gray-400 text-sm">Risk assessment across your {totalWallets} monitored wallets (click segments for details)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => handleRiskClick('low')} className="cursor-pointer">
            <SecurityGaugeCard
              title="Low Risk Wallets"
              value={riskCounts.low}
              total={totalWallets}
              icon={ShieldCheck}
              colorClass="green-400"
              bgColorClass="bg-green-500/5 border-green-500/20 hover:bg-green-500/10 transition-colors"
            />
          </div>
          <div onClick={() => handleRiskClick('medium')} className="cursor-pointer">
            <SecurityGaugeCard
              title="Medium Risk Wallets"
              value={riskCounts.medium}
              total={totalWallets}
              icon={ShieldAlert}
              colorClass="yellow-400"
              bgColorClass="bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10 transition-colors"
            />
          </div>
          <div onClick={() => handleRiskClick('high')} className="cursor-pointer">
            <SecurityGaugeCard
              title="High Risk Wallets"
              value={riskCounts.high}
              total={totalWallets}
              icon={ShieldX}
              colorClass="red-400"
              bgColorClass="bg-red-500/5 border-red-500/20 hover:bg-red-500/10 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Risk Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl bg-[var(--surface)] border-[var(--glass-border)] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="capitalize">{selectedRiskLevel} Risk Wallets ({walletsByRisk[selectedRiskLevel]?.length || 0})</span>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {walletsByRisk[selectedRiskLevel]?.map((wallet) => (
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
                  <div className="text-white font-mono">${wallet.health.portfolio_value?.toLocaleString() || '0'}</div>
                  <div className="text-gray-400 text-sm">Health: {wallet.health.overall_score || 0}/100</div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
