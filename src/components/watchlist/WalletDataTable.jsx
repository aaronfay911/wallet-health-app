
import React, { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Eye, Copy, ToggleLeft, Info, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import WalletIdentifier from '../wallet/WalletIdentifier';
import { WatchedWallet } from '@/api/entities';
import { useToast } from "@/components/ui/use-toast";
import { performWalletAnalysis } from '../analyzer/analysisHelper';

const getHealthScoreColor = (score) => {
  if (score >= 80) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  return "text-red-400";
};

const ownershipOptions = [
  { value: 'research_target', label: 'Research' },
  { value: 'my_wallet', label: 'My Wallet' },
  { value: 'competitor', label: 'Competitor' },
  { value: 'whale_tracker', label: 'Whale' },
  { value: 'defi_degen', label: 'DeFi Degen' },
  { value: 'nft_collector', label: 'NFT Collector' },
  { value: 'smart_money', label: 'Smart Money' },
];

export default function WalletDataTable({ wallets, onWalletSelect, onUpdateTag, onWalletsRemoved }) {
  const [sortConfig, setSortConfig] = useState({ key: 'health.portfolio_value', direction: 'desc' });
  const [selectedWallets, setSelectedWallets] = useState([]);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const { toast } = useToast();

  const sortedWallets = useMemo(() => {
    let sortableItems = [...wallets];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal, bVal;

        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aVal = keys.reduce((obj, key) => obj?.[key], a);
          bVal = keys.reduce((obj, key) => obj?.[key], b);
        } else {
          aVal = a[sortConfig.key];
          bVal = b[sortConfig.key];
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [wallets, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (checked) => {
    setSelectedWallets(checked ? sortedWallets.map(w => w.id) : []);
  };

  const handleSelectWallet = (walletId, checked) => {
    setSelectedWallets(prev =>
      checked
        ? [...prev, walletId]
        : prev.filter(id => id !== walletId)
    );
  };

  const handleBulkRemove = async () => {
    if (selectedWallets.length === 0) return;

    try {
      await Promise.all(
        selectedWallets.map(walletId =>
          WatchedWallet.update(walletId, { is_active: false })
        )
      );

      toast({
          title: "Wallets Removed",
          description: `${selectedWallets.length} wallets have been removed from your watchlist.`,
          className: "bg-green-900 border-green-700 text-white"
      });

      setSelectedWallets([]);
      if (onWalletsRemoved) {
        onWalletsRemoved();
      }
    } catch (error) {
      console.error("Error removing wallets:", error);
      toast({ title: "Error", description: "Could not remove wallets.", variant: "destructive" });
    }
  };
  
  const handleBulkReanalyze = async () => {
    if (selectedWallets.length === 0) return;
    
    setIsReanalyzing(true);
    toast({
        title: "Re-analysis Started",
        description: `Refreshing data for ${selectedWallets.length} wallet(s)... This may take a moment.`,
    });

    try {
        const updates = selectedWallets.map(async (walletId) => {
            const walletToUpdate = wallets.find(w => w.id === walletId);
            if (!walletToUpdate) return;
            
            const newReportData = await performWalletAnalysis(walletToUpdate.wallet_address, walletToUpdate.blockchain);
            await WatchedWallet.update(walletId, {
                ...newReportData,
                overall_score: newReportData.overall_health_score, // Align field names
                last_checked: new Date().toISOString()
            });
        });
        
        await Promise.all(updates);

        toast({
            title: "Re-analysis Complete",
            description: "All selected wallets have been updated with the latest data.",
            className: "bg-green-900 border-green-700 text-white"
        });
        
        if (onWalletsRemoved) { // This function reloads the data, so we can reuse it
            onWalletsRemoved();
        }

    } catch (error) {
        console.error("Error during bulk re-analysis:", error);
        toast({ title: "Error", description: "An error occurred during re-analysis. Please try again.", variant: "destructive" });
    } finally {
        setIsReanalyzing(false);
        setSelectedWallets([]);
    }
  };

  const isAllSelected = sortedWallets.length > 0 && selectedWallets.length === sortedWallets.length;
  const isSomeSelected = selectedWallets.length > 0 && selectedWallets.length < sortedWallets.length;

  // Custom checkbox component that handles indeterminate state properly
  const SelectAllCheckbox = () => {
    const checkboxRef = React.useRef(null);
    
    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = isSomeSelected;
      }
    }, [isSomeSelected]);

    return (
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={isAllSelected}
        onChange={(e) => handleSelectAll(e.target.checked)}
        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-2"
      />
    );
  };

  return (
    <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Wallet Portfolio</CardTitle>
            <div className="flex items-center gap-6 text-sm text-gray-400 mt-2">
              <div className="flex items-center gap-2">
                <ToggleLeft className="w-4 h-4" />
                <span>Toggle Name/Address</span>
              </div>
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </div>
            </div>
          </div>

          {selectedWallets.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {selectedWallets.length} selected
              </span>
              <Button
                onClick={handleBulkReanalyze}
                variant="outline"
                size="sm"
                className="text-cyan-400 border-cyan-400"
                disabled={isReanalyzing}
              >
                {isReanalyzing ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-1" />
                )}
                Re-analyze
              </Button>
              <Button
                onClick={handleBulkRemove}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                disabled={isReanalyzing}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="w-12">
                  <SelectAllCheckbox />
                </TableHead>
                <TableHead className="text-gray-300">Wallet</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('health.portfolio_value')} className="text-gray-300 hover:text-white p-0">
                    Portfolio Value <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('health.daily_change')} className="text-gray-300 hover:text-white p-0">
                    24h Change <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('health.overall_score')} className="text-gray-300 hover:text-white p-0">
                    Health Score <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('ownership_tag')} className="text-gray-300 hover:text-white p-0">
                    Ownership <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedWallets.map((wallet) => (
                <TableRow
                  key={wallet.id}
                  className="border-gray-800 hover:bg-gray-800/50"
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedWallets.includes(wallet.id)}
                      onChange={(e) => handleSelectWallet(wallet.id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <WalletIdentifier
                        wallet={wallet}
                        showToggle={true}
                        toggleIcon={ToggleLeft}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onWalletSelect(wallet)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-white">${wallet.health.portfolio_value.toLocaleString()}</TableCell>
                  <TableCell className={wallet.health.daily_change >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {wallet.health.daily_change.toFixed(2)}%
                  </TableCell>
                  <TableCell className={`font-bold ${getHealthScoreColor(wallet.health.overall_score)}`}>
                    {wallet.health.overall_score}
                  </TableCell>
                  <TableCell>
                    <Select value={wallet.ownership_tag} onValueChange={(newTag) => onUpdateTag(wallet.id, newTag)}>
                      <SelectTrigger className="w-36 bg-[var(--surface)] border-gray-700 text-white" onClick={(e) => e.stopPropagation()}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--surface)] border-gray-700 text-white">
                        {ownershipOptions.map(opt => <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-gray-700">{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
