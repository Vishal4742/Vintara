import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Users, DollarSign } from "lucide-react";

export default function Yield() {
  const pools = [
    {
      id: 1,
      name: "BTC-USDT LP",
      apy: "45.2%",
      tvl: "$12.4M",
      rewards: ["VINT", "BTC"],
      deposited: "$5,420.00",
      earned: "$892.34",
      status: "active",
    },
    {
      id: 2,
      name: "VINT Staking",
      apy: "67.8%",
      tvl: "$8.7M",
      rewards: ["VINT"],
      deposited: "$3,200.00",
      earned: "$567.12",
      status: "active",
    },
    {
      id: 3,
      name: "BTC Single Asset",
      apy: "28.5%",
      tvl: "$24.1M",
      rewards: ["VINT"],
      deposited: "$0.00",
      earned: "$0.00",
      status: "available",
    },
    {
      id: 4,
      name: "Lightning Pool",
      apy: "89.3%",
      tvl: "$2.1M",
      rewards: ["VINT", "LN"],
      deposited: "$0.00",
      earned: "$0.00",
      status: "coming-soon",
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Yield Farming</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stake your tokens and LP positions to earn rewards from our high-yield farming pools.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <TrendingUp className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">$47.2M</div>
            <div className="text-sm text-muted-foreground">Total Value Locked</div>
          </div>
        </Card>
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <DollarSign className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">$8,620</div>
            <div className="text-sm text-muted-foreground">Your Deposits</div>
          </div>
        </Card>
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <Clock className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">$1,459</div>
            <div className="text-sm text-muted-foreground">Pending Rewards</div>
          </div>
        </Card>
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <Users className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">47.5%</div>
            <div className="text-sm text-muted-foreground">Avg APY</div>
          </div>
        </Card>
      </div>

      {/* Pool List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Farming Pools</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">All Pools</Button>
            <Button variant="outline" size="sm">My Pools</Button>
            <Button size="sm" className="bg-bitcoin text-primary-foreground">Active</Button>
          </div>
        </div>

        <div className="grid gap-6">
          {pools.map((pool) => (
            <Card key={pool.id} className="p-6 card-gradient border-border/40">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{pool.name}</h3>
                    <Badge 
                      variant={
                        pool.status === 'active' ? 'default' :
                        pool.status === 'coming-soon' ? 'secondary' : 'outline'
                      }
                      className={pool.status === 'active' ? 'bg-success text-white' : ''}
                    >
                      {pool.status === 'active' ? 'Active' :
                       pool.status === 'coming-soon' ? 'Coming Soon' : 'Available'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>TVL: {pool.tvl}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <span>Rewards:</span>
                      {pool.rewards.map((reward, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {reward}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
                  <div className="grid grid-cols-3 gap-4 lg:gap-8">
                    <div className="text-center">
                      <div className="text-lg font-bold text-bitcoin">{pool.apy}</div>
                      <div className="text-xs text-muted-foreground">APY</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{pool.deposited}</div>
                      <div className="text-xs text-muted-foreground">Deposited</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">{pool.earned}</div>
                      <div className="text-xs text-muted-foreground">Earned</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {pool.status === 'active' ? (
                      <>
                        <Button variant="outline" size="sm">Withdraw</Button>
                        <Button size="sm" className="bg-bitcoin text-primary-foreground">
                          Harvest
                        </Button>
                      </>
                    ) : pool.status === 'available' ? (
                      <Button size="sm" className="bg-bitcoin text-primary-foreground">
                        Deposit
                      </Button>
                    ) : (
                      <Button size="sm" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Claim All Rewards */}
      <Card className="p-6 card-elevated border-bitcoin/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold">Total Pending Rewards</h3>
            <p className="text-2xl font-bold text-bitcoin">$1,459.46</p>
            <p className="text-sm text-muted-foreground">
              Claim all your farming rewards in one transaction
            </p>
          </div>
          <Button className="btn-bitcoin md:w-auto">
            Claim All Rewards
          </Button>
        </div>
      </Card>
    </div>
  );
}