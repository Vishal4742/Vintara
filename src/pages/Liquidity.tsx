import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransaction } from "@/components/providers/TransactionProvider";
import {
  TrendingUp,
  Plus,
  Minus,
  DollarSign,
  ArrowUpDown,
  Info,
} from "lucide-react";

export default function Liquidity() {
  const [activeTab, setActiveTab] = useState("add");
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const { addTransaction } = useTransaction();

  const tokens = [
    { symbol: "BTC", name: "Bitcoin", balance: "1.2345", icon: "₿" },
    { symbol: "USDT", name: "Tether USD", balance: "5,000.00", icon: "$" },
    { symbol: "ETH", name: "Ethereum", balance: "2.5", icon: "Ξ" },
    { symbol: "VINT", name: "Vintara Token", balance: "10,000.00", icon: "V" },
  ];

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

  const handleAddLiquidity = async () => {
    const pool = pools.find((p) => p.id === selectedPool);
    if (!pool) return;

    addTransaction({
      type: "liquidity",
      status: "pending",
      amount: `${amountA} + ${amountB}`,
      token: pool.pair,
    });

    // Simulate transaction
    setTimeout(() => {
      addTransaction({
        type: "liquidity",
        status: "success",
        amount: `${amountA} + ${amountB}`,
        token: pool.pair,
        hash: "0x1234567890abcdef1234567890abcdef12345678",
      });
    }, 3000);

    setShowConfirmModal(false);
    setAmountA("");
    setAmountB("");
  };

  const handleRemoveLiquidity = async (poolId: number) => {
    const pool = pools.find((p) => p.id === poolId);
    if (!pool) return;

    addTransaction({
      type: "liquidity",
      status: "pending",
      amount: pool.myLiquidity,
      token: pool.pair,
    });

    // Simulate transaction
    setTimeout(() => {
      addTransaction({
        type: "liquidity",
        status: "success",
        amount: pool.myLiquidity,
        token: pool.pair,
        hash: "0x1234567890abcdef1234567890abcdef12345678",
      });
    }, 3000);
  };

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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add">Add Liquidity</TabsTrigger>
                <TabsTrigger value="remove">Remove</TabsTrigger>
              </TabsList>

              <TabsContent value="add" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Select Pool
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setSelectedPool(parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a liquidity pool" />
                      </SelectTrigger>
                      <SelectContent>
                        {pools.map((pool) => (
                          <SelectItem key={pool.id} value={pool.id.toString()}>
                            {pool.pair} - {pool.apy} APY
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPool && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                          Token A
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="0.0"
                            className="bg-secondary/50"
                            value={amountA}
                            onChange={(e) => setAmountA(e.target.value)}
                          />
                          <Button variant="outline" className="w-20">
                            {
                              pools
                                .find((p) => p.id === selectedPool)
                                ?.pair.split("/")[0]
                            }
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Balance:{" "}
                          {
                            tokens.find(
                              (t) =>
                                t.symbol ===
                                pools
                                  .find((p) => p.id === selectedPool)
                                  ?.pair.split("/")[0]
                            )?.balance
                          }{" "}
                          {
                            pools
                              .find((p) => p.id === selectedPool)
                              ?.pair.split("/")[0]
                          }
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">
                          Token B
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="0.0"
                            className="bg-secondary/50"
                            value={amountB}
                            onChange={(e) => setAmountB(e.target.value)}
                          />
                          <Button variant="outline" className="w-20">
                            {
                              pools
                                .find((p) => p.id === selectedPool)
                                ?.pair.split("/")[1]
                            }
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Balance:{" "}
                          {
                            tokens.find(
                              (t) =>
                                t.symbol ===
                                pools
                                  .find((p) => p.id === selectedPool)
                                  ?.pair.split("/")[1]
                            )?.balance
                          }{" "}
                          {
                            pools
                              .find((p) => p.id === selectedPool)
                              ?.pair.split("/")[1]
                          }
                        </div>
                      </div>

                      <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Pool Share
                          </span>
                          <span>0.043%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Est. LP Tokens
                          </span>
                          <span>124.56</span>
                        </div>
                      </div>

                      <Dialog
                        open={showConfirmModal}
                        onOpenChange={setShowConfirmModal}
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="w-full btn-bitcoin"
                            disabled={!amountA || !amountB}
                          >
                            Add Liquidity
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Confirm Add Liquidity</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Pool
                                </span>
                                <span>
                                  {
                                    pools.find((p) => p.id === selectedPool)
                                      ?.pair
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Token A
                                </span>
                                <span>
                                  {amountA}{" "}
                                  {
                                    pools
                                      .find((p) => p.id === selectedPool)
                                      ?.pair.split("/")[0]
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Token B
                                </span>
                                <span>
                                  {amountB}{" "}
                                  {
                                    pools
                                      .find((p) => p.id === selectedPool)
                                      ?.pair.split("/")[1]
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  APY
                                </span>
                                <span>
                                  {
                                    pools.find((p) => p.id === selectedPool)
                                      ?.apy
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowConfirmModal(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="flex-1 btn-bitcoin"
                                onClick={handleAddLiquidity}
                              >
                                Confirm
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="remove" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Select Position
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a position to remove" />
                      </SelectTrigger>
                      <SelectContent>
                        {pools
                          .filter(
                            (pool) =>
                              parseFloat(
                                pool.myLiquidity
                                  .replace("$", "")
                                  .replace(",", "")
                              ) > 0
                          )
                          .map((pool) => (
                            <SelectItem
                              key={pool.id}
                              value={pool.id.toString()}
                            >
                              {pool.pair} - {pool.myLiquidity}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Remove Amount (%)
                    </label>
                    <Input placeholder="25" className="bg-secondary/50" />
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        25%
                      </Button>
                      <Button variant="outline" size="sm">
                        50%
                      </Button>
                      <Button variant="outline" size="sm">
                        75%
                      </Button>
                      <Button variant="outline" size="sm">
                        Max
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
                    <div className="text-sm text-muted-foreground">
                      You will receive:
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>BTC</span>
                      <span>0.31 BTC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>USDT</span>
                      <span>13,407.5 USDT</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Remove Liquidity
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Confirm Remove Liquidity</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pool</span>
                            <span>BTC/USDT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Remove Amount
                            </span>
                            <span>25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              You will receive
                            </span>
                            <span>0.31 BTC + 13,407.5 USDT</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleRemoveLiquidity(1)}
                          >
                            Confirm Remove
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
              <Button variant="outline" size="sm">
                All Pools
              </Button>
              <Button size="sm" className="bg-bitcoin text-primary-foreground">
                My Pools
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {pools.map((pool) => (
              <Card
                key={pool.id}
                className="p-6 card-gradient border-border/40"
              >
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
                        <div className="text-lg font-bold">
                          {pool.myLiquidity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          My Liquidity
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-bitcoin">
                          {pool.myShare}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Pool Share
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Minus className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        className="bg-bitcoin text-primary-foreground"
                      >
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
