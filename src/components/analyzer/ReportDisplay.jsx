
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  ExternalLink,
  Plus,
  Target,
  ChevronsRight,
  ShieldX,
  PlusCircle,
  AlertTriangle,
  FileText,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { WatchedWallet } from "@/api/entities";
import { User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useToast } from "@/components/ui/use-toast";
import WalletIdentifier from "../wallet/WalletIdentifier";

const getScoreColor = (score) => {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

const getImpactColor = (impact) => {
  return impact > 0 ? "text-green-400" : "text-red-400";
};

export default function ReportDisplay({ report, subscription }) {

  const getExplorerUrl = () => {
    const explorers = {
      ethereum: `https://etherscan.io/address/${report.wallet_address}`,
      solana: `https://solscan.io/account/${report.wallet_address}`,
      bitcoin: `https://blockstream.info/address/${report.wallet_address}`,
      polygon: `https://polygonscan.com/address/${report.wallet_address}`,
      arbitrum: `https://arbiscan.io/address/${report.wallet_address}`
    };
    return explorers[report.blockchain] || "#";
  };

  // Calculate what the math should actually be based on the final score
  const actualImpactSum = report.health_score_breakdown.reduce((sum, item) => sum + item.score_impact, 0);
  const expectedScore = 75 + actualImpactSum;
  const mathIsCorrect = expectedScore === report.overall_health_score;

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-white mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--primary)]" />
                Wallet Health Report
              </CardTitle>
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <WalletIdentifier wallet={report} showToggle={true} />
                <Badge variant="outline" className="capitalize text-gray-300 border-gray-600">
                  {report.blockchain}
                </Badge>
              </div>
              <p className="text-sm text-gray-300">
                Last Checked: {formatDistanceToNow(new Date(report.analysis_date))} ago
              </p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button asChild size="sm" variant="outline" className="flex-grow sm:flex-grow-0 text-white border-gray-600 hover:bg-gray-700 font-semibold">
                <a href={getExplorerUrl()} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Chain
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* --- SCORE & BREAKDOWN --- */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)] h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <p className="text-gray-400 text-sm mb-2">Wallet Health Score</p>
              <h2 className={`text-7xl font-bold ${getScoreColor(report.overall_health_score)}`}>
                {report.overall_health_score}
                <span className="text-3xl text-gray-500">/100</span>
              </h2>
              <p className="text-gray-300 mt-4 max-w-xs">"{report.health_summary_text}"</p>
              {!mathIsCorrect && (
                <p className="text-xs text-yellow-400 mt-2">
                  Note: Score calculation shows {expectedScore}, displaying {report.overall_health_score}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)] h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg">Score Breakdown</CardTitle>
                  <p className="text-xs text-gray-400">
                    🟢 Green = Strengths that boost the score | 🔴 Red = Risks that lower the score
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Baseline: 75 points</p>
                  <p className="text-xs text-gray-500">
                    75 represents a typical crypto wallet with standard activity and moderate diversification
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.health_score_breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-[var(--surface)]">
                    <div className="flex items-center gap-2">
                      {item.score_impact > 0 ? <ShieldCheck className="w-4 h-4 text-green-400"/> : <ShieldX className="w-4 h-4 text-red-400"/>}
                      <div>
                        <p className="text-white text-sm font-medium">{item.category}</p>
                        <p className="text-gray-400 text-xs">{item.description}</p>
                      </div>
                    </div>
                    <p className={`font-mono font-semibold text-lg ${getImpactColor(item.score_impact)}`}>
                      {item.score_impact > 0 ? '+' : ''}{item.score_impact}
                    </p>
                  </div>
                ))}
                <div className="mt-4 p-2 bg-gray-800/50 rounded text-xs text-gray-400 text-center">
                  Math Check: 75 {report.health_score_breakdown.map(item => 
                    item.score_impact > 0 ? `+${item.score_impact}` : `${item.score_impact}`
                  ).join(' ')} = {expectedScore}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- AI SUMMARY & BEHAVIOR PROFILE --- */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-200 leading-relaxed break-words">{report.ai_summary}</p>
          </CardContent>
        </Card>
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5 text-purple-400" />
              Behavior Profile: "{report.behavior_profile.tag}"
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="italic text-gray-300 mb-4">"{report.behavior_profile.summary}"</p>
            <ul className="space-y-2">
              {report.behavior_profile.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-200">
                  <ChevronsRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0"/>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* --- RECOMMENDATIONS & SCORE TREND --- */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PlusCircle className="w-5 h-5 text-green-400" />
              Recommendations to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-green-300">
                  <Plus className="w-4 h-4 bg-green-500/20 rounded-full p-0.5 mt-0.5 flex-shrink-0"/>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Score Trend (Last 3 Reports)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.score_trend.map((trend, index) => {
                const prevScore = report.score_trend[index + 1]?.score;
                const change = prevScore ? trend.score - prevScore : null;
                return (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-[var(--surface)]">
                    <p className="text-gray-400 text-sm">{new Date(trend.date).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2">
                      <p className={`font-mono font-semibold text-lg ${getScoreColor(trend.score)}`}>{trend.score}</p>
                      {change !== null && (
                        change >= 0 ? 
                        <TrendingUp className="w-4 h-4 text-green-400"/> :
                        <TrendingDown className="w-4 h-4 text-red-400"/>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
