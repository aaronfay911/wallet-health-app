
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Upload, BarChart3, Table, Filter, Copy, ToggleLeft, Trash2, FileText, CheckCircle } from "lucide-react";

export default function Instructions() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">How to Use Wallet Watchdog</span>
          </h1>
          <p className="text-xl text-gray-400">
            Master wallet intelligence with our comprehensive guide
          </p>
        </div>

        {/* Analyzer Instructions */}
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Search className="w-5 h-5 text-[var(--primary)]" />
              1. Wallet Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Enter Wallet Address</h4>
                  <p className="text-gray-300 text-sm">Paste any cryptocurrency wallet address (starts with 0x for Ethereum, bc1 for Bitcoin, etc.)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Select Blockchain</h4>
                  <p className="text-gray-300 text-sm">Choose the correct blockchain (Ethereum, Solana, Bitcoin, Polygon, or Arbitrum)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Click Analyze</h4>
                  <p className="text-gray-300 text-sm">Get a comprehensive AI-powered health report including risk assessment and behavior profiling</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                <strong>Pro Tip:</strong> You can find wallet addresses on blockchain explorers, social media, or by analyzing transaction recipients in your own wallet.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Add to Watchlist Instructions */}
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Eye className="w-5 h-5 text-green-400" />
              2. Adding Wallets to Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">After Analysis</h4>
                  <p className="text-gray-300 text-sm">Once you've analyzed a wallet, scroll down and click "Add to Watchlist"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Automatic Monitoring</h4>
                  <p className="text-gray-300 text-sm">The wallet will appear in your Watchlist with all analysis data preserved</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Access Anytime</h4>
                  <p className="text-gray-300 text-sm">View detailed reports, behavior profiles, and recommendations in the Watchlist</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid View Instructions */}
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Table className="w-5 h-5 text-blue-400" />
              3. Grid View Functionality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-6 text-sm text-gray-400 p-3 bg-[var(--surface)] rounded-lg">
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
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Sorting</h4>
                  <p className="text-gray-300 text-sm">Click any column header to sort by Portfolio Value, Health Score, 24h Change, or Ownership</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Multi-Select Actions</h4>
                  <p className="text-gray-300 text-sm">Use checkboxes to select multiple wallets, then use the buttons that appear to either <span className="font-bold text-cyan-400">Re-analyze</span> for fresh data or <span className="font-bold text-red-400">Remove</span> them.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Filtering</h4>
                  <p className="text-gray-300 text-sm">Use the filters above the grid to show only specific ownership types or health score ranges</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Upload Instructions */}
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Upload className="w-5 h-5 text-purple-400" />
              4. Bulk Upload Wallets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Download Sample File</h4>
                  <p className="text-gray-300 text-sm">Click "Download Sample CSV File" to get the correct format</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Required CSV Format</h4>
                  <div className="bg-[var(--surface)] rounded-lg p-3 mt-2">
                    <code className="text-sm text-gray-300">
                      wallet_address,blockchain,nickname,ownership_tag<br/>
                      0xd8da6bf26964af9d7eed9e03e53415d37aa96045,ethereum,Vitalik Buterin,research_target<br/>
                      0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be,ethereum,Binance Hot Wallet,whale_tracker
                    </code>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Column Details</h4>
                  <ul className="space-y-1 mt-2 text-sm text-gray-300">
                    <li><strong>wallet_address</strong> (required): The cryptocurrency address</li>
                    <li><strong>blockchain</strong> (required): ethereum, bitcoin, solana, polygon, or arbitrum</li>
                    <li><strong>nickname</strong> (optional): Display name for the wallet</li>
                    <li><strong>ownership_tag</strong> (optional): my_wallet, research_target, competitor, whale_tracker, defi_degen, nft_collector, or smart_money</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-black">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Upload & Analysis</h4>
                  <p className="text-gray-300 text-sm">Each wallet will be automatically analyzed with AI and added to your watchlist</p>
                </div>
              </div>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300 text-sm">
                <strong>Important:</strong> Bulk upload respects your plan's watchlist limits. The upload will fail if it exceeds your current tier's wallet capacity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard vs Grid Toggle */}
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              5. Dashboard vs Grid View
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[var(--surface)] p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Dashboard View
                </h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Aggregate portfolio metrics</li>
                  <li>• Risk distribution charts</li>
                  <li>• Top movers visualization</li>
                  <li>• Chain distribution analysis</li>
                </ul>
              </div>
              <div className="bg-[var(--surface)] p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Table className="w-4 h-4" />
                  Grid View
                </h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Detailed wallet listings</li>
                  <li>• Sortable columns</li>
                  <li>• Multi-select actions</li>
                  <li>• Advanced filtering</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
