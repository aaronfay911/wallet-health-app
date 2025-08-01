import React from 'react';
import WatchlistFilters from "./WatchlistFilters";
import WalletDataTable from "./WalletDataTable";

export default function WatchlistGridView({ filteredWallets, onFilterChange, onUpdateTag, onWalletSelect }) {
  return (
    <div className="space-y-6">
      <WatchlistFilters onFilterChange={onFilterChange} />
      <WalletDataTable 
        wallets={filteredWallets} 
        onUpdateTag={onUpdateTag}
        onWalletSelect={onWalletSelect}
      />
    </div>
  );
}