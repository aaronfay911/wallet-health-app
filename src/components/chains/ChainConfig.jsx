import React from "react";

// Chain configuration - easy to enable/disable chains
export const SUPPORTED_CHAINS = {
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    color: "bg-orange-500",
    enabled: true,
    recoveryMethod: "cpfp",
    walletRecommendation: "BlueWallet",
    explorerUrl: "https://mempool.space",
    minRecoveryAmount: 0.001, // BTC
    feeUnit: "sat/vB"
  },
  litecoin: {
    id: "litecoin", 
    name: "Litecoin",
    symbol: "LTC",
    color: "bg-gray-400",
    enabled: true, // Enable Litecoin so selector shows
    recoveryMethod: "cpfp",
    walletRecommendation: "Litewallet or BlueWallet",
    explorerUrl: "https://blockchair.com/litecoin",
    minRecoveryAmount: 0.1, // LTC
    feeUnit: "sat/vB"
  },
  dogecoin: {
    id: "dogecoin",
    name: "Dogecoin", 
    symbol: "DOGE",
    color: "bg-yellow-500",
    enabled: true, // Enable Dogecoin so selector shows
    recoveryMethod: "cpfp",
    walletRecommendation: "Dogecoin Core or MultiDoge",
    explorerUrl: "https://blockchair.com/dogecoin",
    minRecoveryAmount: 100, // DOGE
    feeUnit: "DOGE/kB"
  },
  bitcoin_cash: {
    id: "bitcoin_cash",
    name: "Bitcoin Cash",
    symbol: "BCH", 
    color: "bg-green-500",
    enabled: false, // Keep this one off for now
    recoveryMethod: "cpfp",
    walletRecommendation: "Electron Cash",
    explorerUrl: "https://blockchair.com/bitcoin-cash",
    minRecoveryAmount: 0.01, // BCH
    feeUnit: "sat/B"
  }
};

export const getEnabledChains = () => {
  return Object.values(SUPPORTED_CHAINS).filter(chain => chain.enabled);
};

export const getChainById = (chainId) => {
  return SUPPORTED_CHAINS[chainId];
};

export const isChainEnabled = (chainId) => {
  return SUPPORTED_CHAINS[chainId]?.enabled || false;
};