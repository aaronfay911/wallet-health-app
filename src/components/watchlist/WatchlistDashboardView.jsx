import React from 'react';
import AggregateKPIs from "../dashboard/AggregateKPIs";
import SecurityRiskBreakdown from '../dashboard/SecurityRiskBreakdown';
import TopMoversChart from '../dashboard/TopMoversChart';
import ValueByChainChart from '../dashboard/ValueByChainChart';

export default function WatchlistDashboardView({ healthData, onWalletSelect }) {
  return (
    <div className="space-y-6">
      <AggregateKPIs healthData={healthData} />
      
      <SecurityRiskBreakdown healthData={healthData} onWalletSelect={onWalletSelect} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ValueByChainChart healthData={healthData} onWalletSelect={onWalletSelect} />
        </div>
        <div className="lg:col-span-2">
          <TopMoversChart healthData={healthData} onWalletSelect={onWalletSelect} />
        </div>
      </div>
    </div>
  );
}