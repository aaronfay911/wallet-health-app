import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { getChainById, getEnabledChains } from "../chains/ChainConfig";

export default function NetworkBreakdown({ wallets, isLoading }) {
  const getNetworkData = () => {
    if (!wallets) return [];
    
    const networkCounts = {};

    wallets.forEach(wallet => {
      const chainConfig = getChainById(wallet.blockchain);
      if (chainConfig) {
        networkCounts[chainConfig.name] = {
          count: (networkCounts[chainConfig.name]?.count || 0) + 1,
          color: chainConfig.color
        };
      }
    });

    return Object.entries(networkCounts).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: data.count,
      color: `var(--${data.color.replace('bg-', '')})` // Use CSS variables if possible, or fallback
    }));
  };

  const networkData = getNetworkData();
  
  const COLORS = networkData.map(d => {
      const chain = Object.values(getEnabledChains()).find(c => c.name === d.name);
      return chain ? chain.color.replace('bg-', '') : 'gray-500';
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="glass-effect border border-[var(--glass-border)] rounded-lg p-3">
          <p className="text-white font-medium">{data.payload.name}</p>
          <p className="text-[var(--primary)]">{data.value} wallets</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for slices < 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const getBGColor = (colorName) => {
    const colorMap = {
        'orange-500': '#F97316',
        'gray-400': '#9CA3AF',
        'yellow-500': '#EAB308',
        'green-500': '#22C55E'
    }
    return colorMap[colorName] || '#6B7280';
  }

  return (
    <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
      <CardHeader>
        <CardTitle className="text-white">Your Network Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-2">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        ) : networkData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400">No wallets to analyze</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={networkData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#1A2332"
                    strokeWidth={2}
                  >
                    {networkData.map((entry, index) => {
                        const chain = Object.values(getEnabledChains()).find(c => c.name === entry.name);
                        return <Cell key={`cell-${index}`} fill={getBGColor(chain?.color.replace('bg-',''))} />
                    })}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {networkData.map((network, index) => {
                const chain = Object.values(getEnabledChains()).find(c => c.name === network.name);
                return(
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)]">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-3 h-3 rounded-full ${chain?.color}`}
                    />
                    <span className="text-white font-medium">{network.name}</span>
                  </div>
                  <span className="text-gray-400">{network.value}</span>
                </div>
              )})}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}