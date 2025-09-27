import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Loader2,
  BarChart3,
} from "lucide-react";
import { GRAPH_CONFIG } from "@/config/contracts";

interface ProtocolStats {
  totalValueLocked: string;
  totalBorrowed: string;
  totalSupplied: string;
  totalFeesEarned: string;
  activeUsers: number;
  lastUpdated: string;
}

interface UserStats {
  totalDeposits: string;
  totalBorrows: string;
  totalFeesPaid: string;
  totalRewardsEarned: string;
  lastActivity: string;
  isActive: boolean;
}

interface PoolStats {
  liquidity: string;
  volume24h: string;
  fees24h: string;
  apr: number;
  lastUpdated: string;
}

const fetchProtocolStats = async (): Promise<ProtocolStats> => {
  // In a real application, this would query The Graph subgraph
  // For now, we'll simulate the data

  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

  return {
    totalValueLocked: "2,450,000",
    totalBorrowed: "1,200,000",
    totalSupplied: "2,450,000",
    totalFeesEarned: "45,000",
    activeUsers: 1247,
    lastUpdated: new Date().toISOString(),
  };
};

const fetchUserStats = async (userAddress: string): Promise<UserStats> => {
  // Simulate user stats from The Graph
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    totalDeposits: "12,500",
    totalBorrows: "8,200",
    totalFeesPaid: "125",
    totalRewardsEarned: "340",
    lastActivity: new Date().toISOString(),
    isActive: true,
  };
};

const fetchPoolStats = async (poolName: string): Promise<PoolStats> => {
  // Simulate pool stats from The Graph
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    liquidity: "850,000",
    volume24h: "125,000",
    fees24h: "375",
    apr: 12.5,
    lastUpdated: new Date().toISOString(),
  };
};

interface GraphAnalyticsProps {
  type: "protocol" | "user" | "pool";
  userAddress?: string;
  poolName?: string;
}

export function GraphAnalytics({
  type,
  userAddress,
  poolName,
}: GraphAnalyticsProps) {
  const { data: protocolStats, isLoading: protocolLoading } = useQuery({
    queryKey: ["graphProtocolStats"],
    queryFn: fetchProtocolStats,
    enabled: type === "protocol",
    refetchInterval: GRAPH_CONFIG.indexing.updateInterval * 1000,
  });

  const { data: userStats, isLoading: userLoading } = useQuery({
    queryKey: ["graphUserStats", userAddress],
    queryFn: () => fetchUserStats(userAddress!),
    enabled: type === "user" && !!userAddress,
    refetchInterval: GRAPH_CONFIG.indexing.updateInterval * 1000,
  });

  const { data: poolStats, isLoading: poolLoading } = useQuery({
    queryKey: ["graphPoolStats", poolName],
    queryFn: () => fetchPoolStats(poolName!),
    enabled: type === "pool" && !!poolName,
    refetchInterval: GRAPH_CONFIG.indexing.updateInterval * 1000,
  });

  const isLoading = protocolLoading || userLoading || poolLoading;

  if (type === "protocol" && protocolStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="card-gradient border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Value Locked
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `$${protocolStats.totalValueLocked}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Borrowed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `$${protocolStats.totalBorrowed}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                protocolStats.activeUsers.toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === "user" && userStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-gradient border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deposits
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `$${userStats.totalDeposits}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Last activity:{" "}
              {new Date(userStats.lastActivity).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Borrows</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `$${userStats.totalBorrows}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">Health factor: 1.45</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (type === "pool" && poolStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="card-gradient border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pool Liquidity
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `$${poolStats.liquidity}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              24h Volume: ${poolStats.volume24h}
            </p>
          </CardContent>
        </Card>

        <Card className="card-gradient border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">APR</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `${poolStats.apr}%`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              24h Fees: ${poolStats.fees24h}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="card-gradient border-border/40">
      <CardContent className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  );
}
