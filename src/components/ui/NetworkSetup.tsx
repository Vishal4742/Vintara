import { Card } from "./card";
import { AddNetworkButton } from "./AddNetworkButton";
import { Alert, AlertDescription } from "./alert";
import { Info, ExternalLink } from "lucide-react";

export function NetworkSetup() {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          To use Vintara, you need to connect to the Rootstock network. Add the
          Rootstock Testnet to your wallet to get started.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Rootstock Testnet</h3>
              <p className="text-sm text-muted-foreground">
                Test network for development and testing
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>Chain ID: 31</span>
                <span>•</span>
                <span>Symbol: tRBTC</span>
                <span>•</span>
                <a
                  href="https://faucet.rsk.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bitcoin hover:underline flex items-center space-x-1"
                >
                  <span>Get Testnet RBTC</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <AddNetworkButton
              chainId="0x1F"
              chainName="Rootstock Testnet"
              rpcUrl="https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T"
              blockExplorerUrl="https://explorer.testnet.rsk.co"
              nativeCurrency={{
                name: "Rootstock Bitcoin Testnet",
                symbol: "tRBTC",
                decimals: 18,
              }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Rootstock Mainnet</h3>
              <p className="text-sm text-muted-foreground">
                Production network for real transactions
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>Chain ID: 30</span>
                <span>•</span>
                <span>Symbol: RBTC</span>
                <span>•</span>
                <span>Bitcoin Security</span>
              </div>
            </div>
            <AddNetworkButton
              chainId="0x1E"
              chainName="Rootstock"
              rpcUrl="https://public-node.rsk.co"
              blockExplorerUrl="https://explorer.rsk.co"
              nativeCurrency={{
                name: "Rootstock Bitcoin",
                symbol: "RBTC",
                decimals: 18,
              }}
            />
          </div>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Need help? Check out our{" "}
          <a
            href="https://docs.vintara.com/getting-started"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bitcoin hover:underline"
          >
            getting started guide
          </a>
        </p>
      </div>
    </div>
  );
}
