import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tag, Sparkles } from "lucide-react";
import { getWalletName, formatWalletAddress, validateNickname } from "./walletNaming";

export default function NicknamePrompt({ 
  walletAddress, 
  blockchain, 
  onConfirm, 
  onSkip 
}) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  
  const formalName = getWalletName(walletAddress);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateNickname(nickname);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    setError("");
    onConfirm(nickname.trim());
  };

  const suggestedNicknames = [
    "Alpha Whale",
    "DeFi Degen", 
    "NFT Collector",
    "Smart Money",
    "Yield Farmer"
  ];

  return (
    <Card className="glass-effect border-[var(--primary)]/30 bg-[var(--primary)]/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Tag className="w-5 h-5 text-[var(--primary)]" />
          Name This Wallet
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <code className="text-xs bg-[var(--surface)] px-2 py-1 rounded text-gray-300 font-mono">
              {formatWalletAddress(walletAddress)}
            </code>
            <Badge variant="outline" className="capitalize text-xs text-gray-300 border-gray-600">
              {blockchain}
            </Badge>
          </div>
          {!formalName && (
            <p className="text-sm text-gray-300">
              Give this wallet a memorable nickname to make it easier to identify in your watchlist.
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {formalName ? (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="font-medium text-green-300">Known Wallet Detected</span>
            </div>
            <p className="text-sm text-green-200">
              This wallet is recognized as: <strong className="text-green-100">{formalName.name}</strong>
            </p>
            <p className="text-xs text-green-300 mt-1">
              You can still add a custom nickname if you prefer.
            </p>
          </div>
        ) : null}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-white">
              Wallet Nickname {!formalName && <span className="text-red-400">*</span>}
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError("");
              }}
              placeholder={formalName ? "Add custom nickname (optional)" : "e.g., Alpha Whale, My DeFi Wallet"}
              className="bg-[var(--surface)] border-gray-700 text-white placeholder:text-gray-400"
              maxLength={30}
            />
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
          </div>
          
          {!formalName && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-400">Quick suggestions:</Label>
              <div className="flex flex-wrap gap-2">
                {suggestedNicknames.map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNickname(suggestion)}
                    className="text-xs border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-[var(--primary-foreground)] font-semibold"
            >
              {formalName ? "Add Custom Nickname" : "Add to Watchlist"}
            </Button>
            
            {formalName && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onSkip()}
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Use "{formalName.name}"
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}