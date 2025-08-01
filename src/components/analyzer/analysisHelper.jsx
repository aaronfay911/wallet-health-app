import { InvokeLLM } from "@/api/integrations";
import { WalletReport } from "@/api/entities";

export const performWalletAnalysis = async (walletAddress, blockchain) => {
    const analysisPrompt = `
You are an expert on-chain intelligence analyst for a tool called Wallet Watchdog.
Your task is to analyze the ${blockchain} wallet address: ${walletAddress} and generate a comprehensive, structured report.

**Critical Requirements for Score Breakdown:**
The health_score_breakdown MUST contain factors with meaningful, non-zero score_impact values. Each score_impact must be an integer between -15 and +15, and they should add up to approximately match the overall_health_score deviation from a baseline of 75.

For example, if overall_health_score is 85, the breakdown might be:
- Asset Diversity: +8 (strong diversification)  
- Transaction Volume: +5 (healthy activity level)
- Protocol Interactions: -3 (some risk from new protocols)

**Analysis Requirements:**
1. **Overall Health Score (1-100):** Calculate a realistic score between 60-90.
2. **Health Summary Text:** One sentence explaining the score.
3. **Health Score Breakdown:** Provide exactly 3-4 factors. Each MUST have:
   - category: descriptive name
   - score_impact: integer between -15 and +15 (NEVER 0)
   - description: brief explanation of why this impacts the score
4. **Behavior Profile:** Choose ONE tag and provide supporting details
5. **AI Summary:** Risk-based summary using appropriate template
6. **Recommendations:** 2-3 actionable items
7. **Score Trend:** Return 3 DIFFERENT historical scores showing realistic variation

Return a single JSON object matching the provided schema.
    `;

    const aiAnalysis = await InvokeLLM({
        prompt: analysisPrompt,
        add_context_from_internet: true,
        response_json_schema: {
            type: "object",
            properties: {
                overall_health_score: { type: "number" },
                health_summary_text: { type: "string" },
                health_score_breakdown: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            category: { type: "string" },
                            score_impact: { type: "number" },
                            description: { type: "string" }
                        },
                        required: ["category", "score_impact", "description"]
                    }
                },
                ai_summary: { type: "string" },
                behavior_profile: {
                    type: "object",
                    properties: {
                        tag: { type: "string" },
                        summary: { type: "string" },
                        details: { type: "array", items: { type: "string" } }
                    },
                    required: ["tag", "summary", "details"]
                },
                score_trend: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: { date: { type: "string" }, score: { type: "number" } }
                    }
                },
                recommendations: { type: "array", items: { type: "string" } }
            },
            required: ["overall_health_score", "health_summary_text", "health_score_breakdown", "ai_summary", "behavior_profile", "recommendations", "score_trend"]
        }
    });

    return {
        wallet_address: walletAddress,
        blockchain: blockchain,
        ...aiAnalysis,
        analysis_date: new Date().toISOString()
    };
};