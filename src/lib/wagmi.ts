import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

// Rootstock chains
const rootstock = {
  id: 30,
  name: "Rootstock",
  network: "rootstock",
  nativeCurrency: {
    decimals: 18,
    name: "Rootstock Bitcoin",
    symbol: "RBTC",
  },
  rpcUrls: {
    public: { http: ["https://public-node.rsk.co"] },
    default: { http: ["https://public-node.rsk.co"] },
  },
  blockExplorers: {
    default: { name: "RSK Explorer", url: "https://explorer.rsk.co" },
  },
  testnet: false,
} as const;

const rootstockTestnet = {
  id: 31,
  name: "Rootstock Testnet",
  network: "rootstock-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Rootstock Bitcoin Testnet",
    symbol: "tRBTC",
  },
  rpcUrls: {
    public: { http: ["https://public-node.testnet.rsk.co"] },
    default: { http: ["https://public-node.testnet.rsk.co"] },
  },
  blockExplorers: {
    default: {
      name: "RSK Testnet Explorer",
      url: "https://explorer.testnet.rsk.co",
    },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: "Vintara",
<<<<<<< HEAD
  projectId: "YOUR_PROJECT_ID", // Get this from https://cloud.walletconnect.com/
=======
  projectId: "95856d4bd39a6a4f4ec4a9477b796f17", // Get this from https://cloud.walletconnect.com/
>>>>>>> feature1
  chains: [rootstock, rootstockTestnet, mainnet, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
