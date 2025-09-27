import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, ExternalLink, Wallet } from "lucide-react";

interface WalletInfoProps {
  showBalance?: boolean;
  showNetwork?: boolean;
  className?: string;
}

export function WalletInfo({ 
  showBalance = true, 
  showNetwork = true, 
  className 
}: WalletInfoProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
  });

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const openExplorer = () => {
    if (address && chain?.blockExplorers?.default) {
      window.open(`${chain.blockExplorers.default.url}/address/${address}`, '_blank');
    }
  };

  if (!isConnected || !address) {
    return null;
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-3">
        {/* Address */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Address:</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 font-mono text-xs"
              onClick={copyAddress}
            >
              {formatAddress(address)}
              {copiedAddress ? (
                <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 ml-1" />
              )}
            </Button>
            {chain?.blockExplorers?.default && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1"
                onClick={openExplorer}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Network */}
        {showNetwork && chain && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Network:</span>
            <Badge variant="outline" className="text-xs">
              {chain.name}
            </Badge>
          </div>
        )}

        {/* Balance */}
        {showBalance && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance:</span>
            {balanceLoading ? (
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            ) : (
              <div className="text-sm font-mono">
                {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '0 RBTC'}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}