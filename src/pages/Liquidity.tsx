import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { TrendingUp, Plus, Minus, DollarSign } from "lucide-react";

export default function Liquidity() {
  const pools = [
    {
      id: 1,
      pair: "BTC/USDT",
      tvl: "$12.4M",
      volume24h: "$2.1M",
      apy: "23.5%",
      myLiquidity: "$5,420.00",
      myShare: "0.043%",
    },
    {
      id: 2,
      pair: "VINT/BTC",
      tvl: "$8.7M",
      volume24h: "$890K",
      apy: "45.2%",
      myLiquidity: "$3,200.00",
      myShare: "0.037%",
    },
    {
      id: 3,
      pair: "ETH/BTC",
      tvl: "$24.1M",
      volume24h: "$4.2M",
      apy: "18.7%",
      myLiquidity: "$0.00",
      myShare: "0%",
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Liquidity</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Provide liquidity to earn trading fees and liquidity mining rewards.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <TrendingUp className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">$45.2M</div>
            <div className="text-sm text-muted-foreground">Total Liquidity</div>
          </div>
        </Card>
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <DollarSign className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">$8,620</div>
            <div className="text-sm text-muted-foreground">My Liquidity</div>
          </div>
        </Card>
        <Card className="p-6 card-gradient border-border/40 text-center">
          <div className="space-y-2">
            <Plus className="h-8 w-8 text-bitcoin mx-auto" />
            <div className="text-2xl font-bold">$567</div>
            <div className="text-sm text-muted-foreground">Fees Earned</div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add/Remove Liquidity */}
        <div className="lg:col-span-1">
          <Card className="p-6 card-gradient border-border/40">
            <Tabs defaultValue="add" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add">Add Liquidity</TabsTrigger>
                <TabsTrigger value="remove">Remove</TabsTrigger>
              </TabsList>
              
              <TabsContent value="add" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Token A</label>
                    <div className="flex space-x-2">
                      <Input placeholder="0.0" className="bg-secondary/50" />
                      <Button variant="outline">BTC</Button>
                    </div>
                    <div className="text-xs text-muted-foreground">Balance: 1.2345 BTC</div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Token B</label>
                    <div className="flex space-x-2">
                      <Input placeholder="0.0" className="bg-secondary/50" />
                      <Button variant="outline">USDT</Button>
                    </div>
                    <div className="text-xs text-muted-foreground">Balance: 2,543.67 USDT</div>
                  </div>
                  
                  <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pool Share</span>
                      <span>0.043%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Est. LP Tokens</span>
                      <span>124.56</span>
                    </div>
                  </div>
                  
                  <Button className="w-full btn-bitcoin">Add Liquidity</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="remove" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Remove Amount (%)</label>
                    <Input placeholder="25" className="bg-secondary/50" />
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">25%</Button>
                      <Button variant="outline" size="sm">50%</Button>
                      <Button variant="outline" size="sm">75%</Button>
                      <Button variant="outline" size="sm">Max</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
                    <div className="text-sm text-muted-foreground">You will receive:</div>
                    <div className="flex justify-between text-sm">
                      <span>BTC</span>
                      <span>0.31 BTC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>USDT</span>
                      <span>13,407.5 USDT</span>
                    </div>
                  </div>
                  
                  <Button variant="destructive" className="w-full">Remove Liquidity</Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Pool List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Liquidity Pools</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">All Pools</Button>
              <Button size="sm" className="bg-bitcoin text-primary-foreground">My Pools</Button>
            </div>
          </div>

          <div className="space-y-4">
            {pools.map((pool) => (
              <Card key={pool.id} className="p-6 card-gradient border-border/40">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{pool.pair}</h3>
                      <Badge variant="outline" className="text-xs">
                        APY: {pool.apy}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>TVL: {pool.tvl}</span>
                      <span>•</span>
                      <span>24h Volume: {pool.volume24h}</span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
                    <div className="grid grid-cols-2 gap-4 lg:gap-8">
                      <div className="text-center">
                        <div className="text-lg font-bold">{pool.myLiquidity}</div>
                        <div className="text-xs text-muted-foreground">My Liquidity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-bitcoin">{pool.myShare}</div>
                        <div className="text-xs text-muted-foreground">Pool Share</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Minus className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                      <Button size="sm" className="bg-bitcoin text-primary-foreground">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}