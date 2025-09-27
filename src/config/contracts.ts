// Contract addresses for Vintara DeFi Protocol
// These will be updated after deployment to Rootstock testnet

export const CONTRACTS = {
  // Mock tokens for testing
  rBTC: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
  usdt: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
  vint: "0x0000000000000000000000000000000000000000", // Will be updated after deployment

  // Core protocol contracts
  mockToken: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
  yieldVault: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
  lendingProtocol: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
  liquidityPool: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
  yieldFarming: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
  priceOracle: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
  governance: "0x0000000000000000000000000000000000000000", // Will be updated after deployment

  // New integrations
  pythOracle: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
  ensResolver: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
} as const;

// Network configuration
export const NETWORKS = {
  rootstockTestnet: {
    chainId: 31,
    name: "Rootstock Testnet",
    rpcUrl: "https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T",
    explorerUrl: "https://explorer.testnet.rsk.co",
    faucetUrl: "https://faucet.rsk.co",
    currency: {
      name: "Test RBTC",
      symbol: "tRBTC",
      decimals: 18,
    },
  },
  rootstockMainnet: {
    chainId: 30,
    name: "Rootstock Mainnet",
    rpcUrl: "https://public-node.rsk.co",
    explorerUrl: "https://explorer.rsk.co",
    currency: {
      name: "RBTC",
      symbol: "RBTC",
      decimals: 18,
    },
  },
} as const;

// Contract ABIs (these will be imported from artifacts after compilation)
export const CONTRACT_ABIS = {
  // These will be populated from the compiled artifacts
  MockToken: [] as any[],
  YieldVault: [] as any[],
  LendingProtocol: [] as any[],
  LiquidityPool: [] as any[],
  YieldFarming: [] as any[],
  PriceOracle: [] as any[],
  Governance: [] as any[],
  PythOracle: [] as any[],
  ENSResolver: [] as any[],
} as const;

// PyTH Network configuration
export const PYTH_CONFIG = {
  // PyTH price feed IDs
  priceIds: {
    rBTC: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
    usdt: "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
  },
  // Hermes endpoint
  hermesEndpoint: "https://hermes.pyth.network/v2/updates/price/latest",
  // Price update interval (in seconds)
  updateInterval: 30,
  // Maximum price age (in seconds)
  maxPriceAge: 300, // 5 minutes
} as const;

// ENS configuration
export const ENS_CONFIG = {
  // ENS registry addresses
  registry: {
    mainnet: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    testnet: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", // Same as mainnet
  },
  // Supported TLDs
  supportedTlds: [".eth", ".vintara.eth"],
  // Default resolver
  defaultResolver: "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41",
} as const;

// Protocol configuration
export const PROTOCOL_CONFIG = {
  // Yield vault configuration
  yieldVault: {
    defaultYieldRate: 1000, // 10% APY in basis points
    minDeposit: "1000000000000000000", // 1 RBTC in wei
    maxDeposit: "1000000000000000000000", // 1000 RBTC in wei
  },
  // Lending protocol configuration
  lendingProtocol: {
    maxLtv: 8000, // 80% in basis points
    liquidationThreshold: 12000, // 120% in basis points
    liquidationBonus: 1000, // 10% in basis points
    defaultBorrowRate: 800, // 8% APY in basis points
    defaultSupplyRate: 600, // 6% APY in basis points
  },
  // Liquidity pool configuration
  liquidityPool: {
    defaultFee: 300, // 0.3% in basis points
    minLiquidity: "1000000000000000000", // 1 token in wei
  },
  // Yield farming configuration
  yieldFarming: {
    defaultRewardRate: "1000000000000000000", // 1 token per block
    defaultBlockDuration: 100, // 100 blocks
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  // ENS resolution
  ens: {
    resolve: "/api/ens/resolve",
    reverse: "/api/ens/reverse",
    validate: "/api/ens/validate",
  },
  // PyTH price feeds
  pyth: {
    prices: "/api/pyth/prices",
  },
  // Protocol analytics
  analytics: {
    protocol: "/api/analytics/protocol",
    user: "/api/analytics/user",
  },
} as const;

// Default values for testing
export const DEFAULT_VALUES = {
  // Test ENS names
  testEnsNames: [
    "alice.vintara.eth",
    "bob.vintara.eth",
    "charlie.vintara.eth",
    "diana.vintara.eth",
  ],
  // Test addresses
  testAddresses: [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "0x8ba1f109551bD432803012645Hac136c4c8b8b8",
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  ],
  // Mock prices
  mockPrices: {
    rBTC: 45000, // $45,000
    usdt: 1.0, // $1.00
  },
} as const;

// Export types
export type ContractAddresses = typeof CONTRACTS;
export type NetworkConfig = typeof NETWORKS;
export type ProtocolConfig = typeof PROTOCOL_CONFIG;
export type PythConfig = typeof PYTH_CONFIG;
export type EnsConfig = typeof ENS_CONFIG;
