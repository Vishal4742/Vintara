import { useState, useEffect } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { Switch } from "./switch";
import { Slider } from "./slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Alert, AlertDescription } from "./alert";
import { Progress } from "./progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Target,
  Zap,
  DollarSign,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  BarChart3,
  PieChart,
} from "lucide-react";

interface Position {
  id: string;
  type: "lending" | "borrowing" | "liquidity" | "yield";
  asset: string;
  amount: number;
  value: number;
  collateralValue?: number;
  borrowedValue?: number;
  healthFactor: number;
  liquidationThreshold: number;
  maxLTV: number;
  currentLTV: number;
  risk: "low" | "medium" | "high" | "critical";
}

interface RiskMetrics {
  totalHealthFactor: number;
  totalCollateral: number;
  totalBorrowed: number;
  totalLTV: number;
  liquidationRisk: number;
  portfolioRisk: "low" | "medium" | "high" | "critical";
}

interface RiskAlert {
  id: string;
  type: "liquidation" | "high_ltv" | "low_health" | "market_volatility";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  positionId: string;
  timestamp: number;
  resolved: boolean;
}

export function RiskManager() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [autoProtection, setAutoProtection] = useState(true);
  const [showLiquidationModal, setShowLiquidationModal] = useState(false);

  // Mock data for positions
  const mockPositions: Position[] = [
    {
      id: "pos1",
      type: "lending",
      asset: "rBTC",
      amount: 2.5,
      value: 107500,
      healthFactor: 2.8,
      liquidationThreshold: 0.8,
      maxLTV: 0.75,
      currentLTV: 0.45,
      risk: "low",
    },
    {
      id: "pos2",
      type: "borrowing",
      asset: "USDT",
      amount: 25000,
      value: 25000,
      collateralValue: 107500,
      borrowedValue: 25000,
      healthFactor: 1.6,
      liquidationThreshold: 0.8,
      maxLTV: 0.75,
      currentLTV: 0.23,
      risk: "medium",
    },
    {
      id: "pos3",
      type: "liquidity",
      asset: "rBTC-USDT",
      amount: 50000,
      value: 50000,
      healthFactor: 1.2,
      liquidationThreshold: 0.6,
      maxLTV: 0.5,
      currentLTV: 0.4,
      risk: "high",
    },
    {
      id: "pos4",
      type: "yield",
      asset: "VINT",
      amount: 10000,
      value: 40000,
      healthFactor: 0.9,
      liquidationThreshold: 0.5,
      maxLTV: 0.3,
      currentLTV: 0.25,
      risk: "critical",
    },
  ];

  const mockAlerts: RiskAlert[] = [
    {
      id: "alert1",
      type: "low_health",
      severity: "high",
      message:
        "Position #4 has critically low health factor (0.9x). Consider adding collateral or reducing debt.",
      positionId: "pos4",
      timestamp: Date.now() - 3600000, // 1 hour ago
      resolved: false,
    },
    {
      id: "alert2",
      type: "high_ltv",
      severity: "medium",
      message:
        "Position #3 has high LTV ratio (80%). Monitor closely for potential liquidation risk.",
      positionId: "pos3",
      timestamp: Date.now() - 7200000, // 2 hours ago
      resolved: false,
    },
    {
      id: "alert3",
      type: "market_volatility",
      severity: "low",
      message:
        "High market volatility detected. Consider reducing risk exposure.",
      positionId: "pos2",
      timestamp: Date.now() - 10800000, // 3 hours ago
      resolved: true,
    },
  ];

  useEffect(() => {
    setPositions(mockPositions);
    setAlerts(mockAlerts);

    // Calculate risk metrics
    const totalCollateral = mockPositions.reduce(
      (sum, pos) => sum + (pos.collateralValue || pos.value),
      0
    );
    const totalBorrowed = mockPositions.reduce(
      (sum, pos) => sum + (pos.borrowedValue || 0),
      0
    );
    const totalLTV = totalBorrowed / totalCollateral;
    const totalHealthFactor = totalCollateral / (totalBorrowed * 1.1); // Assuming 10% buffer

    let portfolioRisk: "low" | "medium" | "high" | "critical" = "low";
    if (totalHealthFactor < 1.1) portfolioRisk = "critical";
    else if (totalHealthFactor < 1.3) portfolioRisk = "high";
    else if (totalHealthFactor < 1.8) portfolioRisk = "medium";

    const liquidationRisk =
      totalHealthFactor < 1.2 ? 85 : totalHealthFactor < 1.5 ? 45 : 15;

    setRiskMetrics({
      totalHealthFactor,
      totalCollateral,
      totalBorrowed,
      totalLTV,
      liquidationRisk,
      portfolioRisk,
    });
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-success border-success bg-success/10";
      case "medium":
        return "text-warning border-warning bg-warning/10";
      case "high":
        return "text-destructive border-destructive bg-destructive/10";
      case "critical":
        return "text-red-600 border-red-600 bg-red-600/10";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-blue-600 border-blue-600 bg-blue-600/10";
      case "medium":
        return "text-warning border-warning bg-warning/10";
      case "high":
        return "text-destructive border-destructive bg-destructive/10";
      case "critical":
        return "text-red-600 border-red-600 bg-red-600/10";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "liquidation":
        return <AlertTriangle className="h-4 w-4" />;
      case "high_ltv":
        return <TrendingUp className="h-4 w-4" />;
      case "low_health":
        return <TrendingDown className="h-4 w-4" />;
      case "market_volatility":
        return <Activity className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const handleLiquidationProtection = (positionId: string) => {
    // Simulate liquidation protection action
    setPositions((prev) =>
      prev.map((pos) =>
        pos.id === positionId
          ? { ...pos, healthFactor: Math.max(pos.healthFactor, 1.5) }
          : pos
      )
    );
  };

  const handleAddCollateral = (positionId: string) => {
    // Simulate adding collateral
    setPositions((prev) =>
      prev.map((pos) =>
        pos.id === positionId
          ? {
              ...pos,
              amount: pos.amount * 1.1,
              value: pos.value * 1.1,
              healthFactor: pos.healthFactor * 1.1,
            }
          : pos
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Risk Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage your portfolio risk with advanced protection
            tools
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoProtection}
              onCheckedChange={setAutoProtection}
            />
            <span className="text-sm">Auto Protection</span>
          </div>
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Emergency Actions
          </Button>
        </div>
      </div>

      {/* Risk Overview */}
      {riskMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-bitcoin" />
                <span className="text-sm text-muted-foreground">
                  Portfolio Health
                </span>
              </div>
              <div
                className={`text-2xl font-bold ${
                  getRiskColor(riskMetrics.portfolioRisk).split(" ")[0]
                }`}
              >
                {riskMetrics.totalHealthFactor.toFixed(2)}x
              </div>
              <Badge
                variant="outline"
                className={getRiskColor(riskMetrics.portfolioRisk)}
              >
                {riskMetrics.portfolioRisk} risk
              </Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-bitcoin" />
                <span className="text-sm text-muted-foreground">
                  Total Collateral
                </span>
              </div>
              <div className="text-2xl font-bold">
                ${riskMetrics.totalCollateral.toLocaleString()}
              </div>
              <div className="text-xs text-success">+2.3% this week</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-bitcoin" />
                <span className="text-sm text-muted-foreground">
                  Total Borrowed
                </span>
              </div>
              <div className="text-2xl font-bold">
                ${riskMetrics.totalBorrowed.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                LTV: {(riskMetrics.totalLTV * 100).toFixed(1)}%
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-bitcoin" />
                <span className="text-sm text-muted-foreground">
                  Liquidation Risk
                </span>
              </div>
              <div className="text-2xl font-bold">
                {riskMetrics.liquidationRisk}%
              </div>
              <Progress value={riskMetrics.liquidationRisk} className="h-1" />
            </div>
          </Card>
        </div>
      )}

      {/* Risk Alerts */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Risk Alerts</h3>
            <Badge
              variant="outline"
              className="text-destructive border-destructive"
            >
              {alerts.filter((alert) => !alert.resolved).length} Active
            </Badge>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.resolved ? "opacity-60" : ""
                } ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{alert.message}</span>
                        <Badge
                          variant="outline"
                          className={getSeverityColor(alert.severity)}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Position #{alert.positionId} •{" "}
                        {formatTime(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!alert.resolved && (
                      <>
                        <Button variant="outline" size="sm">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Add Collateral
                        </Button>
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4 mr-1" />
                          Protect
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      {alert.resolved ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Position Risk Analysis */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Position Risk Analysis</h3>
          <div className="space-y-4">
            {positions.map((position) => (
              <div key={position.id} className="p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">
                        {position.type === "lending" && "Lending Position"}
                        {position.type === "borrowing" && "Borrowing Position"}
                        {position.type === "liquidity" && "Liquidity Position"}
                        {position.type === "yield" && "Yield Position"}
                      </h4>
                      <Badge
                        variant="outline"
                        className={getRiskColor(position.risk)}
                      >
                        {position.risk} risk
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {position.asset} • ${position.value.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="text-sm">
                      <div className="text-muted-foreground">Health Factor</div>
                      <div
                        className={`font-medium ${
                          position.healthFactor < 1.2
                            ? "text-destructive"
                            : position.healthFactor < 1.5
                            ? "text-warning"
                            : "text-success"
                        }`}
                      >
                        {position.healthFactor.toFixed(2)}x
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="text-muted-foreground">LTV</div>
                      <div className="font-medium">
                        {(position.currentLTV * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Health Factor</span>
                    <span>{position.healthFactor.toFixed(2)}x / 2.0x</span>
                  </div>
                  <Progress
                    value={(position.healthFactor / 2.0) * 100}
                    className="h-2"
                  />

                  <div className="flex justify-between text-sm">
                    <span>LTV Ratio</span>
                    <span>
                      {(position.currentLTV * 100).toFixed(1)}% /{" "}
                      {(position.maxLTV * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={(position.currentLTV / position.maxLTV) * 100}
                    className="h-2"
                  />
                </div>

                {position.risk === "high" || position.risk === "critical" ? (
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCollateral(position.id)}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Add Collateral
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLiquidationProtection(position.id)}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Enable Protection
                    </Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Risk Management Tools */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Risk Management Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Liquidation Protection</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically add collateral or reduce debt when health factor
                  drops below threshold.
                </p>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <span className="text-sm">Enable Auto Protection</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Health Factor Threshold</h4>
                <Slider
                  defaultValue={[1.3]}
                  max={2.0}
                  min={1.1}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">
                  Trigger protection at: 1.3x health factor
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Portfolio Rebalancing</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically rebalance positions to maintain optimal risk
                  levels.
                </p>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <span className="text-sm">Enable Auto Rebalancing</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Risk Tolerance</h4>
                <Slider
                  defaultValue={[60]}
                  max={100}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">
                  Risk tolerance: 60% (Moderate)
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
