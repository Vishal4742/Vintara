import { Button } from "./button";
<<<<<<< HEAD
import { ExternalLink, Plus } from "lucide-react";
=======
import { Plus } from "lucide-react";
>>>>>>> feature1

interface AddNetworkButtonProps {
  chainId: string;
  chainName: string;
  rpcUrl: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export function AddNetworkButton({
  chainId,
  chainName,
  rpcUrl,
  blockExplorerUrl,
  nativeCurrency,
}: AddNetworkButtonProps) {
  const addNetwork = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId,
              chainName,
              rpcUrls: [rpcUrl],
              blockExplorerUrls: [blockExplorerUrl],
              nativeCurrency,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to add network:", error);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
    }
  };

  return (
    <Button
      onClick={addNetwork}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      <Plus className="h-4 w-4" />
      <span>Add {chainName}</span>
    </Button>
  );
}

// Declare window.ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}
