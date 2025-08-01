import React from "react";
import { UsageMetric } from "@/api/entities";
import { User } from "@/api/entities";

class UsageTracker {
  static async trackAPICall(endpoint, costCents = 0, responseTimeMs = 0, success = true, errorMessage = null) {
    try {
      const user = await User.me().catch(() => null);
      
      await UsageMetric.create({
        metric_type: "api_call",
        category: this.getCategoryFromEndpoint(endpoint),
        cost_cents: costCents,
        revenue_cents: 0,
        metadata: {
          user_id: user?.id || "anonymous",
          api_endpoint: endpoint,
          response_time_ms: responseTimeMs,
          success: success,
          error_message: errorMessage
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error tracking API call:", error);
    }
  }

  static async trackPayment(paymentAmount, transactionId, success = true) {
    try {
      const user = await User.me().catch(() => null);
      
      await UsageMetric.create({
        metric_type: "payment_processed",
        category: "payment",
        cost_cents: Math.round(paymentAmount * 2.9 + 30), // Stripe fees: 2.9% + $0.30
        revenue_cents: Math.round(paymentAmount * 100),
        metadata: {
          user_id: user?.id || "anonymous",
          transaction_id: transactionId,
          success: success
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error tracking payment:", error);
    }
  }

  static async trackRecoveryAttempt(transactionId, recoveryAmount) {
    try {
      const user = await User.me().catch(() => null);
      
      await UsageMetric.create({
        metric_type: "recovery_attempt",
        category: "user_activity",
        cost_cents: 0,
        revenue_cents: 0,
        metadata: {
          user_id: user?.id || "anonymous",
          transaction_id: transactionId,
          recovery_amount: recoveryAmount
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error tracking recovery attempt:", error);
    }
  }

  static async trackRecoverySuccess(transactionId, recoveryAmount, actualRecovered) {
    try {
      const user = await User.me().catch(() => null);
      
      await UsageMetric.create({
        metric_type: "recovery_success",
        category: "user_activity", 
        cost_cents: 0,
        revenue_cents: 0,
        metadata: {
          user_id: user?.id || "anonymous",
          transaction_id: transactionId,
          recovery_amount: recoveryAmount,
          actual_recovered: actualRecovered,
          success: true
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error tracking recovery success:", error);
    }
  }

  static async trackError(errorType, errorMessage, context = {}) {
    try {
      const user = await User.me().catch(() => null);
      
      await UsageMetric.create({
        metric_type: "error_occurred",
        category: "system",
        cost_cents: 0,
        revenue_cents: 0,
        metadata: {
          user_id: user?.id || "anonymous",
          error_type: errorType,
          error_message: errorMessage,
          ...context
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error tracking error:", error);
    }
  }

  static getCategoryFromEndpoint(endpoint) {
    if (endpoint.includes('blockchain') || endpoint.includes('mempool')) return 'blockchain_api';
    if (endpoint.includes('llm') || endpoint.includes('ai')) return 'llm_api';
    if (endpoint.includes('payment') || endpoint.includes('stripe')) return 'payment';
    if (endpoint.includes('email') || endpoint.includes('sms')) return 'communication';
    return 'system';
  }

  // Cost estimation constants (update these based on your actual API pricing)
  static API_COSTS = {
    blockchain_query: 0.1, // $0.001 per call
    llm_call: 2.0, // $0.02 per call  
    email_send: 0.1, // $0.001 per email
    sms_send: 3.0 // $0.03 per SMS
  };
}

export default UsageTracker;