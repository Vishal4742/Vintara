import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
} from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("tvl");

  // Mock data for analytics
  const protocolStats = {
    tvl: "$47.2M",
    tvlChange: "+12.5%",
    totalUsers: "1,247",
    userChange: "+8.2%",
    totalVolume: "$125.4M",
    volumeChange: "+23.1%",
    avgAPY: "42.3%",
    apyChange: "-2.1%",
    totalFees: "$2.8M",
    feesChange: "+15.7%",
    activePools: 12,
    poolsChange: "+2",
  };

  // Historical data for charts
  const historicalData = {
    tvl: [
      { date: "2024-01-01", value: 35000000 },
      { date: "2024-01-02", value: 36500000 },
      { date: "2024-01-03", value: 38000000 },
      { date: "2024-01-04", value: 39500000 },
      { date: "2024-01-05", value: 41000000 },
      { date: "2024-01-06", value: 42500000 },
      { date: "2024-01-07", value: 47200000 },
    ],
    volume: [
      { date: "2024-01-01", value: 8500000 },
      { date: "2024-01-02", value: 9200000 },
      { date: "2024-01-03", value: 10800000 },
      { date: "2024-01-04", value: 12500000 },
      { date: "2024-01-05", value: 11800000 },
      { date: "2024-01-06", value: 13200000 },
      { date: "2024-01-07", value: 15400000 },
    ],
    users: [
      { date: "2024-01-01", value: 1150 },
      { date: "2024-01-02", value: 1180 },
      { date: "2024-01-03", value: 1205 },
      { date: "2024-01-04", value: 1230 },
      { date: "2024-01-05", value: 1250 },
      { date: "2024-01-06", value: 1245 },
      { date: "2024-01-07", value: 1247 },
    ],
  };

  // Performance metrics
  const performanceMetrics = [
    {
      name: "Total Return",
      value: "342.7%",
      change: "+12.3%",
      period: "1Y",
      trend: "up",
    },
    {
      name: "Sharpe Ratio",
      value: "2.84",
      change: "+0.15",
      period: "1Y",
      trend: "up",
    },
    {
      name: "Max Drawdown",
      value: "-8.2%",
      change: "-1.1%",
      period: "1Y",
      trend: "down",
    },
    {
      name: "Volatility",
      value: "24.3%",
      change: "-2.1%",
      period: "1Y",
      trend: "down",
    },
  ];

  // Token distribution
  const tokenDistribution = [
    { token: "rBTC", percentage: 45.2, value: "$21.3M", change: "+5.2%" },
    { token: "USDT", percentage: 28.7, value: "$13.5M", change: "+2.1%" },
    { token: "VINT", percentage: 15.8, value: "$7.4M", change: "+8.9%" },
    { token: "ETH", percentage: 6.3, value: "$3.0M", change: "-1.2%" },
    { token: "Others", percentage: 4.0, value: "$1.9M", change: "+0.8%" },
  ];

  // Protocol comparison
  const protocolComparison = [
    {
      protocol: "Vintara",
      tvl: "$47.2M",
      apy: "42.3%",
      users: "1,247",
      volume: "$125.4M",
      fees: "$2.8M",
    },
    {
      protocol: "Compound",
      tvl: "$2.1B",
      apy: "8.2%",
      users: "45,000",
      volume: "$890M",
      fees: "$12.5M",
    },
    {
      protocol: "Aave",
      tvl: "$6.8B",
      apy: "12.5%",
      users: "78,000",
      volume: "$1.2B",
      fees: "$18.7M",
    },
    {
      protocol: "Uniswap",
      tvl: "$4.2B",
      apy: "15.8%",
      users: "125,000",
      volume: "$2.8B",
      fees: "$42.1M",
    },
  ];

  const yieldMetrics = [
    { name: "Yield Vault", tvl: "$18.5M", apy: "15.2%", change: "+5.2%" },
    { name: "Lending Protocol", tvl: "$12.3M", apy: "8.5%", change: "+2.1%" },
    { name: "Liquidity Pools", tvl: "$10.8M", apy: "23.7%", change: "+8.9%" },
    { name: "Yield Farming", tvl: "$5.6M", apy: "67.8%", change: "+12.3%" },
  ];

  const topPools = [
    {
      pair: "rBTC/USDT",
      tvl: "$8.2M",
      volume24h: "$2.1M",
      apy: "28.5%",
      fees24h: "$6,300",
    },
    {
      pair: "VINT/rBTC",
      tvl: "$5.4M",
      volume24h: "$890K",
      apy: "45.2%",
      fees24h: "$2,670",
    },
    {
      pair: "rBTC/DAI",
      tvl: "$4.1M",
      volume24h: "$1.2M",
      apy: "22.8%",
      fees24h: "$3,600",
    },
    {
      pair: "USDT/DAI",
      tvl: "$3.8M",
      volume24h: "$2.8M",
      apy: "18.9%",
      fees24h: "$8,400",
    },
  ];

  const recentTransactions = [
    {
      type: "Deposit",
      user: "0x1234...5678",
      amount: "2.5 rBTC",
      value: "$107,500",
      time: "2 min ago",
    },
    {
      type: "Borrow",
      user: "0xabcd...efgh",
      amount: "15,000 USDT",
      value: "$15,000",
      time: "5 min ago",
    },
    {
      type: "Swap",
      user: "0x9876...5432",
      amount: "0.8 rBTC → 34,600 USDT",
      value: "$34,600",
      time: "8 min ago",
    },
    {
      type: "Liquidity Add",
      user: "0x4567...8901",
      amount: "1,000 USDT + 0.023 rBTC",
      value: "$2,000",
      time: "12 min ago",
    },
    {
      type: "Yield Claim",
      user: "0x2345...6789",
      amount: "125.5 VINT",
      value: "$892",
      time: "15 min ago",
    },
  ];

  const performanceData = [
    { period: "1D", tvl: "$45.2M", volume: "$8.2M", users: "1,180" },
    { period: "7D", tvl: "$47.2M", volume: "$45.6M", users: "1,247" },
    { period: "30D", tvl: "$38.9M", volume: "$125.4M", users: "1,156" },
    { period: "90D", tvl: "$29.1M", volume: "$287.3M", users: "892" },
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Protocol performance and market insights
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button size="sm" className="bg-bitcoin text-primary-foreground">
            <BarChart3 className="h-4 w-4 mr-2" />
            View on Explorer
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
              <SelectItem value="90d">90D</SelectItem>
              <SelectItem value="1y">1Y</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tvl">TVL</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="fees">Fees</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Protocol Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 card-gradient border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Value Locked
              </p>
              <p className="text-2xl font-bold">{protocolStats.tvl}</p>
              <div className="flex items-center space-x-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-xs text-success">
                  {protocolStats.tvlChange}
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-bitcoin" />
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{protocolStats.totalUsers}</p>
              <div className="flex items-center space-x-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-xs text-success">
                  {protocolStats.userChange}
                </span>
              </div>
            </div>
            <Users className="h-8 w-8 text-bitcoin" />
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">{protocolStats.totalVolume}</p>
              <div className="flex items-center space-x-1 mt-1">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-xs text-success">
                  {protocolStats.volumeChange}
                </span>
              </div>
            </div>
            <Activity className="h-8 w-8 text-bitcoin" />
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average APY</p>
              <p className="text-2xl font-bold">{protocolStats.avgAPY}</p>
              <div className="flex items-center space-x-1 mt-1">
                <ArrowDownRight className="h-3 w-3 text-destructive" />
                <span className="text-xs text-destructive">
                  {protocolStats.apyChange}
                </span>
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-bitcoin" />
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6 card-gradient border-border/40">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/30">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {metric.name}
                  </div>
                  <div className="text-xl font-bold">{metric.value}</div>
                  <div className="flex items-center space-x-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span
                      className={`text-xs ${
                        metric.trend === "up"
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {metric.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({metric.period})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Token Distribution */}
      <Card className="p-6 card-gradient border-border/40">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Token Distribution</h2>
          <div className="space-y-3">
            {tokenDistribution.map((token, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{token.token}</span>
                  <div className="text-right">
                    <div className="font-medium">{token.value}</div>
                    <div
                      className={`text-xs ${
                        token.change.startsWith("+")
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {token.change}
                    </div>
                  </div>
                </div>
                <Progress value={token.percentage} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {token.percentage.toFixed(1)}% of total TVL
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Protocol Comparison */}
      <Card className="p-6 card-gradient border-border/40">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Protocol Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b border-border/40">
                  <th className="text-left py-2">Protocol</th>
                  <th className="text-right py-2">TVL</th>
                  <th className="text-right py-2">APY</th>
                  <th className="text-right py-2">Users</th>
                  <th className="text-right py-2">Volume</th>
                  <th className="text-right py-2">Fees</th>
                </tr>
              </thead>
              <tbody>
                {protocolComparison.map((protocol, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/20 last:border-b-0"
                  >
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{protocol.protocol}</span>
                        {protocol.protocol === "Vintara" && (
                          <Badge
                            variant="outline"
                            className="text-bitcoin border-bitcoin"
                          >
                            Our Protocol
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="text-right py-3">{protocol.tvl}</td>
                    <td className="text-right py-3">
                      <span
                        className={
                          protocol.protocol === "Vintara"
                            ? "text-bitcoin font-medium"
                            : ""
                        }
                      >
                        {protocol.apy}
                      </span>
                    </td>
                    <td className="text-right py-3">{protocol.users}</td>
                    <td className="text-right py-3">{protocol.volume}</td>
                    <td className="text-right py-3">{protocol.fees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Yield Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 card-gradient border-border/40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Yield Metrics</h2>
              <Badge variant="outline" className="text-xs">
                Live Data
              </Badge>
            </div>

            <div className="space-y-4">
              {yieldMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{metric.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      TVL: {metric.tvl}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-bitcoin">
                        {metric.apy}
                      </span>
                      <div className="flex items-center space-x-1">
                        <ArrowUpRight className="h-3 w-3 text-success" />
                        <span className="text-xs text-success">
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">APY</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Pools */}
          <Card className="p-6 card-gradient border-border/40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Top Liquidity Pools</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {topPools.map((pool, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{pool.pair}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>TVL: {pool.tvl}</span>
                      <span>•</span>
                      <span>24h Vol: {pool.volume24h}</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-bitcoin">
                        {pool.apy}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">APY</p>
                    <p className="text-xs text-muted-foreground">
                      Fees: {pool.fees24h}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Performance & Activity */}
        <div className="space-y-6">
          {/* Performance Chart Placeholder */}
          <Card className="p-6 card-gradient border-border/40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">TVL Performance</h2>
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
                <p>TVL Chart</p>
                <p className="text-sm">(Chart component to be integrated)</p>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 card-gradient border-border/40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {tx.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {tx.time}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">{tx.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{tx.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Table */}
          <Card className="p-6 card-gradient border-border/40">
            <h2 className="text-lg font-semibold mb-6">Performance Overview</h2>

            <div className="space-y-4">
              {performanceData.map((data, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{data.period}</h3>
                    <p className="text-sm text-muted-foreground">
                      TVL: {data.tvl}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm">Vol: {data.volume}</p>
                    <p className="text-sm">Users: {data.users}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
