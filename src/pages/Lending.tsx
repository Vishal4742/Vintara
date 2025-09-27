import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EnhancedLendingForm } from "@/components/ui/EnhancedLendingForm";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  DollarSign,
  Percent,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function Lending() {
  const [depositAmount, setDepositAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");

  // Mock data
  const userPosition = {
    collateral: 2.5, // BTC
    borrowed: 15000, // USDT
    healthFactor: 1.85,
    maxBorrow: 20000,
    utilizationRate: 75,
  };

  const marketData = {
    totalCollateral: "$125.4M",
    totalBorrowed: "$89.2M",
    borrowRate: 8.5,
    supplyRate: 6.2,
    liquidationThreshold: 120,
  };

  const lendingPools = [
    {
      asset: "rBTC",
      apy: "6.2%",
      totalSupply: "$45.2M",
      utilization: 68,
      collateralFactor: 80,
    },
    {
      asset: "USDT",
      apy: "8.5%",
      totalSupply: "$32.1M",
      utilization: 82,
      collateralFactor: 85,
    },
    {
      asset: "DAI",
      apy: "7.8%",
      totalSupply: "$18.7M",
      utilization: 71,
      collateralFactor: 80,
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Lending Protocol</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Deposit collateral to borrow assets or supply liquidity to earn
          interest. All secured by Bitcoin's hash power on Rootstock.
        </p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <Shield className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">
              {marketData.totalCollateral}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Collateral
            </div>
          </div>
        </Card>
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <TrendingUp className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">{marketData.totalBorrowed}</div>
            <div className="text-sm text-muted-foreground">Total Borrowed</div>
          </div>
        </Card>
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <Percent className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">{marketData.borrowRate}%</div>
            <div className="text-sm text-muted-foreground">Borrow Rate</div>
          </div>
        </Card>
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <DollarSign className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">{marketData.supplyRate}%</div>
            <div className="text-sm text-muted-foreground">Supply Rate</div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Enhanced Lending Interface */}
        <div className="lg:col-span-1 space-y-6">
          <EnhancedLendingForm />
        </div>

        {/* Original Lending Interface (for comparison) */}
        <div className="lg:col-span-1 space-y-6 hidden">
          <Card className="p-6 card-gradient border-border/40">
            <Tabs defaultValue="supply" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="supply">Supply</TabsTrigger>
                <TabsTrigger value="borrow">Borrow</TabsTrigger>
              </TabsList>

              <TabsContent value="supply" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Asset
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="0.0"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="bg-secondary/50"
                      />
                      <Button variant="outline">rBTC</Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Balance: 2.5 rBTC
                    </div>
                  </div>

                  <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Supply APY</span>
                      <span className="text-bitcoin font-medium">6.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Collateral Factor
                      </span>
                      <span>80%</span>
                    </div>
                  </div>

                  <Button className="w-full btn-bitcoin">Supply rBTC</Button>
                </div>
              </TabsContent>

              <TabsContent value="borrow" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Asset
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="0.0"
                        value={borrowAmount}
                        onChange={(e) => setBorrowAmount(e.target.value)}
                        className="bg-secondary/50"
                      />
                      <Button variant="outline">USDT</Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Available: 20,000 USDT
                    </div>
                  </div>

                  <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Borrow APY</span>
                      <span className="text-bitcoin font-medium">8.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Borrow</span>
                      <span>20,000 USDT</span>
                    </div>
                  </div>

                  <Button className="w-full btn-bitcoin">Borrow USDT</Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Position Management */}
          <Card className="p-6 card-gradient border-border/40">
            <h3 className="text-lg font-semibold mb-4">Your Position</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Collateral</span>
                  <span className="font-medium">
                    {userPosition.collateral} rBTC
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Borrowed</span>
                  <span className="font-medium">
                    ${userPosition.borrowed.toLocaleString()} USDT
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Health Factor</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-medium ${
                        userPosition.healthFactor > 1.5
                          ? "text-success"
                          : "text-warning"
                      }`}
                    >
                      {userPosition.healthFactor}x
                    </span>
                    {userPosition.healthFactor < 1.5 && (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Health Factor</span>
                  <span>{userPosition.healthFactor}x</span>
                </div>
                <Progress
                  value={(userPosition.healthFactor / 2) * 100}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Liquidation at 1.2x</span>
                  <span>Safe at 2.0x</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  Withdraw
                </Button>
                <Button variant="outline" size="sm">
                  Repay
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Market Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lending Markets</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                All Assets
              </Button>
              <Button size="sm" className="bg-bitcoin text-primary-foreground">
                Supply
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {lendingPools.map((pool, index) => (
              <Card key={index} className="p-6 card-gradient border-border/40">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{pool.asset}</h3>
                      <Badge variant="outline" className="text-xs">
                        {pool.collateralFactor}% Collateral
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Total Supply: {pool.totalSupply}</span>
                      <span>•</span>
                      <span>Utilization: {pool.utilization}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
                    <div className="grid grid-cols-2 gap-4 lg:gap-8">
                      <div className="text-center">
                        <div className="text-lg font-bold text-bitcoin">
                          {pool.apy}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Supply APY
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {(parseFloat(pool.apy) + 2.3).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Borrow APY
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Supply
                      </Button>
                      <Button
                        size="sm"
                        className="bg-bitcoin text-primary-foreground"
                      >
                        <TrendingDown className="h-4 w-4 mr-1" />
                        Borrow
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Risk Information */}
          <Card className="p-6 border-accent/20 bg-accent/5">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-accent mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-accent mb-1">Liquidation Risk</p>
                <p className="text-muted-foreground">
                  If your health factor drops below 1.2x, your collateral may be
                  liquidated. Monitor your position and maintain adequate
                  collateralization.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
