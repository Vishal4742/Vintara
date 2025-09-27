import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";
import { Alert, AlertDescription } from "./alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Separator } from "./separator";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Loader2,
  Check,
  ExternalLink,
  Calculator,
} from "lucide-react";
import { ENSInput, ENSAddressDisplay } from "./ENSInput";
import { PythPriceFeed } from "./PythPriceFeed";
import { useENS } from "@/hooks/useENS";
import { cn } from "@/lib/utils";

interface LendingFormData {
  recipient: string;
  amount: string;
  collateralAmount: string;
  borrowAmount: string;
}

interface MarketData {
  rbtcPrice: number;
  usdtPrice: number;
  borrowRate: number;
  supplyRate: number;
  healthFactor: number;
  maxBorrow: number;
}

export function EnhancedLendingForm() {
  const [formData, setFormData] = useState<LendingFormData>({
    recipient: "",
    amount: "",
    collateralAmount: "",
    borrowAmount: "",
  });

  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("deposit");

  const { resolveNameOrAddress } = useENS();

  // Simulate fetching market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // In a real implementation, this would fetch from the smart contracts
        const mockData: MarketData = {
          rbtcPrice: 45000,
          usdtPrice: 1.0,
          borrowRate: 8.5,
          supplyRate: 6.2,
          healthFactor: 150,
          maxBorrow: 36000, // 80% of 45000
        };
        setMarketData(mockData);
      } catch (err) {
        setError("Failed to fetch market data");
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRecipientChange = (value: string) => {
    setFormData((prev) => ({ ...prev, recipient: value }));
  };

  const handleAddressResolved = (address: string | null) => {
    setResolvedAddress(address);
  };

  const handleInputChange = (field: keyof LendingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateHealthFactor = (collateral: number, borrowed: number) => {
    if (borrowed === 0) return Infinity;
    return (collateral * marketData?.rbtcPrice || 0) / borrowed;
  };

  const calculateMaxBorrow = (collateral: number) => {
    const collateralValue = collateral * (marketData?.rbtcPrice || 0);
    return collateralValue * 0.8; // 80% LTV
  };

  const handleDeposit = async () => {
    if (!resolvedAddress) {
      setError("Please enter a valid recipient address or ENS name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, this would call the smart contract
      console.log("Depositing collateral:", {
        recipient: resolvedAddress,
        amount: formData.collateralAmount,
      });

      // Reset form
      setFormData((prev) => ({ ...prev, collateralAmount: "" }));
    } catch (err) {
      setError("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!resolvedAddress) {
      setError("Please enter a valid recipient address or ENS name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, this would call the smart contract
      console.log("Borrowing:", {
        recipient: resolvedAddress,
        amount: formData.borrowAmount,
      });

      // Reset form
      setFormData((prev) => ({ ...prev, borrowAmount: "" }));
    } catch (err) {
      setError("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  const collateralValue =
    parseFloat(formData.collateralAmount) * (marketData?.rbtcPrice || 0);
  const borrowValue = parseFloat(formData.borrowAmount);
  const healthFactor = calculateHealthFactor(
    parseFloat(formData.collateralAmount),
    borrowValue
  );
  const maxBorrow = calculateMaxBorrow(parseFloat(formData.collateralAmount));

  return (
    <div className="space-y-6">
      {/* Market Data */}
      <PythPriceFeed className="w-full" />

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Enhanced Lending Protocol</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Recipient Input */}
          <div className="space-y-2">
            <ENSInput
              label="Recipient"
              value={formData.recipient}
              onChange={handleRecipientChange}
              onAddressResolved={handleAddressResolved}
              placeholder="Enter ENS name or address (e.g., user.vintara.eth)"
              description="You can use ENS names or regular addresses"
            />

            {resolvedAddress && (
              <div className="mt-2">
                <ENSAddressDisplay
                  address={resolvedAddress}
                  ensName={
                    formData.recipient.includes(".eth")
                      ? formData.recipient
                      : undefined
                  }
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Action Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deposit">Deposit Collateral</TabsTrigger>
              <TabsTrigger value="borrow">Borrow Assets</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collateral-amount">
                  Collateral Amount (rBTC)
                </Label>
                <Input
                  id="collateral-amount"
                  type="number"
                  placeholder="0.0"
                  value={formData.collateralAmount}
                  onChange={(e) =>
                    handleInputChange("collateralAmount", e.target.value)
                  }
                />
                {formData.collateralAmount && (
                  <p className="text-sm text-muted-foreground">
                    ≈ ${collateralValue.toLocaleString()} USD
                  </p>
                )}
              </div>

              {formData.collateralAmount && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Max Borrowable
                        </span>
                        <span className="text-sm font-mono">
                          ${maxBorrow.toLocaleString()} USDT
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Health Factor
                        </span>
                        <Badge
                          variant={
                            healthFactor > 1.5
                              ? "default"
                              : healthFactor > 1.2
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {healthFactor === Infinity
                            ? "∞"
                            : healthFactor.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleDeposit}
                disabled={
                  !resolvedAddress || !formData.collateralAmount || isLoading
                }
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Depositing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Deposit Collateral
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="borrow" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="borrow-amount">Borrow Amount (USDT)</Label>
                <Input
                  id="borrow-amount"
                  type="number"
                  placeholder="0.0"
                  value={formData.borrowAmount}
                  onChange={(e) =>
                    handleInputChange("borrowAmount", e.target.value)
                  }
                />
              </div>

              {marketData && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Borrow Rate</span>
                        <span className="text-sm font-mono">
                          {marketData.borrowRate}% APY
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Supply Rate</span>
                        <span className="text-sm font-mono">
                          {marketData.supplyRate}% APY
                        </span>
                      </div>
                      {formData.borrowAmount && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Daily Interest
                          </span>
                          <span className="text-sm font-mono">
                            $
                            {(
                              (parseFloat(formData.borrowAmount) *
                                marketData.borrowRate) /
                              365 /
                              100
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleBorrow}
                disabled={
                  !resolvedAddress || !formData.borrowAmount || isLoading
                }
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Borrowing...
                  </>
                ) : (
                  <>
                    <TrendingDown className="mr-2 h-4 w-4" />
                    Borrow Assets
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Market Information */}
          {marketData && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Calculator className="h-4 w-4" />
                  <span>Market Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">rBTC Price:</span>
                    <span className="ml-2 font-mono">
                      ${marketData.rbtcPrice.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">USDT Price:</span>
                    <span className="ml-2 font-mono">
                      ${marketData.usdtPrice.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Max LTV:</span>
                    <span className="ml-2 font-mono">80%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Liquidation Threshold:
                    </span>
                    <span className="ml-2 font-mono">120%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
