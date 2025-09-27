import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Settings, Info } from "lucide-react";

export default function Swap() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Swap</h1>
          <p className="text-muted-foreground">Trade tokens instantly</p>
        </div>

        {/* Swap Card */}
        <Card className="p-6 card-gradient border-border/40">
          <div className="space-y-4">
            {/* From Token */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">From</span>
                <span className="text-muted-foreground">Balance: 1.2345 BTC</span>
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
                <Button variant="outline" className="px-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-full bg-bitcoin" />
                    <span>BTC</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-border/40 hover:bg-secondary/50"
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">To</span>
                <span className="text-muted-foreground">Balance: 2,543.67 USDT</span>
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
                <Button variant="outline" className="px-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-full bg-green-500" />
                    <span>USDT</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Swap Details */}
            <div className="space-y-2 p-4 rounded-lg bg-secondary/30">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span>1 BTC = 43,250 USDT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slippage Tolerance</span>
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
            <Button className="w-full" variant="bitcoin" disabled={!fromAmount}>
              {fromAmount ? "Swap" : "Enter amount"}
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-4 border-accent/20 bg-accent/5">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-accent mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-accent mb-1">Trading on Bitcoin Lightning</p>
              <p className="text-muted-foreground">
                Instant, low-cost swaps powered by Lightning Network technology for optimal trading experience.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}