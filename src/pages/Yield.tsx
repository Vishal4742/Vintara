import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Zap,
  Shield,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Star,
  Target,
  Activity,
} from "lucide-react";

export default function Yield() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedPool, setSelectedPool] = useState<number | null>(null);

  // Enhanced pool data with more details
  const pools = [
    {
      id: 1,
      name: "rBTC-USDT LP",
      apy: "45.2%",
      apyChange: "+2.3%",
      tvl: "$12.4M",
      tvlChange: "+8.1%",
      rewards: ["VINT", "rBTC"],
      deposited: "$5,420.00",
      earned: "$892.34",
      status: "active",
      risk: "low",
      lockPeriod: "0 days",
      multiplier: 1.0,
      totalStakers: 1247,
      minDeposit: "0.01",
      maxDeposit: "1000",
      autoCompound: true,
      fees: "0.1%",
      description:
        "High-yield liquidity pool for rBTC-USDT trading pair with dual token rewards",
    },
    {
      id: 2,
      name: "VINT Staking",
      apy: "67.8%",
      apyChange: "+5.7%",
      tvl: "$8.7M",
      tvlChange: "+12.3%",
      rewards: ["VINT"],
      deposited: "$3,200.00",
      earned: "$567.12",
      status: "active",
      risk: "medium",
      lockPeriod: "30 days",
      multiplier: 1.5,
      totalStakers: 892,
      minDeposit: "100",
      maxDeposit: "50000",
      autoCompound: true,
      fees: "0%",
      description:
        "Native VINT token staking with governance rewards and voting power",
    },
    {
      id: 3,
      name: "rBTC Single Asset",
      apy: "28.5%",
      apyChange: "-1.2%",
      tvl: "$24.1M",
      tvlChange: "+3.4%",
      rewards: ["VINT"],
      deposited: "$0.00",
      earned: "$0.00",
      status: "available",
      risk: "low",
      lockPeriod: "0 days",
      multiplier: 1.0,
      totalStakers: 2156,
      minDeposit: "0.001",
      maxDeposit: "100",
      autoCompound: false,
      fees: "0.05%",
      description:
        "Single asset staking for rBTC with flexible withdrawal and competitive yields",
    },
    {
      id: 4,
      name: "Lightning Pool",
      apy: "89.3%",
      apyChange: "+15.2%",
      tvl: "$2.1M",
      tvlChange: "+45.6%",
      rewards: ["VINT", "LN"],
      deposited: "$0.00",
      earned: "$0.00",
      status: "coming-soon",
      risk: "high",
      lockPeriod: "90 days",
      multiplier: 2.0,
      totalStakers: 0,
      minDeposit: "1.0",
      maxDeposit: "10",
      autoCompound: true,
      fees: "0.2%",
      description:
        "Premium yield pool with Lightning Network integration and maximum rewards",
    },
    {
      id: 5,
      name: "DAI Stable Pool",
      apy: "18.7%",
      apyChange: "+0.8%",
      tvl: "$5.8M",
      tvlChange: "+6.2%",
      rewards: ["VINT", "DAI"],
      deposited: "$0.00",
      earned: "$0.00",
      status: "available",
      risk: "low",
      lockPeriod: "0 days",
      multiplier: 1.0,
      totalStakers: 743,
      minDeposit: "100",
      maxDeposit: "100000",
      autoCompound: true,
      fees: "0.05%",
      description:
        "Stable yield farming for DAI with low volatility and consistent returns",
    },
  ];

  // Real-time data simulation
  const [realTimeData, setRealTimeData] = useState({
    totalTvl: "$47.2M",
    totalTvlChange: "+12.5%",
    userDeposits: "$8,620",
    userDepositsChange: "+8.3%",
    pendingRewards: "$1,459",
    pendingRewardsChange: "+15.7%",
    avgApy: "47.5%",
    avgApyChange: "+2.1%",
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        totalTvl: `$${(47.2 + Math.random() * 2).toFixed(1)}M`,
        pendingRewards: `$${(1459 + Math.random() * 50).toFixed(0)}`,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const filteredPools = pools.filter((pool) => {
    if (selectedTab === "my") return pool.deposited !== "$0.00";
    if (selectedTab === "active") return pool.status === "active";
    if (selectedTab === "high-yield") return parseFloat(pool.apy) > 50;
    return true;
  });

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Yield Farming</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stake your tokens and LP positions to earn rewards from our high-yield
          farming pools.
        </p>
      </div>

      {/* Enhanced Stats with Real-time Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 card-gradient border-border/40">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-bitcoin" />
                <span className="text-sm text-muted-foreground">
                  Total Value Locked
                </span>
              </div>
              <div className="text-2xl font-bold">{realTimeData.totalTvl}</div>
              <div className="flex items-center space-x-1">
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-xs text-success">
                  {realTimeData.totalTvlChange}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">
                Your Deposits
              </span>
            </div>
            <div className="text-2xl font-bold">
              {realTimeData.userDeposits}
            </div>
            <div className="flex items-center space-x-1">
              <ArrowUpRight className="h-3 w-3 text-success" />
              <span className="text-xs text-success">
                {realTimeData.userDepositsChange}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">
                Pending Rewards
              </span>
            </div>
            <div className="text-2xl font-bold">
              {realTimeData.pendingRewards}
            </div>
            <div className="flex items-center space-x-1">
              <ArrowUpRight className="h-3 w-3 text-success" />
              <span className="text-xs text-success">
                {realTimeData.pendingRewardsChange}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-bitcoin" />
              <span className="text-sm text-muted-foreground">Average APY</span>
            </div>
            <div className="text-2xl font-bold">{realTimeData.avgApy}</div>
            <div className="flex items-center space-x-1">
              <ArrowUpRight className="h-3 w-3 text-success" />
              <span className="text-xs text-success">
                {realTimeData.avgApyChange}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Pool List with Tabs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Farming Pools</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Pools</TabsTrigger>
            <TabsTrigger value="my">My Pools</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="high-yield">High Yield</TabsTrigger>
            <TabsTrigger value="low-risk">Low Risk</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredPools.length} pools</span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Activity className="h-4 w-4" />
                  <span>Live Data</span>
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6">
          {filteredPools.map((pool) => (
            <Card
              key={pool.id}
              className="p-6 card-gradient border-border/40 hover:border-bitcoin/20 transition-colors"
            >
              <div className="space-y-4">
                {/* Pool Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{pool.name}</h3>
                      <Badge
                        variant={
                          pool.status === "active"
                            ? "default"
                            : pool.status === "coming-soon"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          pool.status === "active"
                            ? "bg-success text-white"
                            : ""
                        }
                      >
                        {pool.status === "active"
                          ? "Active"
                          : pool.status === "coming-soon"
                          ? "Coming Soon"
                          : "Available"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          pool.risk === "low"
                            ? "text-success border-success"
                            : pool.risk === "medium"
                            ? "text-warning border-warning"
                            : "text-destructive border-destructive"
                        }
                      >
                        {pool.risk} risk
                      </Badge>
                      {pool.autoCompound && (
                        <Badge
                          variant="outline"
                          className="text-bitcoin border-bitcoin"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Auto-Compound
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                      {pool.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {pool.status === "active" ? (
                      <>
                        <Button variant="outline" size="sm">
                          Withdraw
                        </Button>
                        <Button
                          size="sm"
                          className="bg-bitcoin text-primary-foreground"
                        >
                          Harvest
                        </Button>
                      </>
                    ) : pool.status === "available" ? (
                      <Button
                        size="sm"
                        className="bg-bitcoin text-primary-foreground"
                        onClick={() => setSelectedPool(pool.id)}
                      >
                        Deposit
                      </Button>
                    ) : (
                      <Button size="sm" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>

                {/* Pool Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="text-lg font-bold text-bitcoin">
                        {pool.apy}
                      </div>
                      {pool.apyChange.startsWith("+") ? (
                        <ArrowUpRight className="h-3 w-3 text-success" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-destructive" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">APY</div>
                    <div
                      className={`text-xs ${
                        pool.apyChange.startsWith("+")
                          ? "text-success"
                          : "text-destructive"
                      }`}
                    >
                      {pool.apyChange}
                    </div>
                  </div>

                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <div className="text-lg font-bold">{pool.tvl}</div>
                    <div className="text-xs text-muted-foreground">TVL</div>
                    <div className="text-xs text-success">{pool.tvlChange}</div>
                  </div>

                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <div className="text-lg font-bold">{pool.deposited}</div>
                    <div className="text-xs text-muted-foreground">
                      Deposited
                    </div>
                  </div>

                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <div className="text-lg font-bold text-success">
                      {pool.earned}
                    </div>
                    <div className="text-xs text-muted-foreground">Earned</div>
                  </div>

                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <div className="text-lg font-bold">
                      {pool.totalStakers.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Stakers</div>
                  </div>

                  <div className="text-center p-3 rounded-lg bg-secondary/30">
                    <div className="text-lg font-bold">{pool.lockPeriod}</div>
                    <div className="text-xs text-muted-foreground">
                      Lock Period
                    </div>
                  </div>
                </div>

                {/* Pool Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <span>Rewards:</span>
                    {pool.rewards.map((reward, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {reward}
                      </Badge>
                    ))}
                  </div>
                  <span>•</span>
                  <span>Min: {pool.minDeposit}</span>
                  <span>•</span>
                  <span>Max: {pool.maxDeposit}</span>
                  <span>•</span>
                  <span>Fees: {pool.fees}</span>
                  <span>•</span>
                  <span>Multiplier: {pool.multiplier}x</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Rewards Section */}
      <div className="grid gap-6">
        {/* Claim All Rewards */}
        <Card className="p-6 card-elevated border-bitcoin/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold">Total Pending Rewards</h3>
              <p className="text-2xl font-bold text-bitcoin">
                {realTimeData.pendingRewards}
              </p>
              <p className="text-sm text-muted-foreground">
                Claim all your farming rewards in one transaction
              </p>
            </div>
            <Button className="btn-bitcoin md:w-auto">Claim All Rewards</Button>
          </div>
        </Card>

        {/* Auto-Compound Settings */}
        <Card className="p-6 card-gradient border-border/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-bitcoin" />
                <h3 className="text-lg font-semibold">
                  Auto-Compound Settings
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically reinvest your rewards to maximize compound returns
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium">Auto-Compound Active</div>
                <div className="text-xs text-muted-foreground">
                  Next compound in 2h 15m
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
        </Card>

        {/* Risk Information */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Yield Farming Risks:</strong> High APY pools may carry
            higher risks including impermanent loss, smart contract risks, and
            market volatility. Always do your own research and only invest what
            you can afford to lose.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
