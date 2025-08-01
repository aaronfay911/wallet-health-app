
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, ToggleLeft } from "lucide-react"; // Added ToggleLeft
import { getWalletName, formatWalletAddress } from "./walletNaming";
import { useToast } from "@/components/ui/use-toast";

export default function WalletIdentifier({ 
  wallet, 
  showToggle = true, 
  size = "normal", // "small", "normal", "large"
  toggleIcon: CustomToggleIcon = ToggleLeft // Accept custom toggle icon
}) {
  const [showAddress, setShowAddress] = useState(false);
  const { toast } = useToast();
  
  const formalName = getWalletName(wallet.wallet_address);
  const displayName = wallet.nickname || formalName?.name;
  const hasName = !!(wallet.nickname || formalName);
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
        className: "bg-[var(--surface)] border-[var(--glass-border)] text-white"
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
        className: "bg-red-900 border-red-700 text-white"
      });
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          text: "text-sm",
          code: "text-xs",
          button: "h-6 w-6",
          icon: "w-3 h-3"
        };
      case "large":
        return {
          text: "text-lg",
          code: "text-sm",
          button: "h-8 w-8",
          icon: "w-4 h-4"
        };
      default:
        return {
          text: "text-base",
          code: "text-xs",
          button: "h-7 w-7",
          icon: "w-3.5 h-3.5"
        };
    }
  };

  const classes = getSizeClasses();

  if (!hasName) {
    // Only show address if no name/nickname exists
    return (
      <div className="flex items-center gap-2">
        <code className={`bg-[var(--surface)] px-2 py-1 rounded text-gray-300 font-mono ${classes.code}`}>
          {formatWalletAddress(wallet.wallet_address)}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className={`${classes.button} text-gray-300 hover:text-white hover:bg-gray-700`}
          onClick={() => copyToClipboard(wallet.wallet_address)}
        >
          <Copy className={classes.icon} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`flex items-center gap-2 ${showToggle ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
        onClick={showToggle ? () => setShowAddress(!showAddress) : undefined}
      >
        {showAddress ? (
          <code className={`bg-[var(--surface)] px-2 py-1 rounded text-gray-300 font-mono ${classes.code}`}>
            {formatWalletAddress(wallet.wallet_address)}
          </code>
        ) : (
          <div className="flex items-center gap-2">
            <span className={`font-medium text-white ${classes.text}`}>
              {displayName}
            </span>
            {formalName && (
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-600">
                {formalName.type === "ens" ? "ENS" : "Known Wallet"}
              </Badge>
            )}
          </div>
        )}
      </div>
      {showToggle && (
        <Button
          variant="ghost"
          size="icon"
          className={`${classes.button} text-gray-300 hover:text-white hover:bg-gray-700`}
          onClick={() => setShowAddress(!showAddress)}
        >
          <CustomToggleIcon className={classes.icon} />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className={`${classes.button} text-gray-300 hover:text-white hover:bg-gray-700`}
        onClick={() => copyToClipboard(wallet.wallet_address)}
      >
        <Copy className={classes.icon} />
      </Button>
    </div>
  );
}
