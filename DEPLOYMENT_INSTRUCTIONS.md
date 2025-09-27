# 🚀 Vintara DeFi Protocol - Deployment Instructions

## 🎯 Current Situation

We've encountered Hardhat compilation issues due to package dependency conflicts. Here are the **3 best approaches** to deploy your contracts:

## 📋 Prerequisites

### 1. Environment Setup

```bash
# Create .env file
cp env.example .env

# Edit .env with your private key
nano .env
```

**Required in .env:**

```env
PRIVATE_KEY=your_wallet_private_key_here
```

### 2. Get Testnet RBTC

1. Visit: https://faucet.rsk.co
2. Enter your wallet address
3. Get free testnet RBTC (you'll need ~0.5 RBTC for deployment)

### 3. Add RSK Testnet to MetaMask

- **Network Name**: Rootstock Testnet
- **RPC URL**: `https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T`
- **Chain ID**: `31`
- **Currency Symbol**: `tRBTC`
- **Block Explorer**: `https://explorer.testnet.rsk.co`

## 🚀 Deployment Options

### Option 1: Remix IDE (RECOMMENDED - Most Reliable)

**Why this is best:**

- ✅ No compilation issues
- ✅ Visual interface
- ✅ Built-in contract verification
- ✅ Easy to use

**Steps:**

1. Go to: https://remix.ethereum.org
2. Create workspace: "Vintara DeFi"
3. Upload all `.sol` files from `contracts/` folder
4. Compile with Solidity 0.8.19
5. Deploy to RSK Testnet
6. Copy contract addresses

**Detailed guide:** See `REMIX_DEPLOYMENT_GUIDE.md`

### Option 2: Fix Hardhat and Deploy

**Steps to fix Hardhat:**

```bash
# Remove problematic packages
npm uninstall @nomicfoundation/hardhat-toolbox

# Install compatible versions
npm install --save-dev hardhat@^2.19.0
npm install --save-dev @nomicfoundation/hardhat-ethers@^3.0.0
npm install --save-dev @nomicfoundation/hardhat-chai-matchers@^2.0.0
npm install --save-dev @nomicfoundation/hardhat-network-helpers@^1.0.0

# Try to compile
npx hardhat compile --config hardhat.config.minimal.cjs
```

### Option 3: Use Direct Deployment Script

**Steps:**

```bash
# Run the direct deployment script
node deploy-all-contracts.js
```

**Note:** This requires compiled bytecode, which we need to get from Remix or fix Hardhat first.

## 🎯 RECOMMENDED APPROACH

### Use Remix IDE for Deployment

1. **Open Remix**: https://remix.ethereum.org
2. **Upload Contracts**: Copy all `.sol` files from `contracts/` folder
3. **Compile**: Use Solidity 0.8.19
4. **Deploy in Order**:

   - MockToken
   - PythOracle
   - ENSResolver
   - PriceOracle
   - YieldVault
   - LendingProtocol
   - LiquidityPool
   - YieldFarming
   - Governance

5. **Copy Addresses**: Record all deployed addresses
6. **Update Frontend**: Replace addresses in `src/config/contracts.ts`

## 📝 Contract Deployment Order

Deploy in this exact order due to dependencies:

```typescript
// 1. MockToken (no dependencies)
const mockToken = await MockToken.deploy(
  "Mock Token",
  "MOCK",
  ethers.parseEther("1000000")
);

// 2. PythOracle (no dependencies)
const pythOracle = await PythOracle.deploy(
  "0x0000000000000000000000000000000000000000"
);

// 3. ENSResolver (no dependencies)
const ensResolver = await ENSResolver.deploy(
  "0x0000000000000000000000000000000000000000"
);

// 4. PriceOracle (no dependencies)
const priceOracle = await PriceOracle.deploy();

// 5. YieldVault (depends on MockToken, PythOracle)
const yieldVault = await YieldVault.deploy(mockTokenAddress, pythOracleAddress);

// 6. LendingProtocol (depends on MockToken, PythOracle, ENSResolver)
const lendingProtocol = await LendingProtocol.deploy(
  mockTokenAddress,
  mockTokenAddress, // using same token for simplicity
  pythOracleAddress,
  ensResolverAddress
);

// 7. LiquidityPool (depends on MockToken)
const liquidityPool = await LiquidityPool.deploy(
  mockTokenAddress,
  mockTokenAddress
);

// 8. YieldFarming (depends on MockToken, LiquidityPool)
const yieldFarming = await YieldFarming.deploy(
  mockTokenAddress,
  liquidityPoolAddress
);

// 9. Governance (depends on MockToken)
const governance = await Governance.deploy(mockTokenAddress);
```

## 🔧 Post-Deployment Setup

### 1. Update Frontend Configuration

Replace the addresses in `src/config/contracts.ts`:

```typescript
export const CONTRACTS = {
  mockToken: "0x...", // Your deployed MockToken address
  pythOracle: "0x...", // Your deployed PythOracle address
  ensResolver: "0x...", // Your deployed ENSResolver address
  priceOracle: "0x...", // Your deployed PriceOracle address
  yieldVault: "0x...", // Your deployed YieldVault address
  lendingProtocol: "0x...", // Your deployed LendingProtocol address
  liquidityPool: "0x...", // Your deployed LiquidityPool address
  yieldFarming: "0x...", // Your deployed YieldFarming address
  governance: "0x...", // Your deployed Governance address
};
```

### 2. Initialize Contracts

After deployment, initialize the contracts:

#### PythOracle Setup

```solidity
// Set initial prices
await pythOracle.updatePrice(
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // rBTC price ID
  ethers.parseUnits("45000", 8), // $45,000
  ethers.parseUnits("95", 6), // 95% confidence
  -8, // 8 decimals
  Math.floor(Date.now() / 1000)
);
```

#### ENSResolver Setup

```solidity
// Register test ENS names
await ensResolver.registerENSName(
  ethers.keccak256(ethers.toUtf8Bytes("alice.vintara.eth")),
  "alice.vintara.eth",
  yourWalletAddress
);
```

#### YieldVault Setup

```solidity
// Set initial yield rate
await yieldVault.updateDynamicYieldRate(1000); // 10% APY
```

#### LendingProtocol Setup

```solidity
// Set initial interest rates
await lendingProtocol.updateDynamicInterestRates(800, 600); // 8% borrow, 6% supply
```

## 🧪 Testing Deployment

### 1. Basic Contract Tests

```javascript
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

```bash
# Start frontend
npm run dev

# Test in browser
# 1. Connect wallet to RSK Testnet
# 2. Check if contracts are detected
# 3. Try basic interactions
```

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

## 📊 What You Need to Do

### Immediate Steps:

1. **Set up environment**: Create `.env` with your private key
2. **Get testnet RBTC**: Visit https://faucet.rsk.co
3. **Add RSK Testnet**: Configure MetaMask
4. **Deploy contracts**: Use Remix IDE (recommended)
5. **Update frontend**: Replace contract addresses
6. **Test integration**: Verify everything works

### Files to Update After Deployment:

- `src/config/contracts.ts` - Contract addresses
- `src/components/ui/EnhancedLendingForm.tsx` - Use real addresses
- `src/pages/Lending.tsx` - Connect to deployed contracts

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

## 🎯 Next Steps

1. **Choose deployment method** (Remix IDE recommended)
2. **Deploy contracts** in the correct order
3. **Update frontend** with real addresses
4. **Test everything** works together
5. **Prepare for demo** with live contracts

**Ready to deploy?** Follow the Remix IDE guide for the most reliable deployment experience! 🚀
