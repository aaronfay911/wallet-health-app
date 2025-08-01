import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Activity, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getChainById } from "../chains/ChainConfig";
import { getWalletName } from "../wallet/walletNaming";

export default function RecentActivity({ wallets, isLoading }) {
  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="w-5 h-5 text-[var(--primary)]" />
          Recently Added Wallets
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-[var(--surface)]">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Wallets Watched</h3>
            <p className="text-gray-400">Use the Analyzer page to add wallets to your watchlist.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.slice(0, 5).map((wallet) => {
              const chainConfig = getChainById(wallet.blockchain);
              const walletName = wallet.nickname || getWalletName(wallet.wallet_address)?.name || `${wallet.wallet_address.slice(0,6)}...`;
              const riskInfo = getRiskColor(wallet.risk_level);

              return (
                <div key={wallet.id} className="flex items-center justify-between p-4 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface)]/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${chainConfig?.color || 'bg-gray-500'} flex-shrink-0`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white text-sm">
                          {walletName}
                        </span>
                        <span className="text-gray-400 text-xs">•</span>
                        <span className="text-gray-400 text-xs capitalize">
                          {chainConfig?.name || wallet.blockchain}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          Added {formatDistanceToNow(new Date(wallet.created_date), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${riskInfo} text-xs capitalize`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {wallet.risk_level || 'N/A'} Risk
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}