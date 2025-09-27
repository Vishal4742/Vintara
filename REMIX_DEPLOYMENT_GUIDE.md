# 🚀 Remix IDE Deployment Guide for Vintara DeFi Protocol

## 📋 Prerequisites

1. **MetaMask**: Install and set up with RSK Testnet
2. **Testnet RBTC**: Get from [RSK Faucet](https://faucet.rsk.co)
3. **Remix IDE**: Access at https://remix.ethereum.org

## 🔧 Setup Steps

### 1. Add RSK Testnet to MetaMask

- **Network Name**: Rootstock Testnet
- **RPC URL**: `https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T`
- **Chain ID**: `31`
- **Currency Symbol**: `tRBTC`
- **Block Explorer**: `https://explorer.testnet.rsk.co`

### 2. Get Testnet RBTC

1. Visit: https://faucet.rsk.co
2. Enter your wallet address
3. Get free testnet RBTC (you'll need ~0.5 RBTC for deployment)

### 3. Open Remix IDE

1. Go to: https://remix.ethereum.org
2. Create new workspace: "Vintara DeFi"
3. Delete default files

## 📁 Upload Contracts

Upload these contract files to Remix (in this order):

### Core Contracts

1. **MockToken.sol** - ERC20 token for testing
2. **PythOracle.sol** - PyTH Network price feeds
3. **ENSResolver.sol** - ENS name resolution
4. **PriceOracle.sol** - Price feed oracle
5. **YieldVault.sol** - Yield generation vault
6. **LendingProtocol.sol** - Lending protocol
7. **LiquidityPool.sol** - Liquidity provision
8. **YieldFarming.sol** - Yield farming rewards
9. **Governance.sol** - Protocol governance

## 🔨 Compilation

1. **Select Solidity Version**: 0.8.19
2. **Enable Optimization**: 200 runs
3. **Compile All Contracts**: Click "Compile contracts"
4. **Check for Errors**: Fix any compilation errors

## 🚀 Deployment Order

Deploy contracts in this specific order due to dependencies:

### 1. MockToken

```solidity
// Constructor parameters: None
// Deploy and copy address
```

### 2. PythOracle

```solidity
// Constructor parameters:
// _pythContractAddress: 0x0000000000000000000000000000000000000000 (placeholder)
// Deploy and copy address
```

### 3. ENSResolver

```solidity
// Constructor parameters:
// _ensRegistry: 0x0000000000000000000000000000000000000000 (placeholder)
// Deploy and copy address
```

### 4. PriceOracle

```solidity
// Constructor parameters: None
// Deploy and copy address
```

### 5. YieldVault

```solidity
// Constructor parameters:
// _rBTC: [MockToken address from step 1]
// _pythOracle: [PythOracle address from step 2]
// Deploy and copy address
```

### 6. LendingProtocol

```solidity
// Constructor parameters:
// _rBTC: [MockToken address from step 1]
// _borrowToken: [MockToken address from step 1] (using same for simplicity)
// _pythOracle: [PythOracle address from step 2]
// _ensResolver: [ENSResolver address from step 3]
// Deploy and copy address
```

### 7. LiquidityPool

```solidity
// Constructor parameters:
// _tokenA: [MockToken address from step 1]
// _tokenB: [MockToken address from step 1] (using same for simplicity)
// Deploy and copy address
```

### 8. YieldFarming

```solidity
// Constructor parameters:
// _rewardToken: [MockToken address from step 1]
// _liquidityPool: [LiquidityPool address from step 7]
// Deploy and copy address
```

### 9. Governance

```solidity
// Constructor parameters:
// _token: [MockToken address from step 1]
// Deploy and copy address
```

## 📝 Record Contract Addresses

Create a file to record all deployed addresses:

```typescript
// Deployed Contract Addresses
export const DEPLOYED_CONTRACTS = {
  mockToken: "0x...", // From step 1
  pythOracle: "0x...", // From step 2
  ensResolver: "0x...", // From step 3
  priceOracle: "0x...", // From step 4
  yieldVault: "0x...", // From step 5
  lendingProtocol: "0x...", // From step 6
  liquidityPool: "0x...", // From step 7
  yieldFarming: "0x...", // From step 8
  governance: "0x...", // From step 9
};
```

## 🔧 Post-Deployment Setup

### 1. Update Frontend Configuration

Update `src/config/contracts.ts` with deployed addresses:

```typescript
export const CONTRACTS = {
  mockToken: "0x...", // Your deployed address
  pythOracle: "0x...", // Your deployed address
  ensResolver: "0x...", // Your deployed address
  priceOracle: "0x...", // Your deployed address
  yieldVault: "0x...", // Your deployed address
  lendingProtocol: "0x...", // Your deployed address
  liquidityPool: "0x...", // Your deployed address
  yieldFarming: "0x...", // Your deployed address
  governance: "0x...", // Your deployed address
};
```

### 2. Initialize Contracts

After deployment, you need to initialize some contracts:

#### PythOracle Setup

```solidity
// Call updatePrice function with initial prices
// rBTC: $45,000 (4500000000000 in 8 decimals)
// USDT: $1.00 (100000000 in 8 decimals)
```

#### ENSResolver Setup

```solidity
// Register test ENS names
// alice.vintara.eth -> your wallet address
// bob.vintara.eth -> your wallet address
```

#### YieldVault Setup

```solidity
// Set initial yield rate
// Call updateDynamicYieldRate(1000) // 10% APY
```

#### LendingProtocol Setup

```solidity
// Set initial interest rates
// Call updateDynamicInterestRates(800, 600) // 8% borrow, 6% supply
```

## 🧪 Testing Deployment

### 1. Basic Contract Tests

```solidity
// Test MockToken
await mockToken.totalSupply();
await mockToken.balanceOf(yourAddress);

// Test YieldVault
await yieldVault.totalAssets();
await yieldVault.yieldRate();

// Test LendingProtocol
await lendingProtocol.totalCollateral();
await lendingProtocol.totalBorrowed();
```

### 2. Frontend Integration Test

1. Start frontend: `npm run dev`
2. Connect wallet to RSK Testnet
3. Check if contracts are detected
4. Try basic interactions

## 🐛 Troubleshooting

### Common Issues

#### "Contract deployment failed"

- **Check**: You have enough RBTC for gas
- **Check**: You're on RSK Testnet
- **Check**: Contract compilation succeeded

#### "Transaction reverted"

- **Check**: Constructor parameters are correct
- **Check**: Dependencies are deployed first
- **Check**: Gas limit is sufficient

#### "Frontend can't connect"

- **Check**: Contract addresses are correct
- **Check**: You're on the right network
- **Check**: Contracts are verified on explorer

### Debug Commands

```javascript
// In Remix console
await web3.eth.getBalance(yourAddress);
await web3.eth.getBlockNumber();
```

## 📊 Verification

### 1. Block Explorer

1. Go to: https://explorer.testnet.rsk.co
2. Search for your contract addresses
3. Verify contracts are deployed
4. Check transaction history

### 2. Contract Verification

1. Go to: https://explorer.testnet.rsk.co
2. Find your contract
3. Click "Verify and Publish"
4. Upload source code
5. Verify compilation settings

## 🎯 Next Steps

After successful deployment:

1. **Update Frontend**: Replace mock addresses with real ones
2. **Test Integration**: Try all frontend features
3. **Initialize Contracts**: Set up initial parameters
4. **Demo Preparation**: Prepare for presentation

## 📞 Support

### Resources

- **Remix IDE**: https://remix.ethereum.org
- **RSK Faucet**: https://faucet.rsk.co
- **RSK Explorer**: https://explorer.testnet.rsk.co
- **MetaMask**: https://metamask.io

### Getting Help

- **Discord**: [Vintara Community](https://discord.gg/vintara)
- **GitHub Issues**: [Create an issue](https://github.com/your-username/vintara/issues)

---

**Ready to deploy?** Follow this guide step by step and you'll have your contracts deployed in no time! 🚀
