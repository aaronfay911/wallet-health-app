import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UsageMetric } from "@/api/entities";
import { Transaction } from "@/api/entities/Transaction";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Zap,
  AlertTriangle,
  RefreshCw,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format, startOfDay, subDays } from "date-fns";

export default function BusinessDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7'); // days

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [metricsData, transactionsData] = await Promise.all([
        UsageMetric.list('-timestamp', 1000),
        Transaction.list('-created_date', 500)
      ]);
      
      setMetrics(metricsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error loading business data:", error);
    }
    setIsLoading(false);
  };

  const calculateBusinessMetrics = () => {
    const days = parseInt(timeRange);
    const cutoffDate = subDays(new Date(), days);
    
    // Filter recent metrics
    const recentMetrics = metrics.filter(m => 
      new Date(m.timestamp || m.created_date) >= cutoffDate
    );
    
    const recentTransactions = transactions.filter(t =>
      new Date(t.created_date) >= cutoffDate
    );

    // Calculate totals
    const totalRevenue = recentMetrics
      .filter(m => m.metric_type === 'payment_processed')
      .reduce((sum, m) => sum + (m.revenue_cents || 0), 0) / 100;
    
    const totalCosts = recentMetrics
      .reduce((sum, m) => sum + (m.cost_cents || 0), 0) / 100;
    
    const netProfit = totalRevenue - totalCosts;
    
    // API usage
    const apiCalls = recentMetrics.filter(m => m.metric_type === 'api_call').length;
    const errors = recentMetrics.filter(m => m.metric_type === 'error_occurred').length;
    
    // Recovery stats
    const recoveryAttempts = recentTransactions.length;
    const successfulRecoveries = recentTransactions.filter(t => t.status === 'recovered').length;
    const successRate = recoveryAttempts > 0 ? (successfulRecoveries / recoveryAttempts) * 100 : 0;
    
    return {
      totalRevenue,
      totalCosts,
      netProfit,
      apiCalls,
      errors,
      recoveryAttempts,
      successfulRecoveries,
      successRate,
      errorRate: apiCalls > 0 ? (errors / apiCalls) * 100 : 0
    };
  };

  const generateChartData = () => {
    const days = parseInt(timeRange);
    const chartData = [];
    
    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayMetrics = metrics.filter(m => {
        const metricDate = new Date(m.timestamp || m.created_date);
        return metricDate >= dayStart && metricDate < dayEnd;
      });
      
      const dayTransactions = transactions.filter(t => {
        const txDate = new Date(t.created_date);
        return txDate >= dayStart && txDate < dayEnd;
      });
      
      const revenue = dayMetrics
        .filter(m => m.metric_type === 'payment_processed')
        .reduce((sum, m) => sum + (m.revenue_cents || 0), 0) / 100;
        
      const costs = dayMetrics
        .reduce((sum, m) => sum + (m.cost_cents || 0), 0) / 100;
      
      chartData.push({
        date: format(date, 'MMM dd'),
        revenue: revenue,
        costs: costs,
        profit: revenue - costs,
        recoveries: dayTransactions.filter(t => t.status === 'recovered').length,
        apiCalls: dayMetrics.filter(m => m.metric_type === 'api_call').length
      });
    }
    
    return chartData;
  };

  const businessMetrics = calculateBusinessMetrics();
  const chartData = generateChartData();

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "text-white" }) => (
    <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            {trend && (
              <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-xs font-medium">{Math.abs(trend)}%</span>
              </div>
            )}
            <Icon className="w-8 h-8 text-[var(--primary)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Business Analytics</h2>
          <p className="text-gray-400">Monitor costs, revenue, and usage patterns</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[var(--surface)] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue"
          value={`$${businessMetrics.totalRevenue.toFixed(2)}`}
          subtitle={`${businessMetrics.successfulRecoveries} successful recoveries`}
          icon={DollarSign}
          color="text-green-400"
        />
        
        <StatCard
          title="Operating Costs"
          value={`$${businessMetrics.totalCosts.toFixed(2)}`}
          subtitle={`${businessMetrics.apiCalls} API calls made`}
          icon={TrendingDown}
          color="text-red-400"
        />
        
        <StatCard
          title="Net Profit"
          value={`$${businessMetrics.netProfit.toFixed(2)}`}
          subtitle={`${((businessMetrics.netProfit / Math.max(businessMetrics.totalRevenue, 1)) * 100).toFixed(1)}% margin`}
          icon={TrendingUp}
          color={businessMetrics.netProfit >= 0 ? "text-green-400" : "text-red-400"}
        />
        
        <StatCard
          title="Success Rate"
          value={`${businessMetrics.successRate.toFixed(1)}%`}
          subtitle={`${businessMetrics.recoveryAttempts} total attempts`}
          icon={Zap}
          color="text-[var(--primary)]"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="text-white">Revenue vs Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="costs" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="#00D4FF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
          <CardHeader>
            <CardTitle className="text-white">Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="recoveries" fill="#00D4FF" />
                  <Bar dataKey="apiCalls" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card className="glass-effect border-[var(--glass-border)] bg-[var(--glass)]">
        <CardHeader>
          <CardTitle className="text-white">Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-300">API Usage Costs</h4>
              {['blockchain_api', 'llm_api', 'communication'].map(category => {
                const categoryCosts = metrics
                  .filter(m => m.category === category)
                  .reduce((sum, m) => sum + (m.cost_cents || 0), 0) / 100;
                
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 capitalize">
                      {category.replace('_', ' ')}
                    </span>
                    <span className="text-white font-mono">${categoryCosts.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-300">System Health</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Error Rate</span>
                <Badge className={businessMetrics.errorRate > 5 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}>
                  {businessMetrics.errorRate.toFixed(1)}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Errors</span>
                <span className="text-white">{businessMetrics.errors}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-300">Projections</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Monthly Revenue</span>
                <span className="text-green-400 font-mono">
                  ${(businessMetrics.totalRevenue * (30 / parseInt(timeRange))).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Monthly Costs</span>
                <span className="text-red-400 font-mono">
                  ${(businessMetrics.totalCosts * (30 / parseInt(timeRange))).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}