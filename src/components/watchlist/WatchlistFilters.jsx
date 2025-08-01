import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from 'lucide-react';

const ownershipOptions = [
  { value: 'all', label: 'All Ownership' },
  { value: 'research_target', label: 'Research' },
  { value: 'my_wallet', label: 'My Wallet' },
  { value: 'competitor', label: 'Competitor' },
  { value: 'whale_tracker', label: 'Whale' },
  { value: 'defi_degen', label: 'DeFi Degen' },
  { value: 'nft_collector', label: 'NFT Collector' },
  { value: 'smart_money', label: 'Smart Money' },
];

const healthOptions = [
  { value: 'all', label: 'All Health Scores' },
  { value: 'good', label: 'Good (80+)' },
  { value: 'okay', label: 'Okay (70-79)' },
  { value: 'poor', label: 'Poor (<70)' },
];

export default function WatchlistFilters({ onFilterChange }) {
  const [ownership, setOwnership] = useState('all');
  const [health, setHealth] = useState('all');

  const handleFilterChange = (type, value) => {
    let newOwnership = ownership;
    let newHealth = health;

    if (type === 'ownership') {
      setOwnership(value);
      newOwnership = value;
    }
    if (type === 'health') {
      setHealth(value);
      newHealth = value;
    }
    onFilterChange({ ownership: newOwnership, health: newHealth });
  };
  
  return (
    <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-white">Filters:</span>
          </div>
          <Select value={ownership} onValueChange={(value) => handleFilterChange('ownership', value)}>
            <SelectTrigger className="w-full md:w-48 bg-[var(--surface)] border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[var(--surface)] border-gray-700 text-white">
              {ownershipOptions.map(opt => <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-gray-700">{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={health} onValueChange={(value) => handleFilterChange('health', value)}>
            <SelectTrigger className="w-full md:w-48 bg-[var(--surface)] border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[var(--surface)] border-gray-700 text-white">
              {healthOptions.map(opt => <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-gray-700">{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}