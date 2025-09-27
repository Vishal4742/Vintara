import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Loader2, AlertTriangle } from "lucide-react";
import { CHAINLINK_CONFIG, DEFAULT_VALUES } from "@/config/contracts";

interface ChainlinkPriceFeedProps {
  asset: "rBTC" | "USDT";
}

const fetchChainlinkPrice = async (asset: string) => {
  // In a real application, this would call your backend API that fetches from Chainlink
  // For now, we'll simulate the data with some realistic fluctuations

  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

  // Simulate price fluctuations
  const basePrice = asset === "rBTC" ? 45000 : 1.0;
  const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
  const price = basePrice * (1 + fluctuation);

  return {
    price: price,
    confidence: 0.99, // Chainlink has high confidence
    timestamp: Date.now(),
    source: "Chainlink",
    feedAddress:
      CHAINLINK_CONFIG.priceFeeds[
        asset.toLowerCase() as keyof typeof CHAINLINK_CONFIG.priceFeeds
      ],
  };
};

const fetchFallbackPrice = async (asset: string) => {
  // Fallback to CoinGecko API
  const coinId = asset === "rBTC" ? "rootstock" : "tether";

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    const data = await response.json();

    return {
      price:
        data[coinId]?.usd ||
        DEFAULT_VALUES.mockPrices[
          asset.toLowerCase() as keyof typeof DEFAULT_VALUES.mockPrices
        ],
      confidence: 0.95,
      timestamp: Date.now(),
      source: "CoinGecko",
      feedAddress: "N/A",
    };
  } catch (error) {
    // Final fallback to mock data
    return {
      price:
        DEFAULT_VALUES.mockPrices[
          asset.toLowerCase() as keyof typeof DEFAULT_VALUES.mockPrices
        ],
      confidence: 0.8,
      timestamp: Date.now(),
      source: "Mock",
      feedAddress: "N/A",
    };
  }
};

export function ChainlinkPriceFeed({ asset }: ChainlinkPriceFeedProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chainlinkPrice", asset],
    queryFn: () => fetchChainlinkPrice(asset),
    refetchInterval: CHAINLINK_CONFIG.updateInterval * 1000, // Convert to milliseconds
    retry: 3,
    retryDelay: 5000,
  });

  const { data: fallbackData } = useQuery({
    queryKey: ["fallbackPrice", asset],
    queryFn: () => fetchFallbackPrice(asset),
    enabled: !!error, // Only fetch fallback if main query fails
    refetchInterval: 60000, // 1 minute
  });

  const displayData = data || fallbackData;

  return (
    <Card className="card-gradient border-border/40">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {asset} Price ({displayData?.source || "Chainlink"})
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : error && !fallbackData ? (
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-500">Error</span>
            </div>
          ) : (
            `$${displayData?.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: asset === "rBTC" ? 2 : 4,
            })}`
          )}
        </div>

        <div className="mt-2 space-y-1">
          <p className="text-xs text-muted-foreground">
            Confidence:{" "}
            {displayData?.confidence
              ? `${(displayData.confidence * 100).toFixed(1)}%`
              : "N/A"}
          </p>

          {displayData?.feedAddress &&
            displayData.feedAddress !==
              "0x0000000000000000000000000000000000000000" && (
              <p className="text-xs text-muted-foreground">
                Feed: {displayData.feedAddress.slice(0, 6)}...
                {displayData.feedAddress.slice(-4)}
              </p>
            )}

          {error && fallbackData && (
            <p className="text-xs text-yellow-600">
              ⚠️ Using fallback price source
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
