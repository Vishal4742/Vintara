import { useState } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RiskManager } from "@/components/ui/RiskManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Wallet,
  PieChart,
  Clock,
  Shield,
  Copy,
  CheckCircle,
  Info,
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  // Wagmi hooks for wallet data
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
  });
  const { disconnect } = useDisconnect();

  // Helper function to copy address
  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // Helper function to format address
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Mock transactions (in real app, fetch based on wallet address)
  const transactions = [
    {
      id: 1,
      type: "Deposit",
      token: "BTC",
      amount: "0.05",
      value: "$2,150",
      status: "completed",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "Yield Claim",
      token: "VINT",
      amount: "12.50",
      value: "$89",
      status: "completed",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "Swap",
      token: "BTC → ETH",
      amount: "0.02",
      value: "$860",
      status: "pending",
      time: "3 hours ago",
    },
    {
      id: 4,
      type: "LP Add",
      token: "BTC-USDT",
      amount: "500",
      value: "$500",
      status: "completed",
      time: "1 day ago",
    },
  ];

  // If wallet is not connected, show connect wallet prompt
  if (!isConnected) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="space-y-4">
            <Wallet className="h-16 w-16 mx-auto text-muted-foreground" />
            <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
            <p className="text-muted-foreground max-w-md">
              Connect your wallet to view your DeFi portfolio, track your yields, and manage your Bitcoin positions.
            </p>
          </div>
          <ConnectWallet />
          <Alert className="max-w-md">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Make sure you're connected to the Rootstock network to access all features.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header with Wallet Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Your DeFi Portfolio</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <span>Connected:</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 font-mono text-xs"
                onClick={copyAddress}
              >
                {formatAddress(address!)}
                {copiedAddress ? (
                  <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3 ml-1" />
                )}
              </Button>
            </div>
            {chain && (
              <div className="flex items-center space-x-2">
                <span>Network:</span>
                <Badge variant="outline" className="text-xs">
                  {chain.name}
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <ConnectWallet />
        </div>
      </div>

      {/* Wallet Balance Card */}
      <Card className="p-6 bg-gradient-to-r from-bitcoin/5 to-bitcoin-light/5 border-bitcoin/20">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Wallet Balance</h2>
            <div className="space-y-1">
              {balanceLoading ? (
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold text-bitcoin">
                  {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '0 RBTC'}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Native balance on {chain?.name || 'Rootstock'}
              </p>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="text-sm text-muted-foreground">Est. USD Value</div>
            <div className="text-xl font-semibold">
              {balance ? `$${(Number(balance.formatted) * 43000).toFixed(2)}` : '$0.00'}
            </div>
          </div>
        </div>
      </Card>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="risk">Risk Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Disclaimer for Demo Data */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Portfolio metrics below are demo data. In a live environment, these would be fetched based on your wallet address: <code className="bg-muted px-1 rounded text-xs">{formatAddress(address!)}</code>
            </AlertDescription>
          </Alert>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Wallet Balance"
              value={balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '0 RBTC'}
              subtitle="Native balance"
              icon={<Wallet className="h-5 w-5" />}
              trend="neutral"
            />
            <StatCard
              title="Active Liquidity"
              value="$2,345.00"
              subtitle="In liquidity pools"
              icon={<Activity className="h-5 w-5" />}
              trend="up"
              trendValue="3.2%"
            />
            <StatCard
              title="Total Yield Earned"
              value="$326.89"
              subtitle="All time"
              icon={<TrendingUp className="h-5 w-5" />}
              trend="up"
              trendValue="18.9%"
            />
            <StatCard
              title="Average APY"
              value="12.4%"
              subtitle="Current rate"
              icon={<TrendingUp className="h-5 w-5" />}
              trend="neutral"
            />
          </div>

          {/* Charts and Activity */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Portfolio Chart */}
            <Card className="lg:col-span-2 p-6 card-gradient border-border/40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Portfolio Performance</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    7D
                  </Button>
                  <Button variant="outline" size="sm">
                    30D
                  </Button>
                  <Button
                    size="sm"
                    className="bg-bitcoin text-primary-foreground"
                  >
                    90D
                  </Button>
                </div>
              </div>

              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <TrendingUp className="h-12 w-12 mx-auto opacity-50" />
                  <p>Portfolio chart visualization</p>
                  <p className="text-sm">(Chart component to be integrated)</p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 card-gradient border-border/40">
              <h2 className="text-lg font-semibold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/swap">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Swap Tokens
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/liquidity">
                    <Activity className="h-4 w-4 mr-2" />
                    Add Liquidity
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a href="/yield">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Stake Tokens
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Bridge Assets
                </Button>
              </div>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="p-6 card-gradient border-border/40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        tx.status === "completed"
                          ? "bg-success"
                          : tx.status === "pending"
                          ? "bg-warning"
                          : "bg-destructive"
                      }`}
                    />
                    <div>
                      <div className="font-medium">{tx.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {tx.token}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-medium">
                      {tx.type === "Yield Claim" || tx.type === "Deposit"
                        ? "+"
                        : ""}
                      {tx.amount} {tx.token.includes("→") ? "" : tx.token}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tx.value}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {tx.time}
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        tx.status === "completed"
                          ? "text-success"
                          : tx.status === "pending"
                          ? "text-warning"
                          : "text-destructive"
                      }`}
                    >
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-8">
          <RiskManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
