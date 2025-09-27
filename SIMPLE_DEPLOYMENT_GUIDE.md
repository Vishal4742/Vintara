# Simple Deployment Guide for Vintara DeFi Protocol

## 🚀 Quick Start Deployment

Since we're experiencing Hardhat configuration issues, here's a simple approach to get your contracts deployed and the frontend working.

## 📋 Prerequisites

### 1. Environment Setup

```bash
# Create .env file
cp env.example .env

# Edit .env with your private key
nano .env
```

### 2. Get Testnet RBTC

1. Visit: https://faucet.rsk.co
2. Enter your wallet address
3. Get free testnet RBTC

### 3. Add RSK Testnet to MetaMask

- **Network Name**: Rootstock Testnet
- **RPC URL**: https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T
- **Chain ID**: 31
- **Currency Symbol**: tRBTC
- **Block Explorer**: https://explorer.testnet.rsk.co

## 🔧 Alternative Deployment Methods

### Method 1: Remix IDE (Recommended for Quick Testing)

1. **Go to Remix**: https://remix.ethereum.org
2. **Create new workspace**: "Vintara DeFi"
3. **Upload contracts**: Copy all `.sol` files from `contracts/` folder
4. **Compile**: Use Solidity 0.8.19
5. **Deploy**: Connect MetaMask to RSK Testnet
6. **Deploy contracts** in this order:
   - MockToken
   - PythOracle
   - ENSResolver
   - YieldVault
   - LendingProtocol
   - LiquidityPool
   - YieldFarming
   - PriceOracle
   - Governance

### Method 2: Manual Deployment Script

Create a simple deployment script:

```javascript
// deploy-simple.js
const { ethers } = require("ethers");

async function deploy() {
  // Connect to RSK Testnet
  const provider = new ethers.JsonRpcProvider(
    "https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T"
  );

  // Load wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying from:", wallet.address);

  // Deploy contracts here...
  // (Copy contract bytecode from Remix or Hardhat artifacts)
}

deploy().catch(console.error);
```

### Method 3: Use Existing Deployed Contracts

For demo purposes, you can use these testnet addresses:

```typescript
// src/config/contracts.ts
export const CONTRACTS = {
  mockToken: "0x1234567890123456789012345678901234567890", // Replace with actual
  yieldVault: "0x2345678901234567890123456789012345678901", // Replace with actual
  lendingProtocol: "0x3456789012345678901234567890123456789012", // Replace with actual
  // ... etc
};
```

## 📝 Contract Deployment Order

Deploy contracts in this specific order due to dependencies:

1. **MockToken** (no dependencies)
2. **PythOracle** (no dependencies)
3. **ENSResolver** (no dependencies)
4. **PriceOracle** (no dependencies)
5. **YieldVault** (depends on MockToken, PythOracle)
6. **LendingProtocol** (depends on MockToken, PythOracle, ENSResolver)
7. **LiquidityPool** (depends on MockToken)
8. **YieldFarming** (depends on MockToken, LiquidityPool)
9. **Governance** (depends on MockToken)

## 🔄 Post-Deployment Steps

### 1. Update Contract Addresses

```typescript
// Update src/config/contracts.ts with deployed addresses
export const CONTRACTS = {
  mockToken: "0x...", // Your deployed address
  yieldVault: "0x...", // Your deployed address
  // ... etc
};
```

### 2. Update Frontend Components

```typescript
// Update any hardcoded addresses in components
const LENDING_PROTOCOL_ADDRESS = CONTRACTS.lendingProtocol;
```

### 3. Test Basic Functionality

```bash
# Start frontend
npm run dev

# Test in browser
# 1. Connect wallet
# 2. Try basic interactions
# 3. Check console for errors
```

## 🧪 Testing Your Deployment

### 1. Basic Contract Tests

```javascript
// In browser console or Remix
const contract = await ethers.getContractAt("YieldVault", "0x...");
await contract.totalAssets();
await contract.yieldRate();
```

### 2. Frontend Integration Tests

1. **Connect Wallet**: Should connect to RSK Testnet
2. **View Dashboard**: Should show protocol stats
3. **Try Lending**: Should interact with contracts
4. **Check ENS**: Should resolve ENS names
5. **View Prices**: Should show PyTH price feeds

## 🐛 Troubleshooting

### Common Issues

#### 1. "Contract not deployed"

- **Solution**: Check contract addresses in `src/config/contracts.ts`
- **Verify**: Use block explorer to confirm deployment

#### 2. "Insufficient funds"

- **Solution**: Get more testnet RBTC from faucet
- **Check**: Wallet balance on RSK Testnet

#### 3. "Network not supported"

- **Solution**: Add RSK Testnet to MetaMask
- **Verify**: Chain ID is 31

#### 4. "Contract call failed"

- **Solution**: Check contract ABI and address
- **Debug**: Use block explorer to view transaction

### Debug Commands

```bash
# Check network connection
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T

# Check wallet balance
# Use MetaMask or block explorer
```

## 📊 Deployment Checklist

### Pre-deployment

- [ ] Environment variables set
- [ ] Testnet RBTC obtained
- [ ] RSK Testnet added to MetaMask
- [ ] Contracts compiled successfully

### Deployment

- [ ] MockToken deployed
- [ ] PythOracle deployed
- [ ] ENSResolver deployed
- [ ] YieldVault deployed
- [ ] LendingProtocol deployed
- [ ] LiquidityPool deployed
- [ ] YieldFarming deployed
- [ ] PriceOracle deployed
- [ ] Governance deployed

### Post-deployment

- [ ] Contract addresses updated in config
- [ ] Frontend components updated
- [ ] Basic functionality tested
- [ ] ENS resolution working
- [ ] PyTH price feeds working
- [ ] Lending protocol functional

## 🎯 Demo Mode

If you can't deploy immediately, you can still demo the frontend:

1. **Use mock data**: Frontend will show placeholder data
2. **Simulate interactions**: Buttons will show success messages
3. **Show features**: All UI components will work
4. **Explain functionality**: Walk through the features

## 📞 Getting Help

### Resources

- **RSK Faucet**: https://faucet.rsk.co
- **RSK Explorer**: https://explorer.testnet.rsk.co
- **Remix IDE**: https://remix.ethereum.org
- **MetaMask**: https://metamask.io

### Support

- **Discord**: [Vintara Community](https://discord.gg/vintara)
- **GitHub Issues**: [Create an issue](https://github.com/your-username/vintara/issues)

---

**Note**: This guide provides multiple deployment options. Choose the method that works best for your setup and timeline.
