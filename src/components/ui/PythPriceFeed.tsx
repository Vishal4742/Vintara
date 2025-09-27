import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { Alert, AlertDescription } from "./alert";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  DollarSign,
  Bitcoin,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceData {
  price: number;
  confidence: number;
  timestamp: number;
  change24h?: number;
  isValid: boolean;
}

interface PythPriceFeedProps {
  className?: string;
  showRefresh?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function PythPriceFeed({
  className,
  showRefresh = true,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}: PythPriceFeedProps) {
  const [rbtcPrice, setRbtcPrice] = useState<PriceData | null>(null);
  const [usdtPrice, setUsdtPrice] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchPrices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate fetching from PyTH Network via Hermes
      // In a real implementation, this would call the actual PyTH API
      const response = await fetch("/api/pyth/prices");

      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }

      const data = await response.json();

      setRbtcPrice({
        price: data.rbtc.price,
        confidence: data.rbtc.confidence,
        timestamp: data.rbtc.timestamp,
        change24h: data.rbtc.change24h,
        isValid: data.rbtc.isValid,
      });

      setUsdtPrice({
        price: data.usdt.price,
        confidence: data.usdt.confidence,
        timestamp: data.usdt.timestamp,
        change24h: data.usdt.change24h,
        isValid: data.usdt.isValid,
      });

      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();

    if (autoRefresh) {
      const interval = setInterval(fetchPrices, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatConfidence = (confidence: number) => {
    return `${(confidence / 100).toFixed(1)}%`;
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    return change > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getChangeColor = (change?: number) => {
    if (!change) return "text-muted-foreground";
    return change > 0 ? "text-green-500" : "text-red-500";
  };

  const formatChange = (change?: number) => {
    if (!change) return "N/A";
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(2)}%`;
  };

  const getPriceAge = (timestamp: number) => {
    const age = Date.now() - timestamp;
    const minutes = Math.floor(age / 60000);
    const seconds = Math.floor((age % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  };

  const isPriceStale = (timestamp: number) => {
    const age = Date.now() - timestamp;
    return age > 300000; // 5 minutes
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          PyTH Network Price Feeds
        </CardTitle>
        <div className="flex items-center space-x-2">
          {showRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchPrices}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
            </Button>
          )}
          <Badge variant="secondary" className="text-xs">
            Live
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* rBTC Price */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bitcoin className="h-5 w-5 text-orange-500" />
              <span className="font-medium">rBTC</span>
              {rbtcPrice && !rbtcPrice.isValid && (
                <Badge variant="destructive" className="text-xs">
                  Invalid
                </Badge>
              )}
            </div>
            {rbtcPrice && isPriceStale(rbtcPrice.timestamp) && (
              <Badge variant="outline" className="text-xs text-yellow-600">
                Stale
              </Badge>
            )}
          </div>

          {rbtcPrice ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatPrice(rbtcPrice.price)}
                </span>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(rbtcPrice.change24h)}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getChangeColor(rbtcPrice.change24h)
                    )}
                  >
                    {formatChange(rbtcPrice.change24h)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Confidence: {formatConfidence(rbtcPrice.confidence)}
                </span>
                <span>{getPriceAge(rbtcPrice.timestamp)}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                Loading rBTC price...
              </span>
            </div>
          )}
        </div>

        {/* USDT Price */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="font-medium">USDT</span>
              {usdtPrice && !usdtPrice.isValid && (
                <Badge variant="destructive" className="text-xs">
                  Invalid
                </Badge>
              )}
            </div>
            {usdtPrice && isPriceStale(usdtPrice.timestamp) && (
              <Badge variant="outline" className="text-xs text-yellow-600">
                Stale
              </Badge>
            )}
          </div>

          {usdtPrice ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatPrice(usdtPrice.price)}
                </span>
                <div className="flex items-center space-x-1">
                  {getChangeIcon(usdtPrice.change24h)}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getChangeColor(usdtPrice.change24h)
                    )}
                  >
                    {formatChange(usdtPrice.change24h)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Confidence: {formatConfidence(usdtPrice.confidence)}
                </span>
                <span>{getPriceAge(usdtPrice.timestamp)}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                Loading USDT price...
              </span>
            </div>
          )}
        </div>

        {/* Price Ratio */}
        {rbtcPrice && usdtPrice && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">rBTC/USDT Ratio</span>
              <span className="text-sm font-mono">
                {(rbtcPrice.price / usdtPrice.price).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Last Update */}
        {lastUpdate && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last updated</span>
              <span>{lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Price Alert Component
interface PriceAlertProps {
  symbol: string;
  targetPrice: number;
  condition: "above" | "below";
  onTriggered?: () => void;
  className?: string;
}

export function PriceAlert({
  symbol,
  targetPrice,
  condition,
  onTriggered,
  className,
}: PriceAlertProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    // Simulate price monitoring
    const interval = setInterval(() => {
      // In a real implementation, this would fetch the current price
      const mockPrice = 45000 + Math.random() * 10000;
      setCurrentPrice(mockPrice);

      const shouldTrigger =
        condition === "above"
          ? mockPrice > targetPrice
          : mockPrice < targetPrice;

      if (shouldTrigger && !isActive) {
        setIsActive(true);
        onTriggered?.();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [targetPrice, condition, isActive, onTriggered]);

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">{symbol} Price Alert</p>
            <p className="text-xs text-muted-foreground">
              {condition === "above" ? "Above" : "Below"}{" "}
              {targetPrice.toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            {currentPrice && (
              <p className="text-sm font-mono">
                {currentPrice.toLocaleString()}
              </p>
            )}
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {isActive ? "Triggered" : "Active"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
