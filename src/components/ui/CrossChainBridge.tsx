import { useState, useEffect } from "react";
import { Card } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
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
  ArrowRightLeft,
  Shield,
  Clock,
  DollarSign,
  Zap,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Info,
  Activity,
  Globe,
} from "lucide-react";

interface Chain {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isSupported: boolean;
  bridgeFee: number;
  estimatedTime: string;
}

interface BridgeRoute {
  id: string;
  fromChain: Chain;
  toChain: Chain;
  token: string;
  amount: number;
  estimatedTime: string;
  fee: number;
  slippage: number;
  status: "available" | "unavailable" | "maintenance";
}

interface BridgeTransaction {
  id: string;
  fromChain: string;
  toChain: string;
  token: string;
  amount: string;
  status: "pending" | "completed" | "failed";
  txHash: string;
  timestamp: number;
  estimatedCompletion: number;
}

export function CrossChainBridge() {
  const [fromChain, setFromChain] = useState<string>("rootstock");
  const [toChain, setToChain] = useState<string>("ethereum");
  const [token, setToken] = useState<string>("rBTC");
  const [amount, setAmount] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);

  const supportedChains: Chain[] = [
    {
      id: "rootstock",
      name: "Rootstock",
      symbol: "RSK",
      icon: "₿",
      rpcUrl: "https://public-node.rsk.co",
      blockExplorer: "https://explorer.rsk.co",
      nativeCurrency: {
        name: "Rootstock Bitcoin",
        symbol: "rBTC",
        decimals: 18,
      },
      isSupported: true,
      bridgeFee: 0.1,
      estimatedTime: "5-10 min",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      icon: "Ξ",
      rpcUrl: "https://mainnet.infura.io/v3/",
      blockExplorer: "https://etherscan.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      isSupported: true,
      bridgeFee: 0.15,
      estimatedTime: "10-15 min",
    },
    {
      id: "polygon",
      name: "Polygon",
      symbol: "MATIC",
      icon: "⬟",
      rpcUrl: "https://polygon-rpc.com",
      blockExplorer: "https://polygonscan.com",
      nativeCurrency: {
        name: "Matic",
        symbol: "MATIC",
        decimals: 18,
      },
      isSupported: true,
      bridgeFee: 0.05,
      estimatedTime: "2-5 min",
    },
    {
      id: "arbitrum",
      name: "Arbitrum",
      symbol: "ARB",
      icon: "🔷",
      rpcUrl: "https://arb1.arbitrum.io/rpc",
      blockExplorer: "https://arbiscan.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      isSupported: true,
      bridgeFee: 0.08,
      estimatedTime: "5-8 min",
    },
    {
      id: "optimism",
      name: "Optimism",
      symbol: "OP",
      icon: "🔴",
      rpcUrl: "https://mainnet.optimism.io",
      blockExplorer: "https://optimistic.etherscan.io",
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      isSupported: true,
      bridgeFee: 0.08,
      estimatedTime: "5-8 min",
    },
    {
      id: "bsc",
      name: "BNB Smart Chain",
      symbol: "BSC",
      icon: "🟡",
      rpcUrl: "https://bsc-dataseed.binance.org",
      blockExplorer: "https://bscscan.com",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      isSupported: false,
      bridgeFee: 0.12,
      estimatedTime: "3-5 min",
    },
  ];

  const supportedTokens = [
    {
      symbol: "rBTC",
      name: "Rootstock Bitcoin",
      chains: ["rootstock", "ethereum"],
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      chains: ["rootstock", "ethereum", "polygon", "arbitrum", "optimism"],
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      chains: ["rootstock", "ethereum", "polygon", "arbitrum", "optimism"],
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      chains: ["rootstock", "ethereum", "polygon", "arbitrum", "optimism"],
    },
    {
      symbol: "VINT",
      name: "Vintara Token",
      chains: ["rootstock", "ethereum", "polygon"],
    },
  ];

  const mockTransactions: BridgeTransaction[] = [
    {
      id: "bridge-1",
      fromChain: "rootstock",
      toChain: "ethereum",
      token: "rBTC",
      amount: "0.5",
      status: "completed",
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
      timestamp: Date.now() - 3600000,
      estimatedCompletion: Date.now() - 1800000,
    },
    {
      id: "bridge-2",
      fromChain: "ethereum",
      toChain: "polygon",
      token: "USDT",
      amount: "1000",
      status: "pending",
      txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
      timestamp: Date.now() - 1800000,
      estimatedCompletion: Date.now() + 1800000,
    },
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  const getChainById = (chainId: string) => {
    return supportedChains.find((chain) => chain.id === chainId);
  };

  const getAvailableTokens = () => {
    const fromChainData = getChainById(fromChain);
    const toChainData = getChainById(toChain);

    return supportedTokens.filter(
      (token) =>
        token.chains.includes(fromChain) && token.chains.includes(toChain)
    );
  };

  const calculateBridgeFee = () => {
    const fromChainData = getChainById(fromChain);
    const toChainData = getChainById(toChain);
    const amountNum = parseFloat(amount) || 0;

    return (amountNum * (fromChainData?.bridgeFee || 0.1)) / 100;
  };

  const getEstimatedTime = () => {
    const fromChainData = getChainById(fromChain);
    const toChainData = getChainById(toChain);

    return `${fromChainData?.estimatedTime || "5-10 min"} + ${
      toChainData?.estimatedTime || "5-10 min"
    }`;
  };

  const handleBridge = async () => {
    const newTransaction: BridgeTransaction = {
      id: `bridge-${Date.now()}`,
      fromChain,
      toChain,
      token,
      amount,
      status: "pending",
      txHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      timestamp: Date.now(),
      estimatedCompletion: Date.now() + 600000, // 10 minutes
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setShowConfirmModal(false);
    setAmount("");
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = timestamp - now;
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes > 0) return `${minutes}m remaining`;
    return "Completed";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cross-Chain Bridge</h2>
          <p className="text-muted-foreground">
            Transfer assets between different blockchains securely and
            efficiently
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-bitcoin border-bitcoin">
            <Shield className="h-3 w-3 mr-1" />
            Secure
          </Badge>
          <Badge variant="outline" className="text-success border-success">
            <Zap className="h-3 w-3 mr-1" />
            Fast
          </Badge>
        </div>
      </div>

      {/* Bridge Interface */}
      <Card className="p-6 card-gradient border-border/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Chain */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <Select value={fromChain} onValueChange={setFromChain}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {getChainById(fromChain)?.icon}
                        </span>
                        <span>{getChainById(fromChain)?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {supportedChains
                      .filter((chain) => chain.isSupported)
                      .map((chain) => (
                        <SelectItem key={chain.id} value={chain.id}>
                          <div className="flex items-center space-x-2">
                            <span>{chain.icon}</span>
                            <span>{chain.name}</span>
                            <span className="text-muted-foreground">
                              ({chain.symbol})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Token</label>
                <Select value={token} onValueChange={setToken}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTokens().map((tokenOption) => (
                      <SelectItem
                        key={tokenOption.symbol}
                        value={tokenOption.symbol}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{tokenOption.symbol}</span>
                          <span className="text-muted-foreground">
                            ({tokenOption.name})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
                <div className="text-xs text-muted-foreground">
                  Balance: 2.5 {token}
                </div>
              </div>
            </div>

            {/* To Chain */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Select value={toChain} onValueChange={setToChain}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {getChainById(toChain)?.icon}
                        </span>
                        <span>{getChainById(toChain)?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {supportedChains
                      .filter(
                        (chain) => chain.isSupported && chain.id !== fromChain
                      )
                      .map((chain) => (
                        <SelectItem key={chain.id} value={chain.id}>
                          <div className="flex items-center space-x-2">
                            <span>{chain.icon}</span>
                            <span>{chain.name}</span>
                            <span className="text-muted-foreground">
                              ({chain.symbol})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">You will receive</label>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="text-lg font-medium">
                    {amount || "0.0"} {token}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    on {getChainById(toChain)?.name}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Estimated Time</label>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-bitcoin" />
                    <span className="font-medium">{getEstimatedTime()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bridge Details */}
          <div className="p-4 rounded-lg bg-secondary/30 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bridge Fee</span>
              <span>
                {calculateBridgeFee().toFixed(4)} {token}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span>
                ~0.001 {getChainById(fromChain)?.nativeCurrency.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage</span>
              <span>0.5%</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>Total Cost</span>
              <span>
                {calculateBridgeFee().toFixed(4)} {token} + gas
              </span>
            </div>
          </div>

          {/* Bridge Button */}
          <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
            <DialogTrigger asChild>
              <Button
                className="w-full"
                variant="bitcoin"
                disabled={!amount || parseFloat(amount) <= 0}
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Bridge {token}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Confirm Bridge Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From</span>
                    <span>{getChainById(fromChain)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span>{getChainById(toChain)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span>
                      {amount} {token}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bridge Fee</span>
                    <span>
                      {calculateBridgeFee().toFixed(4)} {token}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated Time
                    </span>
                    <span>{getEstimatedTime()}</span>
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Bridge transactions are irreversible. Please double-check
                    all details before confirming.
                  </AlertDescription>
                </Alert>
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
                    onClick={handleBridge}
                  >
                    Confirm Bridge
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Bridge Transactions */}
      <Card className="p-6 card-gradient border-border/40">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Bridge Transactions</h3>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {tx.amount} {tx.token}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          tx.status === "completed"
                            ? "text-success border-success"
                            : tx.status === "pending"
                            ? "text-warning border-warning"
                            : "text-destructive border-destructive"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getChainById(tx.fromChain)?.name} →{" "}
                      {getChainById(tx.toChain)?.name}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium">
                      {tx.status === "pending"
                        ? formatTime(tx.estimatedCompletion)
                        : "Completed"}
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {tx.status === "pending" && (
                  <div className="mt-3">
                    <Progress value={75} className="h-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Supported Chains */}
      <Card className="p-6 card-gradient border-border/40">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Supported Networks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supportedChains.map((chain) => (
              <div key={chain.id} className="p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{chain.icon}</span>
                  <div className="space-y-1">
                    <div className="font-medium">{chain.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {chain.nativeCurrency.symbol}
                    </div>
                  </div>
                  <div className="ml-auto">
                    {chain.isSupported ? (
                      <Badge
                        variant="outline"
                        className="text-success border-success"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Supported
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground border-muted"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Fee: {chain.bridgeFee}% • Time: {chain.estimatedTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
