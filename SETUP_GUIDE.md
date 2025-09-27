# 🚀 Vintara Setup Guide

## 📋 **Essential Environment Variables for Hackathon**

For the hackathon submission, you need to create a `.env` file with these **essential** variables:

### **1. Create .env file**

```bash
# Copy the example file
cp env.example .env
```

### **2. Essential Variables (Required)**

```env
# Your wallet private key for deployment
PRIVATE_KEY=your_private_key_here

# WalletConnect Project ID (you already have this!)
WALLETCONNECT_PROJECT_ID=95856d4bd39a6a4f4ec4a9477b796f17

# RSK API Key for contract verification
RSK_API_KEY=your_rsk_api_key_here
```

### **3. How to Get Each API Key**

#### **🔑 Private Key**

1. Open MetaMask
2. Click on your account (top right)
3. Go to "Account Details"
4. Click "Export Private Key"
5. Enter your password
6. Copy the private key
7. **⚠️ IMPORTANT: Use a test wallet, never your main wallet!**

#### **🌐 WalletConnect Project ID**

✅ **You already have this!** (`95856d4bd39a6a4f4ec4a9477b796f17`)

#### **📊 RSK API Key (for contract verification)**

1. Go to [RSK Block Explorer](https://blockscout.com/rsk)
2. Click "Sign In" (top right)
3. Create an account or sign in
4. Go to your profile/settings
5. Generate an API key
6. Copy the API key

### **4. Optional Variables (Nice to Have)**

These are optional but can enhance your project:

```env
# For real-time price data
COINGECKO_API_KEY=your_coingecko_api_key_here

# For analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# For error tracking
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### **5. Quick Setup Commands**

```bash
# 1. Create .env file
echo "PRIVATE_KEY=your_private_key_here" > .env
echo "WALLETCONNECT_PROJECT_ID=95856d4bd39a6a4f4ec4a9477b796f17" >> .env
echo "RSK_API_KEY=your_rsk_api_key_here" >> .env

# 2. Install dependencies
npm install

# 3. Compile contracts
npm run compile

# 4. Run tests
npm run test

# 5. Deploy to testnet
npm run deploy:testnet

# 6. Start frontend
npm run dev
```

### **6. Testnet Setup**

1. **Get Testnet RBTC:**

   - Go to [RSK Faucet](https://faucet.rsk.co)
   - Enter your wallet address
   - Get free testnet RBTC

2. **Add Rootstock Testnet to MetaMask:**
   - Network Name: `Rootstock Testnet`
   - RPC URL: `https://public-node.testnet.rsk.co`
   - Chain ID: `31`
   - Currency Symbol: `tRBTC`
   - Block Explorer: `https://explorer.testnet.rsk.co`

### **7. Deployment Checklist**

- [ ] ✅ Private key added to `.env`
- [ ] ✅ WalletConnect Project ID configured
- [ ] ✅ RSK API key added (optional but recommended)
- [ ] ✅ Testnet RBTC obtained from faucet
- [ ] ✅ Rootstock Testnet added to MetaMask
- [ ] ✅ Contracts compiled successfully
- [ ] ✅ Tests passing
- [ ] ✅ Contracts deployed to testnet
- [ ] ✅ Frontend running and connected

### **8. Security Notes**

- 🔒 **NEVER commit your `.env` file to Git**
- 🔒 **Use a test wallet for development**
- 🔒 **Keep your private keys secure**
- 🔒 **Test on testnet before mainnet**

### **9. Troubleshooting**

**Common Issues:**

1. **"Insufficient funds" error:**

   - Get more testnet RBTC from faucet
   - Check you're on the right network

2. **"Contract verification failed":**

   - Make sure RSK_API_KEY is correct
   - Wait a few minutes and try again

3. **"Wallet connection failed":**

   - Check WalletConnect Project ID
   - Make sure you're on the right network

4. **"Tests failing":**
   - Run `npm install` to ensure all dependencies are installed
   - Check that contracts compile successfully

### **10. Hackathon Submission**

For the hackathon, you need:

- ✅ Working smart contracts on Rootstock testnet
- ✅ At least 2 successful on-chain transactions
- ✅ Working frontend with wallet connection
- ✅ Clear documentation

**You're ready to submit! 🎉**
