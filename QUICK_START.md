# 🚀 Vintara DeFi Protocol - Quick Start Guide

## ⚡ 5-Minute Setup

Get your Vintara DeFi protocol up and running in minutes!

## 📋 Prerequisites

- **Node.js**: Version 18+ installed
- **MetaMask**: Browser extension installed
- **Testnet RBTC**: Get from [RSK Faucet](https://faucet.rsk.co)

## 🔧 Quick Setup

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Environment Setup

```bash
# Copy environment file
cp env.example .env

# Edit with your private key (use a test wallet!)
nano .env
```

### 3. Add RSK Testnet to MetaMask

- **Network Name**: Rootstock Testnet
- **RPC URL**: `https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T`
- **Chain ID**: `31`
- **Currency Symbol**: `tRBTC`
- **Block Explorer**: `https://explorer.testnet.rsk.co`

### 4. Get Testnet RBTC

1. Visit: https://faucet.rsk.co
2. Enter your wallet address
3. Get free testnet RBTC

### 5. Start the Application

```bash
npm run dev
```

## 🎯 Demo Mode (No Deployment Required)

The frontend works in demo mode without deploying contracts:

1. **Open**: http://localhost:3000
2. **Connect Wallet**: Click "Connect Wallet"
3. **Explore Features**: All UI components work
4. **View Prices**: See mock PyTH price feeds
5. **Try ENS**: Type ENS names in input fields

## 🚀 Deploy Contracts (Optional)

### Method 1: Remix IDE (Recommended)

1. Go to: https://remix.ethereum.org
2. Create workspace: "Vintara DeFi"
3. Upload contracts from `contracts/` folder
4. Compile with Solidity 0.8.19
5. Deploy to RSK Testnet
6. Update addresses in `src/config/contracts.ts`

### Method 2: Manual Deployment

Follow the detailed guide in `SIMPLE_DEPLOYMENT_GUIDE.md`

## 🎨 Features to Demo

### 1. Live Price Feeds

- **rBTC Price**: Real-time price from PyTH Network
- **USDT Price**: Stablecoin price feed
- **Dynamic Updates**: Prices update every 30 seconds

### 2. ENS Integration

- **Human-readable Addresses**: Type "alice.vintara.eth"
- **Address Resolution**: See resolved addresses
- **Reverse Lookup**: Get ENS name from address

### 3. DeFi Protocol

- **Lending**: Borrow against collateral
- **Yield Farming**: Earn rewards
- **Liquidity Pools**: Provide liquidity
- **Governance**: Vote on proposals

### 4. Dynamic Rates

- **Market Responsive**: Rates adjust based on conditions
- **Real-time Updates**: Live rate adjustments
- **Risk Management**: Automatic risk adjustments

## 🧪 Testing Features

### Frontend Testing

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Contract Testing

```bash
# Run contract tests
npx hardhat test

# Run specific test
npx hardhat test test/PythOracle.test.js
```

## 📊 Demo Script

### 1. Introduction (30 seconds)

- "Vintara is a DeFi protocol with PyTH Network oracle integration"
- "We support ENS names for human-readable addresses"
- "All rates are dynamic and market-responsive"

### 2. Live Price Feeds (1 minute)

- Show rBTC price updating in real-time
- Show USDT price feed
- Explain PyTH Network integration

### 3. ENS Integration (1 minute)

- Type "alice.vintara.eth" in address field
- Show address resolution
- Demonstrate reverse lookup

### 4. DeFi Features (2 minutes)

- Show lending protocol
- Demonstrate yield farming
- Show governance features
- Explain dynamic rates

### 5. Technical Highlights (1 minute)

- Smart contract architecture
- Security features
- Gas optimization
- Cross-chain ready

## 🐛 Troubleshooting

### Common Issues

#### "Cannot connect to wallet"

- **Solution**: Make sure MetaMask is installed and unlocked
- **Check**: You're on RSK Testnet (Chain ID: 31)

#### "Insufficient funds"

- **Solution**: Get testnet RBTC from faucet
- **Check**: Wallet balance on RSK Testnet

#### "Contract not found"

- **Solution**: Use demo mode or deploy contracts
- **Check**: Contract addresses in config

#### "Network error"

- **Solution**: Check internet connection
- **Check**: RSK RPC endpoint is accessible

### Debug Commands

```bash
# Check network
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T

# Check wallet balance
# Use MetaMask or block explorer
```

## 📱 Mobile Testing

The app is fully responsive and works on mobile:

1. **Open on mobile browser**
2. **Connect MetaMask mobile**
3. **Test all features**
4. **Check responsive design**

## 🎯 Hackathon Tips

### Presentation

1. **Start with demo mode**: Show UI without deployment
2. **Explain features**: Walk through each component
3. **Show code**: Highlight smart contract features
4. **Discuss innovation**: PyTH + ENS integration
5. **Mention scalability**: Multi-chain ready

### Technical Discussion

- **Smart Contracts**: 9 contracts, 2500+ lines
- **Frontend**: React + TypeScript, 50+ components
- **Integration**: PyTH Network + ENS
- **Security**: OpenZeppelin standards
- **Testing**: Comprehensive test coverage

## 📞 Support

### Quick Help

- **Discord**: [Vintara Community](https://discord.gg/vintara)
- **GitHub**: [Create an issue](https://github.com/your-username/vintara/issues)
- **Documentation**: [Read the docs](https://docs.vintara.com)

### Resources

- **RSK Faucet**: https://faucet.rsk.co
- **RSK Explorer**: https://explorer.testnet.rsk.co
- **Remix IDE**: https://remix.ethereum.org
- **MetaMask**: https://metamask.io

---

## 🎉 You're Ready!

Your Vintara DeFi protocol is now ready for:

- ✅ **Demo**: Show all features
- ✅ **Testing**: Try all functionality
- ✅ **Deployment**: Deploy to testnet
- ✅ **Presentation**: Impress the judges

**Good luck with your hackathon submission!** 🚀

---

**Need help?** Check the other documentation files:

- `REQUIREMENTS.md` - API keys and configuration
- `SIMPLE_DEPLOYMENT_GUIDE.md` - Detailed deployment
- `PROJECT_COMPLETION_SUMMARY.md` - Complete overview
