import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ShieldCheck, ShieldX, TrendingUp, TrendingDown, Target, ChevronsRight, PlusCircle, Plus, Sparkles, Trash2
} from "lucide-react";
import WalletIdentifier from '../wallet/WalletIdentifier';
import { formatDistanceToNow } from 'date-fns';

const getScoreColor = (score) => {
  if (!score) return "text-gray-400";
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

const getImpactColor = (impact) => {
  return impact >= 0 ? "text-green-400" : "text-red-400";
};

export default function WalletHealthCard({ wallet, onRemove, isModalView = false }) {
  const hasFullReport = wallet && wallet.behavior_profile && wallet.health_score_breakdown;

  // This ensures the component can handle older wallet objects that don't have the new fields
  const healthScore = wallet.overall_score || wallet.health?.overall_score || 0;
  const lastChecked = wallet.last_checked || new Date().toISOString();

  return (
    <Card className="glass-effect border-[var(--glass-border)] bg-transparent w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <WalletIdentifier wallet={wallet} showToggle={false} size="large" />
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="capitalize text-gray-300 border-gray-600">{wallet.blockchain}</Badge>
            <p className="text-xs text-gray-400">Last checked: {formatDistanceToNow(new Date(lastChecked), { addSuffix: true })}</p>
          </div>
        </div>
        {/* Only show remove button when NOT in modal view */}
        {onRemove && !isModalView && (
          <Button
            onClick={() => onRemove(wallet.id)}
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        {/* Main Score Display */}
        <div className="text-center p-4 rounded-lg bg-[var(--surface)]">
          <p className="text-sm text-gray-400">Wallet Health Score</p>
          <h3 className={`text-6xl font-bold ${getScoreColor(healthScore)}`}>
            {healthScore}
            <span className="text-3xl text-gray-500">/100</span>
          </h3>
        </div>

        {/* Accordion for all detailed insights */}
        {hasFullReport ? (
          <Accordion type="multiple" defaultValue={['ai-summary']} className="w-full space-y-2">
            
            {/* AI Summary & Behavior Profile */}
            <AccordionItem value="ai-summary" className="bg-[var(--surface)] border-gray-700 rounded-lg">
              <AccordionTrigger className="p-3 text-white hover:no-underline">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold">AI Analysis: "{wallet.behavior_profile.tag}"</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-3 pt-0 text-gray-300">
                <p className="text-sm italic mb-3">"{wallet.behavior_profile.summary}"</p>
                <p className="text-sm leading-relaxed mb-4">{wallet.ai_summary}</p>
                <ul className="space-y-1">
                  {wallet.behavior_profile.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs">
                      <ChevronsRight className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0"/>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Score Breakdown */}
            <AccordionItem value="score-breakdown" className="bg-[var(--surface)] border-gray-700 rounded-lg">
              <AccordionTrigger className="p-3 text-white hover:no-underline">
                 <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">Score Breakdown</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-3 pt-0 space-y-2">
                {wallet.health_score_breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <p className="text-gray-300">{item.category}</p>
                    <p className={`font-mono font-semibold ${getImpactColor(item.score_impact)}`}>
                      {item.score_impact >= 0 ? '+' : ''}{item.score_impact}
                    </p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Recommendations */}
            <AccordionItem value="recommendations" className="bg-[var(--surface)] border-gray-700 rounded-lg">
              <AccordionTrigger className="p-3 text-white hover:no-underline">
                 <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-green-400" />
                  <span className="font-semibold">Recommendations</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-3 pt-0 text-gray-300">
                <ul className="space-y-2">
                  {wallet.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-green-300">
                      <Plus className="w-3 h-3 bg-green-500/20 rounded-full p-0.5 mt-1 flex-shrink-0"/>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        ) : (
          <div className="text-center text-sm text-gray-400 p-4 bg-[var(--surface)] rounded-lg">
            No detailed report available. Analyze this wallet to see a full breakdown of its score and behavior.
          </div>
        )}
      </CardContent>
    </Card>
  );
}