import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SUPPORTED_CHAINS } from "../chains/ChainConfig";
import { Settings, Zap } from "lucide-react";

// This would be for admin use - to toggle chains on/off
export default function ChainToggle({ onChainUpdate }) {
  const [chains, setChains] = useState(SUPPORTED_CHAINS);

  const toggleChain = (chainId) => {
    const updatedChains = {
      ...chains,
      [chainId]: {
        ...chains[chainId],
        enabled: !chains[chainId].enabled
      }
    };
    
    setChains(updatedChains);
    
    // In a real app, this would update a configuration database
    console.log(`${chains[chainId].name} ${updatedChains[chainId].enabled ? 'ENABLED' : 'DISABLED'}`);
    
    if (onChainUpdate) {
      onChainUpdate(updatedChains);
    }
  };

  return (
    <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="w-5 h-5 text-[var(--primary)]" />
          Blockchain Support Controls
        </CardTitle>
        <p className="text-sm text-gray-400">
          Enable or disable support for different blockchains. Users will only see enabled chains.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(chains).map((chain) => (
          <div key={chain.id} className="flex items-center justify-between p-4 rounded-lg bg-[var(--surface)] border border-gray-700">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${chain.color}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{chain.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {chain.symbol}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">
                  Recovery via {chain.recoveryMethod.toUpperCase()} • Wallet: {chain.walletRecommendation}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={chain.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                {chain.enabled ? "Live" : "Coming Soon"}
              </Badge>
              
              <Switch
                checked={chain.enabled}
                onCheckedChange={() => toggleChain(chain.id)}
              />
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <Zap className="w-5 h-5 text-blue-400" />
            <div>
              <h4 className="font-medium text-blue-400">Quick Launch Strategy</h4>
              <p className="text-sm text-blue-300 mt-1">
                Start with Bitcoin only, then enable Litecoin and Dogecoin when you're ready to scale. 
                Each chain uses the same CPFP recovery method.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}