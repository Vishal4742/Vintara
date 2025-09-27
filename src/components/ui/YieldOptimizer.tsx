import { useState, useEffect } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { Switch } from "./switch";
import { Slider } from "./slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Alert, AlertDescription } from "./alert";
import { Progress } from "./progress";
import {
  TrendingUp,
  Shield,
  Zap,
  Target,
  BarChart3,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  PieChart,
} from "lucide-react";

interface YieldStrategy {
  id: string;
  name: string;
  description: string;
  apy: number;
  risk: "low" | "medium" | "high";
  minDeposit: number;
  maxDeposit: number;
  lockPeriod: number;
  autoCompound: boolean;
  fees: number;
  healthFactor: number;
  liquidationThreshold: number;
}

interface PortfolioPosition {
  strategy: YieldStrategy;
  amount: number;
  value: number;
  apy: number;
  earned: number;
  healthFactor: number;
}

export function YieldOptimizer() {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [totalDeposit, setTotalDeposit] = useState(10000);
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [optimizedPortfolio, setOptimizedPortfolio] = useState<
    PortfolioPosition[]
  >([]);

  const strategies: YieldStrategy[] = [
    {
      id: "conservative",
      name: "Conservative Yield",
      description:
        "Low-risk strategy focusing on stable yields with minimal volatility",
      apy: 12.5,
      risk: "low",
      minDeposit: 100,
      maxDeposit: 100000,
      lockPeriod: 0,
      autoCompound: true,
      fees: 0.1,
      healthFactor: 2.5,
      liquidationThreshold: 0.8,
    },
    {
      id: "balanced",
      name: "Balanced Growth",
      description: "Moderate risk strategy balancing yield and stability",
      apy: 24.8,
      risk: "medium",
      minDeposit: 500,
      maxDeposit: 500000,
      lockPeriod: 7,
      autoCompound: true,
      fees: 0.3,
      healthFactor: 1.8,
      liquidationThreshold: 0.75,
    },
    {
      id: "aggressive",
      name: "Aggressive Growth",
      description:
        "High-yield strategy with increased risk for maximum returns",
      apy: 45.2,
      risk: "high",
      minDeposit: 1000,
      maxDeposit: 1000000,
      lockPeriod: 30,
      autoCompound: true,
      fees: 0.5,
      healthFactor: 1.2,
      liquidationThreshold: 0.6,
    },
    {
      id: "liquidity-mining",
      name: "Liquidity Mining",
      description:
        "Provide liquidity to earn trading fees and additional rewards",
      apy: 67.8,
      risk: "high",
      minDeposit: 2000,
      maxDeposit: 2000000,
      lockPeriod: 0,
      autoCompound: true,
      fees: 0.2,
      healthFactor: 1.0,
      liquidationThreshold: 0.5,
    },
    {
      id: "lending",
      name: "Lending Protocol",
      description: "Supply assets to lending pools for consistent interest",
      apy: 18.3,
      risk: "low",
      minDeposit: 100,
      maxDeposit: 1000000,
      lockPeriod: 0,
      autoCompound: true,
      fees: 0.05,
      healthFactor: 3.0,
      liquidationThreshold: 0.9,
    },
  ];

  const calculateOptimalPortfolio = () => {
    const selected = strategies.filter((s) =>
      selectedStrategies.includes(s.id)
    );
    if (selected.length === 0) return;

    // Simple optimization algorithm based on risk tolerance and APY
    const totalWeight = selected.reduce((sum, strategy) => {
      const riskWeight =
        strategy.risk === "low" ? 1 : strategy.risk === "medium" ? 0.7 : 0.4;
      const apyWeight = strategy.apy / 100;
      return sum + riskWeight * apyWeight;
    }, 0);

    const portfolio = selected.map((strategy) => {
      const riskWeight =
        strategy.risk === "low" ? 1 : strategy.risk === "medium" ? 0.7 : 0.4;
      const apyWeight = strategy.apy / 100;
      const weight = (riskWeight * apyWeight) / totalWeight;
      const amount = totalDeposit * weight;
      const value = amount;
      const earned = (amount * (strategy.apy / 100)) / 365; // Daily earnings
      const healthFactor = strategy.healthFactor;

      return {
        strategy,
        amount,
        value,
        apy: strategy.apy,
        earned,
        healthFactor,
      };
    });

    setOptimizedPortfolio(portfolio);
  };

  useEffect(() => {
    if (selectedStrategies.length > 0) {
      calculateOptimalPortfolio();
    }
  }, [selectedStrategies, totalDeposit, riskTolerance]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-success border-success";
      case "medium":
        return "text-warning border-warning";
      case "high":
        return "text-destructive border-destructive";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  const totalAPY = optimizedPortfolio.reduce((sum, pos) => {
    const weight = pos.amount / totalDeposit;
    return sum + pos.apy * weight;
  }, 0);

  const totalEarnings = optimizedPortfolio.reduce(
    (sum, pos) => sum + pos.earned,
    0
  );
  const avgHealthFactor =
    optimizedPortfolio.length > 0
      ? optimizedPortfolio.reduce((sum, pos) => sum + pos.healthFactor, 0) /
        optimizedPortfolio.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Yield Optimizer</h2>
          <p className="text-muted-foreground">
            AI-powered portfolio optimization for maximum yield with risk
            management
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Advanced Settings
        </Button>
      </div>

      {/* Risk Tolerance Slider */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Risk Tolerance</h3>
              <p className="text-sm text-muted-foreground">
                Adjust your risk tolerance for portfolio optimization
              </p>
            </div>
            <Badge variant="outline" className="text-bitcoin border-bitcoin">
              {riskTolerance}% Risk
            </Badge>
          </div>
          <Slider
            value={[riskTolerance]}
            onValueChange={(value) => setRiskTolerance(value[0])}
            max={100}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Conservative</span>
            <span>Balanced</span>
            <span>Aggressive</span>
          </div>
        </div>
      </Card>

      {/* Strategy Selection */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Select Yield Strategies</h3>
          <div className="grid gap-4">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedStrategies.includes(strategy.id)
                    ? "border-bitcoin bg-bitcoin/5"
                    : "border-border hover:border-bitcoin/20"
                }`}
                onClick={() => {
                  if (selectedStrategies.includes(strategy.id)) {
                    setSelectedStrategies((prev) =>
                      prev.filter((id) => id !== strategy.id)
                    );
                  } else {
                    setSelectedStrategies((prev) => [...prev, strategy.id]);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{strategy.name}</h4>
                      <Badge
                        variant="outline"
                        className={getRiskColor(strategy.risk)}
                      >
                        {strategy.risk} risk
                      </Badge>
                      {strategy.autoCompound && (
                        <Badge
                          variant="outline"
                          className="text-bitcoin border-bitcoin"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Auto-Compound
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {strategy.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-bitcoin font-medium">
                        {strategy.apy}% APY
                      </span>
                      <span>Min: ${strategy.minDeposit.toLocaleString()}</span>
                      <span>Max: ${strategy.maxDeposit.toLocaleString()}</span>
                      <span>Fees: {strategy.fees}%</span>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-sm">
                      <div className="text-muted-foreground">Health Factor</div>
                      <div className="font-medium">
                        {strategy.healthFactor}x
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="text-muted-foreground">Liquidation</div>
                      <div className="font-medium">
                        {strategy.liquidationThreshold * 100}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Deposit Amount */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Total Deposit Amount</h3>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              value={totalDeposit}
              onChange={(e) => setTotalDeposit(Number(e.target.value))}
              className="text-lg font-medium"
              placeholder="Enter amount"
            />
            <span className="text-muted-foreground">USD</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTotalDeposit(1000)}
            >
              $1K
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTotalDeposit(10000)}
            >
              $10K
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTotalDeposit(100000)}
            >
              $100K
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTotalDeposit(1000000)}
            >
              $1M
            </Button>
          </div>
        </div>
      </Card>

      {/* Optimized Portfolio */}
      {optimizedPortfolio.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Optimized Portfolio</h3>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Expected APY
                  </div>
                  <div className="text-lg font-bold text-bitcoin">
                    {totalAPY.toFixed(2)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Daily Earnings
                  </div>
                  <div className="text-lg font-bold text-success">
                    ${totalEarnings.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Avg Health Factor
                  </div>
                  <div className="text-lg font-bold text-bitcoin">
                    {avgHealthFactor.toFixed(2)}x
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {optimizedPortfolio.map((position, index) => (
                <div key={index} className="p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">
                          {position.strategy.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={getRiskColor(position.strategy.risk)}
                        >
                          {position.strategy.risk} risk
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Allocation:{" "}
                        {((position.amount / totalDeposit) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-medium">
                        ${position.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-bitcoin">
                        {position.apy}% APY
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Health: {position.healthFactor}x
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={(position.amount / totalDeposit) * 100}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>

            {/* Risk Warnings */}
            {avgHealthFactor < 1.5 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>High Risk Warning:</strong> Your portfolio has a low
                  average health factor. Consider reducing risk or increasing
                  collateral to avoid liquidation.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button className="flex-1" variant="bitcoin">
                <Target className="h-4 w-4 mr-2" />
                Deploy Optimized Portfolio
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Advanced Settings */}
      {showAdvanced && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Advanced Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-Rebalancing</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically rebalance portfolio based on performance
                  </div>
                </div>
                <Switch
                  checked={autoRebalance}
                  onCheckedChange={setAutoRebalance}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Liquidation Protection</div>
                  <div className="text-sm text-muted-foreground">
                    Enable automatic position management to prevent liquidation
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Yield Harvesting</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically harvest and compound rewards
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
