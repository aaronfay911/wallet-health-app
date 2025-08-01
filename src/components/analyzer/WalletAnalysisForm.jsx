import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const blockchains = [
  { id: "ethereum", name: "Ethereum", example: "0x..." },
  { id: "solana", name: "Solana", example: "ABC..." },
  { id: "bitcoin", name: "Bitcoin", example: "bc1..." },
  { id: "polygon", name: "Polygon", example: "0x..." },
  { id: "arbitrum", name: "Arbitrum", example: "0x..." }
];

export default function WalletAnalysisForm({
  walletAddress,
  setWalletAddress,
  selectedBlockchain,
  setSelectedBlockchain,
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (walletAddress && canAnalyze) {
      onAnalyze();
    }
  };

  const selectedChain = blockchains.find(b => b.id === selectedBlockchain);

  return (
    <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Search className="w-5 h-5 text-[var(--primary)]" />
          Wallet Intelligence Analysis
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2 p-1 h-6 w-6">
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--surface)] border-[var(--glass-border)] text-white">
              <DialogHeader>
                <DialogTitle>How to Find Wallet Addresses</DialogTitle>
                <DialogDescription className="text-gray-400 space-y-2">
                  <p>You can analyze any public wallet address:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>From blockchain explorers (Etherscan, Solscan, etc.)</li>
                    <li>From social media when influencers share their wallets</li>
                    <li>From transaction history in your own wallet</li>
                    <li>From DeFi protocol interfaces showing top users</li>
                  </ul>
                  <p className="text-yellow-400 mt-3">
                    <strong>Tip:</strong> Many successful traders share their wallet addresses publicly on Twitter!
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder={`Enter wallet address (${selectedChain?.example})`}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value.trim())}
                className="bg-[var(--surface)] border-gray-700 text-white placeholder:text-gray-500 font-mono"
                disabled={isAnalyzing}
              />
            </div>
            <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
              <SelectTrigger className="bg-[var(--surface)] border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--surface)] border-gray-700">
                {blockchains.map(chain => (
                  <SelectItem key={chain.id} value={chain.id} className="text-white hover:bg-gray-700">
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            type="submit"
            disabled={isAnalyzing || !canAnalyze || !walletAddress}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-black font-semibold py-3 text-lg rounded-xl"
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Analyzing Wallet...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                <span>Analyze Wallet Intelligence</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}