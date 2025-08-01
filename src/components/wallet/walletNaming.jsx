// Utility functions for wallet naming and identification

// Known wallet names database (in a real app, this would come from an API)
const KNOWN_WALLETS = {
  // Ethereum - using lowercase for consistent matching
  "0xd8da6bf26964af9d7eed9e03e53415d37aa96045": "Vitalik Buterin",
  "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be": "Binance Hot Wallet", 
  "0x28c6c06298d514db089934071355e5743bf21d60": "Binance Cold Wallet",
  "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8": "Binance US",
  "0x564286362092d8e7936f0549571a803b203aaced": "FTX Exchange",
  // Add some test addresses for easier testing
  "0x1234567890123456789012345678901234567890": "Test Wallet Alpha",
  "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd": "Demo Exchange"
};

// ENS names (mock - in real app would resolve via ENS)
const ENS_NAMES = {
  "0xd8da6bf26964af9d7eed9e03e53415d37aa96045": "vitalik.eth",
  "0x1111111111111111111111111111111111111111": "demo.eth"
};

export const getWalletName = (address) => {
  if (!address) return null;
  
  const lowerAddress = address.toLowerCase();
  
  // Check for ENS name first
  if (ENS_NAMES[lowerAddress]) {
    return {
      type: "ens",
      name: ENS_NAMES[lowerAddress]
    };
  }
  
  // Check for known wallet name
  if (KNOWN_WALLETS[lowerAddress]) {
    return {
      type: "known", 
      name: KNOWN_WALLETS[lowerAddress]
    };
  }
  
  return null;
};

export const formatWalletAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const validateNickname = (nickname) => {
  if (!nickname || nickname.trim().length === 0) {
    return { valid: false, error: "Nickname cannot be empty" };
  }
  
  if (nickname.length > 30) {
    return { valid: false, error: "Nickname must be 30 characters or less" };
  }
  
  return { valid: true };
};