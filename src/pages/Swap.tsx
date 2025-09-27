import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ArrowDownUp,
  Settings,
  Info,
  ChevronDown,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

export default function Swap() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("BTC");
  const [toToken, setToToken] = useState("USDT");
  const [slippage, setSlippage] = useState("0.5");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { addTransaction } = useTransaction();

  const tokens = [
    { symbol: "BTC", name: "Bitcoin", balance: "1.2345", icon: "₿" },
    { symbol: "USDT", name: "Tether USD", balance: "5,000.00", icon: "$" },
    { symbol: "ETH", name: "Ethereum", balance: "2.5", icon: "Ξ" },
    { symbol: "DAI", name: "Dai Stablecoin", balance: "1,200.00", icon: "◈" },
  ];

  const handleSwap = async () => {
    // Add pending transaction
    addTransaction({
      type: "swap",
      status: "pending",
      amount: fromAmount,
      token: `${fromToken} → ${toToken}`,
    });

    // Simulate transaction
    setTimeout(() => {
      addTransaction({
        type: "swap",
        status: "success",
        amount: fromAmount,
        token: `${fromToken} → ${toToken}`,
        hash: "0x1234567890abcdef1234567890abcdef12345678",
      });
    }, 3000);

    setShowConfirmModal(false);
    setFromAmount("");
    setToAmount("");
  };

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">DEX Aggregator</h1>
          <p className="text-muted-foreground">
            Trade tokens with optimal prices across multiple liquidity sources
          </p>
        </div>

        {/* Swap Card */}
        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-4">
            {/* From Token */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">From</span>
                <span className="text-muted-foreground">
                  Balance: {tokens.find((t) => t.symbol === fromToken)?.balance}{" "}
                  {fromToken}
                </span>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="text-lg font-medium bg-secondary/50"
                  />
                </div>
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className="w-24">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {tokens.find((t) => t.symbol === fromToken)?.icon}
                        </span>
                        <span>{fromToken}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center space-x-2">
                          <span>{token.icon}</span>
                          <span>{token.symbol}</span>
                          <span className="text-muted-foreground">
                            ({token.name})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-border/40 hover:bg-bitcoin/10 hover:border-bitcoin/20"
                onClick={() => {
                  const temp = fromAmount;
                  setFromAmount(toAmount);
                  setToAmount(temp);
                  const tempToken = fromToken;
                  setFromToken(toToken);
                  setToToken(tempToken);
                }}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To</span>
                <span className="text-muted-foreground">
                  Balance: {tokens.find((t) => t.symbol === toToken)?.balance}{" "}
                  {toToken}
                </span>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    className="text-lg font-medium bg-secondary/50"
                    readOnly
                  />
                </div>
                <Select value={toToken} onValueChange={setToToken}>
                  <SelectTrigger className="w-24">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {tokens.find((t) => t.symbol === toToken)?.icon}
                        </span>
                        <span>{toToken}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center space-x-2">
                          <span>{token.icon}</span>
                          <span>{token.symbol}</span>
                          <span className="text-muted-foreground">
                            ({token.name})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Details */}
            <div className="space-y-2 p-4 rounded-lg bg-secondary/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span>1 BTC = 43,250 USDT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Slippage Tolerance
                </span>
                <div className="flex items-center space-x-1">
                  <span>0.5%</span>
                  <Settings className="h-3 w-3" />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee</span>
                <span>0.3%</span>
              </div>
            </div>

            {/* Swap Button */}
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
              <DialogTrigger asChild>
                <Button
                  className="w-full"
                  variant="bitcoin"
                  disabled={!fromAmount}
                >
                  {fromAmount ? "Swap" : "Enter amount"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Confirm Swap</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">From</span>
                      <span>
                        {fromAmount} {fromToken}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">To</span>
                      <span>
                        {toAmount} {toToken}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rate</span>
                      <span>
                        1 {fromToken} ={" "}
                        {(
                          parseFloat(toAmount) / parseFloat(fromAmount)
                        ).toFixed(4)}{" "}
                        {toToken}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slippage</span>
                      <span>{slippage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fee</span>
                      <span>0.3%</span>
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
                      className="flex-1"
                      variant="bitcoin"
                      onClick={handleSwap}
                    >
                      Confirm Swap
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-4 border-accent/20 bg-accent/5">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-accent mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-accent mb-1">
                Trading on Bitcoin Lightning
              </p>
              <p className="text-muted-foreground">
                Instant, low-cost swaps powered by Lightning Network technology
                for optimal trading experience.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
