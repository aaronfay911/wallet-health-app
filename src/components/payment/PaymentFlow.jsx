import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, Zap, AlertTriangle } from "lucide-react";
// This is a placeholder for the PayPal integration you will configure in your workspace.
import { PayPal } from "@/api/integrations/PayPal"; 

export default function PaymentFlow({ 
  recoveryAmount, 
  onPaymentSuccess, 
  isLoading,
  setIsLoading 
}) {
  const [error, setError] = useState(null);
  
  const recoveryFee = Math.max(25, recoveryAmount * 0.05);
  const finalPrice = recoveryFee + (recoveryAmount * 0.005); // Includes a mock network fee

  // Check for payment status when the user is redirected back from PayPal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_status') === 'success') {
      onPaymentSuccess({
        paymentId: urlParams.get('paymentId'), // PayPal provides a paymentId on return
        amount: finalPrice,
      });
      // Clean up URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('payment_status') === 'cancelled') {
        setError("Payment was cancelled. You can try again.");
        window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handlePayPalPayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const returnUrl = `${window.location.origin}${window.location.pathname}?payment_status=success`;
      const cancelUrl = `${window.location.origin}${window.location.pathname}?payment_status=cancelled`;

      // This function will use your securely stored PayPal API keys
      const result = await PayPal.createOrder({
        amount: finalPrice.toFixed(2),
        currency: "USD",
        description: `Recovery fee for transaction of $${recoveryAmount.toFixed(2)}`,
        return_url: returnUrl,
        cancel_url: cancelUrl
      });

      if (result && result.approval_url) {
        // Redirect the user to PayPal to approve the payment
        window.location.href = result.approval_url;
      } else {
        throw new Error("Could not create PayPal payment order.");
      }
    } catch (e) {
      console.error("PayPal integration error:", e);
      setError("Could not connect to PayPal. Please ensure the PayPal integration is configured in your workspace settings.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="w-5 h-5 text-[var(--primary)]" />
            Secure Recovery Purchase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pricing Breakdown */}
          <div className="bg-[var(--surface)] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Stuck Amount:</span>
              <span className="text-white font-mono">${recoveryAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Recovery Fee (5%):</span>
              <span className="text-white font-mono">${recoveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Est. Network Fee:</span>
              <span className="text-white font-mono">${(recoveryAmount * 0.005).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-gray-700">
              <span className="text-white">Total Price:</span>
              <span className="text-[var(--primary)] font-mono">${finalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          {error && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-900/40 border border-red-500/50">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-300 min-w-0">
                <p className="font-medium mb-1">Payment Error</p>
                <p className="break-words">{error}</p>
              </div>
            </div>
          )}

          {/* Value Proposition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-sm text-blue-300 font-medium">PayPal Protected</p>
              <p className="text-xs text-gray-400">Secure & trusted checkout</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-green-300 font-medium">Fast Recovery</p>
              <p className="text-xs text-gray-400">Usually within 1 hour</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-purple-300 font-medium">Mobile Friendly</p>
              <p className="text-xs text-gray-400">Works with BlueWallet</p>
            </div>
          </div>

          {/* Payment Button */}
          <Button 
            onClick={handlePayPalPayment}
            disabled={isLoading || recoveryAmount <= 0}
            className="w-full bg-[#0070BA] hover:bg-[#005ea6] text-white font-semibold py-3 text-sm sm:text-base lg:text-lg rounded-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting to PayPal...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center text-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7.443 17.512c.162.433.433.645.864.645h2.16c.432 0 .648-.216.864-.648l.864-2.592.54-1.512s.108-.216.324-.216h3.456c1.296 0 2.16-.648 2.16-1.944 0-1.296-.864-1.944-2.16-1.944h-3.672c-.216 0-.324-.216-.324-.216l-.108-.432-.648-2.16c-.108-.432-.432-.648-.756-.648h-2.16c-.432 0-.648.216-.864.648l-1.08 3.24-1.08 3.024s-.108.432.0.648c.108.216.324.216.324.216h2.808c.216 0 .324.216.324.216l-.432 1.296-.756 2.376zm5.832-5.832c0-1.296-.864-1.944-2.16-1.944h-4.86c-.432 0-.648.216-.864.648l-1.08 3.24c-.108.216 0 .432.108.432h.54c.216 0 .324-.216.432-.432l.108-.432.864-2.592c.108-.432.432-.648.756-.648h2.052c1.296 0 2.16.648 2.16 1.944 0 1.296-.864 1.944-2.16 1.944h-1.62c-.216 0-.432.216-.432.432l-1.08 3.24c-.108.216 0 .432.108.432h.54c.216 0 .324-.216.432-.432l.108-.432.864-2.592c.108-.432.432-.648.756-.648h.54c1.296 0 2.16-.648 2.16-1.944z"/></svg>
                <span>Pay with PayPal</span>
              </div>
            )}
          </Button>

          {/* Safety Notice */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-4 h-4" />
            <span>You will be redirected to PayPal's secure checkout page.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}