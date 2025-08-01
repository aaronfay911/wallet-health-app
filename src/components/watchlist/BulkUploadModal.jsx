import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { WatchedWallet } from '@/api/entities';
import { Upload, Loader2, AlertTriangle } from 'lucide-react';
import { planConfig } from '../../pages/Pricing';
import { performWalletAnalysis } from '../analyzer/analysisHelper'; // Import the reusable helper

export default function BulkUploadModal({ isOpen, onClose, onWalletsAdded, subscription, currentWalletCount }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const { toast } = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const generateSampleFile = () => {
    const sampleData = `wallet_address,blockchain,nickname,ownership_tag\n0xd8da6bf26964af9d7eed9e03e53415d37aa96045,ethereum,Vitalik Buterin,research_target\n0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be,ethereum,Binance Hot Wallet,whale_tracker`;
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wallet_watchlist_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "No file selected", description: "Please choose a CSV file to upload.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setUploadProgress("Reading file...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      let walletsToCreate = [];
      let failedWallets = [];

      try {
        const csv = event.target.result;
        const lines = csv.split('\n').slice(1); // Skip header
        const walletsToProcess = [];

        const validBlockchains = ["ethereum", "solana", "bitcoin", "polygon", "arbitrum"];
        const validTags = ["my_wallet", "research_target", "competitor", "whale_tracker", "defi_degen", "nft_collector", "smart_money"];

        for (const line of lines) {
          if (line.trim() === '') continue;
          const [address, blockchain, nickname, tag] = line.split(',').map(s => s.trim());
          if (!address || !blockchain) continue;

          walletsToProcess.push({
            address,
            blockchain,
            nickname,
            tag
          });
        }
        
        const watchlistLimit = planConfig[subscription?.plan]?.watchlist_limit || 0;
        const remainingSlots = watchlistLimit - currentWalletCount;
        if (walletsToProcess.length > remainingSlots) {
          toast({
            title: "Upload Limit Exceeded",
            description: `You can only add ${remainingSlots} more wallets. Your file has ${walletsToProcess.length}.`,
            variant: "destructive"
          });
          setIsUploading(false);
          setUploadProgress("");
          return;
        }

        const analysisPromises = walletsToProcess.map(async (wallet, index) => {
          try {
            setUploadProgress(`Analyzing wallet ${index + 1} of ${walletsToProcess.length}: ${wallet.address.slice(0, 8)}...`);
            
            const processedBlockchain = validBlockchains.includes(wallet.blockchain.toLowerCase()) ? wallet.blockchain.toLowerCase() : 'ethereum';
            const processedNickname = wallet.nickname || `Wallet ${wallet.address.slice(0,6)}...`;
            const processedTag = validTags.includes(wallet.tag) ? wallet.tag : 'research_target';

            // Use the robust, reusable analysis helper
            const reportData = await performWalletAnalysis(wallet.address, processedBlockchain);

            return {
              status: 'fulfilled',
              value: {
                wallet_address: wallet.address,
                blockchain: processedBlockchain,
                nickname: processedNickname,
                ownership_tag: processedTag,
                ...reportData,
                overall_score: reportData.overall_health_score, // Align field names
                last_checked: new Date().toISOString(),
                is_active: true
              }
            };
          } catch (error) {
            console.error(`Failed to analyze wallet ${wallet.address}:`, error);
            return { status: 'rejected', reason: wallet.address };
          }
        });

        const results = await Promise.allSettled(analysisPromises);
        
        results.forEach(result => {
          if (result.status === 'fulfilled' && result.value) {
            walletsToCreate.push(result.value.value);
          } else {
            failedWallets.push(result.reason || 'Unknown');
          }
        });

        if (walletsToCreate.length > 0) {
          setUploadProgress(`Saving ${walletsToCreate.length} wallets...`);
          await WatchedWallet.bulkCreate(walletsToCreate);
        }

        // Final toast message
        if (failedWallets.length === 0) {
          toast({ title: "Upload Complete", description: `${walletsToCreate.length} wallets have been analyzed and added.` });
        } else {
          toast({
            title: "Upload Partially Complete",
            description: `${walletsToCreate.length} succeeded. ${failedWallets.length} failed to analyze.`,
            variant: "default",
            className: "bg-yellow-500/20 border-yellow-500/40"
          });
        }
        
        onWalletsAdded();
        onClose();

      } catch (error) {
        console.error("Critical Upload error:", error);
        toast({ title: "Upload Failed", description: "A critical error occurred. Please check the file format and try again.", variant: "destructive" });
      } finally {
        setIsUploading(false);
        setUploadProgress("");
      }
    };
    reader.onerror = () => {
        toast({ title: "File Read Error", description: "Could not read the selected file.", variant: "destructive" });
        setIsUploading(false);
        setUploadProgress("");
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--background-secondary)] border-[var(--glass-border)] text-white">
        <DialogHeader>
          <DialogTitle>Bulk Upload Wallets</DialogTitle>
          <DialogDescription>
            Upload a CSV file with columns: `wallet_address`, `blockchain`, `nickname`, `ownership_tag`.
            <br/>
            (nickname and tag are optional).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-400">
            <p className="mb-2">Upload a CSV file with the following columns:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>wallet_address</strong> (required): The wallet address</li>
              <li><strong>blockchain</strong> (required): ethereum, bitcoin, solana, polygon, or arbitrum</li>
              <li><strong>nickname</strong> (optional): Display name for the wallet</li>
              <li><strong>ownership_tag</strong> (optional): my_wallet, research_target, competitor, whale_tracker, defi_degen, nft_collector, or smart_money</li>
            </ul>
          </div>

          <Button 
            onClick={generateSampleFile}
            variant="outline" 
            className="w-full text-[var(--primary)] border-[var(--primary)]"
          >
            Download Sample CSV File
          </Button>

          <Input type="file" accept=".csv" onChange={handleFileChange} className="bg-[var(--surface)] border-gray-700"/>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
            <p className="text-yellow-300 text-xs">
              Your plan allows you to add {subscription ? (planConfig[subscription.plan]?.watchlist_limit || 0) - currentWalletCount : 0} more wallets. The upload will fail if your file exceeds this limit.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" onClick={onClose} disabled={isUploading}>Cancel</Button>
            <Button onClick={handleUpload} disabled={isUploading || !file}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                {isUploading ? (uploadProgress || 'Processing...') : 'Upload and Analyze'}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}