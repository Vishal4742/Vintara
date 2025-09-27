# Vintara Project Requirements

This document contains all the API keys, configurations, and external services needed to complete the Vintara DeFi protocol project.

## 🔑 Essential API Keys & Credentials

### 1. Wallet Configuration

```env
# Your wallet private key for deployment (REQUIRED)
PRIVATE_KEY=your_private_key_here

# Get this from MetaMask: Account Details > Export Private Key
# ⚠️ IMPORTANT: Use a test wallet, never your main wallet!
```

### 2. WalletConnect Configuration

```env
# WalletConnect Project ID (REQUIRED for wallet connection)
WALLETCONNECT_PROJECT_ID=95856d4bd39a6a4f4ec4a9477b796f17

# This is already configured in the project
```

### 3. RSK Network Configuration

```env
# RSK API credentials (REQUIRED for enhanced RPC)
RSK_API_KEY=aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T
RSK_RPC_URL=https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T
RSK_WS_URL=wss://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T

# These are already configured in the project
```

### 4. Block Explorer API Keys

```env
# RSK Block Explorer API Key (for contract verification)
RSK_BLOCKEXPLORER_API_KEY=your_rsk_blockexplorer_api_key_here

# Get from: https://blockscout.com/rsk/api_docs
# 1. Go to RSK Block Explorer
# 2. Create an account
# 3. Generate an API key
```

## 🌐 External API Services

### 1. Price Data APIs

```env
# CoinGecko API Key (for cryptocurrency prices)
COINGECKO_API_KEY=your_coingecko_api_key_here

# Get from: https://www.coingecko.com/en/api
# 1. Go to CoinGecko API
# 2. Create an account
# 3. Generate an API key
# Used for: Real-time BTC, ETH, and other token prices
```

### 2. PyTH Network Integration

```env
# PyTH Network Hermes Endpoint
PYTH_HERMES_ENDPOINT=https://hermes.pyth.network/v2/updates/price/latest

# PyTH Network API Key (if required)
PYTH_API_KEY=your_pyth_api_key_here

# Get from: https://pyth.network/
# Used for: Real-time price feeds for rBTC and USDT
```

### 3. ENS (Ethereum Name Service) Integration

```env
# ENS Registry Address (for mainnet)
ENS_REGISTRY_ADDRESS=0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e

# ENS Resolver Address
ENS_RESOLVER_ADDRESS=0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41

# These are standard ENS addresses
```

## 🗄️ Database & Backend Services (Optional)

### 1. MongoDB Atlas

```env
# MongoDB connection string (for storing transaction data, user analytics)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vintara

# Get from: https://www.mongodb.com/atlas
# 1. Create a MongoDB Atlas account
# 2. Create a cluster
# 3. Get the connection string
```

### 2. PostgreSQL/Supabase

```env
# PostgreSQL connection string (alternative database)
DATABASE_URL=postgresql://username:password@localhost:5432/vintara

# Or use Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Analytics & Monitoring (Optional)

### 1. Google Analytics

```env
# Google Analytics ID (for website analytics)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Get from: https://analytics.google.com/
# 1. Create a Google Analytics account
# 2. Create a property for your website
# 3. Get the Measurement ID
```

### 2. Sentry (Error Tracking)

```env
# Sentry DSN (for error tracking and monitoring)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Get from: https://sentry.io/
# 1. Create a Sentry account
# 2. Create a new project
# 3. Get the DSN
```

## 📧 Notification Services (Optional)

### 1. SendGrid (Email Notifications)

```env
# SendGrid API Key (for email notifications)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Get from: https://sendgrid.com/
# 1. Create a SendGrid account
# 2. Generate an API key
```

### 2. Twilio (SMS Notifications)

```env
# Twilio API credentials
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# Get from: https://www.twilio.com/
# 1. Create a Twilio account
# 2. Get Account SID and Auth Token
```

## 🔐 Security & Authentication (Optional)

### 1. JWT Configuration

```env
# JWT Secret for API authentication (if you add a backend)
JWT_SECRET=your_super_secret_jwt_key_here

# Generate a strong random string
```

### 2. Encryption

```env
# Encryption key for sensitive data
ENCRYPTION_KEY=your_encryption_key_here

# Generate a strong random string
```

## 🌍 Network Configuration

### 1. Rootstock Testnet

```env
# Rootstock Testnet RPC URL
RSK_TESTNET_RPC=https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T

