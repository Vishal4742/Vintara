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
  chainlinkOracle: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
  graphIndexer: "0x0000000000000000000000000000000000000000", // Will be updated after deployment
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
  ChainlinkOracle: [] as any[],
  GraphIndexer: [] as any[],
} as const;

// Chainlink configuration
export const CHAINLINK_CONFIG = {
  // Chainlink price feed addresses for Rootstock
  priceFeeds: {
    rBTC: "0x0000000000000000000000000000000000000000", // Will be set after deployment
    usdt: "0x0000000000000000000000000000000000000000", // Will be set after deployment
  },
  // Price update interval (in seconds)
  updateInterval: 30,
  // Maximum price age (in seconds)
  maxPriceAge: 3600, // 1 hour
  // Fallback price sources
  fallbackSources: {
    coingecko: "https://api.coingecko.com/api/v3/simple/price",
    coinmarketcap:
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
  },
} as const;

// The Graph Protocol configuration
export const GRAPH_CONFIG = {
  // The Graph subgraph endpoints
  subgraphs: {
    protocol: "https://api.thegraph.com/subgraphs/name/vintara/protocol",
    user: "https://api.thegraph.com/subgraphs/name/vintara/users",
    analytics: "https://api.thegraph.com/subgraphs/name/vintara/analytics",
  },
  // Query configuration
  queryConfig: {
    timeout: 30000, // 30 seconds
    retries: 3,
    cacheTime: 300000, // 5 minutes
  },
  // Indexing configuration
  indexing: {
    enabled: true,
    updateInterval: 60, // 1 minute
    batchSize: 100,
  },
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
  // Chainlink price feeds
  chainlink: {
    prices: "/api/chainlink/prices",
    feeds: "/api/chainlink/feeds",
  },
  // The Graph queries
  graph: {
    protocol: "/api/graph/protocol",
    user: "/api/graph/user",
    analytics: "/api/graph/analytics",
  },
  // Fallback price sources
  prices: {
    coingecko: "/api/prices/coingecko",
    coinmarketcap: "/api/prices/coinmarketcap",
  },
} as const;

// Default values for testing
export const DEFAULT_VALUES = {
  // Test user addresses
  testAddresses: [
    "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "0x8ba1f109551bD432803012645Hac136c4c8b8b8",
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  ],
  // Mock prices (fallback when Chainlink is unavailable)
  mockPrices: {
    rBTC: 45000, // $45,000
    usdt: 1.0, // $1.00
  },
  // Test pool names
  testPools: ["rBTC-USDT", "rBTC-ETH", "USDT-ETH"],
} as const;

// Export types
export type ContractAddresses = typeof CONTRACTS;
export type NetworkConfig = typeof NETWORKS;
export type ProtocolConfig = typeof PROTOCOL_CONFIG;
export type ChainlinkConfig = typeof CHAINLINK_CONFIG;
export type GraphConfig = typeof GRAPH_CONFIG;