# Rootstock Testnet Chain ID
RSK_TESTNET_CHAIN_ID=31

# Rootstock Testnet Explorer
RSK_TESTNET_EXPLORER=https://explorer.testnet.rsk.co

# Rootstock Testnet Faucet
RSK_TESTNET_FAUCET=https://faucet.rsk.co
```

### 2. Rootstock Mainnet

```env
# Rootstock Mainnet RPC URL
RSK_MAINNET_RPC=https://public-node.rsk.co

# Rootstock Mainnet Chain ID
RSK_MAINNET_CHAIN_ID=30

# Rootstock Mainnet Explorer
RSK_MAINNET_EXPLORER=https://explorer.rsk.co
```

## 🚀 Deployment Configuration

### 1. Environment Variables

```env
# Set to 'development', 'staging', or 'production'
NODE_ENV=development

# Enable/disable debug logging
DEBUG=true

# Gas price settings (in wei)
GAS_PRICE=60000000
```

### 2. Frontend Configuration

```env
# Base URL for your application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Public API endpoints
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📋 Smart Contract Addresses (After Deployment)

These will be filled automatically after deployment, but you can also set them manually:

```env
# MockToken contract address
MOCK_TOKEN_ADDRESS=

# YieldVault contract address
YIELD_VAULT_ADDRESS=

# LendingProtocol contract address
LENDING_PROTOCOL_ADDRESS=

# LiquidityPool contract address
LIQUIDITY_POOL_ADDRESS=

# YieldFarming contract address
YIELD_FARMING_ADDRESS=

# PriceOracle contract address
PRICE_ORACLE_ADDRESS=

# PythOracle contract address
PYTH_ORACLE_ADDRESS=

# ENSResolver contract address
ENS_RESOLVER_ADDRESS=

# Governance contract address
GOVERNANCE_ADDRESS=
```

## 🎯 Priority Order for Hackathon

For the hackathon submission, you need these in order of priority:

### Essential (Required)

1. ✅ **PRIVATE_KEY** - Your wallet private key
2. ✅ **WALLETCONNECT_PROJECT_ID** - Already configured
3. ✅ **RSK_API_KEY** - Already configured

### Important (Recommended)

4. **RSK_BLOCKEXPLORER_API_KEY** - For contract verification
5. **COINGECKO_API_KEY** - For real-time price data

### Optional (Nice to Have)

6. **PYTH_API_KEY** - For PyTH Network integration
7. **MONGODB_URI** - For data storage
8. **GOOGLE_ANALYTICS_ID** - For analytics
9. **SENTRY_DSN** - For error tracking

## 🔧 Setup Instructions

### 1. Create .env File

```bash
# Copy the example file
cp env.example .env

# Edit with your actual values
nano .env
```

### 2. Get Testnet Tokens

```bash
# Visit the RSK faucet
https://faucet.rsk.co

# Enter your wallet address
# Get free testnet RBTC
```

### 3. Add Network to MetaMask

```javascript
// Network Name: Rootstock Testnet
// RPC URL: https://rpc.testnet.rootstock.io/aHYduscUz7vhlRM1DHcieLdE9SfQ7K-T
// Chain ID: 31
// Currency Symbol: tRBTC
// Block Explorer: https://explorer.testnet.rsk.co
```

## 🚨 Security Notes

- 🔒 **NEVER commit your `.env` file to Git**
- 🔒 **Use a test wallet for development**
- 🔒 **Keep your private keys secure**
- 🔒 **Test on testnet before mainnet**
- 🔒 **Use different wallets for testnet and mainnet**

## 📞 Support & Resources

### Useful Links

- **RSK Faucet**: https://faucet.rsk.co
- **RSK Explorer**: https://explorer.testnet.rsk.co
- **RSK Documentation**: https://developers.rsk.co
- **WalletConnect**: https://cloud.walletconnect.com
- **CoinGecko API**: https://www.coingecko.com/en/api
- **PyTH Network**: https://pyth.network/

### Getting Help

- **Discord**: [Vintara Community](https://discord.gg/vintara)
- **GitHub Issues**: [Create an issue](https://github.com/your-username/vintara/issues)
- **Documentation**: [Read the docs](https://docs.vintara.com)

---

**Note**: This document will be updated as new integrations are added to the project. Keep your API keys secure and never share them publicly.
