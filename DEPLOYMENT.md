# Vintara Deployment Guide

This guide will help you deploy Vintara to Rootstock testnet and mainnet.

## Prerequisites

1. **Node.js 18+** installed
2. **MetaMask** or compatible wallet
3. **Rootstock testnet RBTC** for gas fees
4. **Private key** for deployment (keep secure!)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Private key for deployment (DO NOT commit this file)
PRIVATE_KEY=your_private_key_here

# RPC URLs
ROOTSTOCK_MAINNET_RPC=https://public-node.rsk.co
ROOTSTOCK_TESTNET_RPC=https://public-node.testnet.rsk.co

# API Keys (optional)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 3. Get Testnet RBTC

Visit the Rootstock testnet faucet to get free testnet RBTC:

- **Faucet**: https://faucet.rsk.co
- **Explorer**: https://explorer.testnet.rsk.co

## Deployment

### Testnet Deployment

1. **Compile contracts**:

```bash
npm run compile
```

2. **Run tests**:

```bash
npm run test
```

3. **Deploy to testnet**:

```bash
npm run deploy:testnet
```

4. **Verify contracts** (optional):

```bash
npm run verify:testnet
```

### Mainnet Deployment

⚠️ **WARNING**: Only deploy to mainnet after thorough testing!

1. **Deploy to mainnet**:

```bash
npm run deploy:mainnet
```

2. **Verify contracts**:

```bash
npm run verify:mainnet
```

## Contract Addresses

After deployment, you'll receive contract addresses. Update your frontend configuration:

```typescript
// src/config/contracts.ts
export const CONTRACTS = {
  rBTC: "0x...",
  usdt: "0x...",
  vint: "0x...",
  priceOracle: "0x...",
  yieldVault: "0x...",
  lendingProtocol: "0x...",
  liquidityPool: "0x...",
  yieldFarming: "0x...",
  governance: "0x...",
};
```

## Testing Deployment

### 1. Frontend Testing

1. Start the development server:

```bash
npm run dev
```

2. Connect MetaMask to Rootstock testnet
3. Test all features:
   - Deposit rBTC to yield vault
   - Provide liquidity to pools
   - Borrow against collateral
   - Stake LP tokens for rewards

### 2. Smart Contract Testing

Test key functions:

```bash
# Test yield vault
npx hardhat test test/YieldVault.test.js

# Test lending protocol
npx hardhat test test/LendingProtocol.test.js

# Test all contracts
npx hardhat test
```

## Network Configuration

### Rootstock Testnet

- **Chain ID**: 31
- **RPC URL**: https://public-node.testnet.rsk.co
- **Explorer**: https://explorer.testnet.rsk.co
- **Faucet**: https://faucet.rsk.co

### Rootstock Mainnet

- **Chain ID**: 30
- **RPC URL**: https://public-node.rsk.co
- **Explorer**: https://explorer.rsk.co

## Security Checklist

Before mainnet deployment:

- [ ] All tests passing
- [ ] Smart contracts audited
- [ ] Access controls properly set
- [ ] Emergency pause functions tested
- [ ] Gas optimization completed
- [ ] Documentation updated
- [ ] Team review completed

## Troubleshooting

### Common Issues

1. **"Insufficient funds" error**:

   - Ensure you have enough RBTC for gas fees
   - Check gas price settings

2. **"Contract verification failed"**:

   - Verify constructor parameters match deployment
   - Check contract source code

3. **"Transaction failed"**:
   - Check gas limit settings
   - Verify contract addresses

### Getting Help

- **Discord**: [Vintara Community](https://discord.gg/vintara)
- **GitHub Issues**: [Create an issue](https://github.com/aniketsahu115/vintara/issues)
- **Documentation**: [Read the docs](https://docs.vintara.com)

## Post-Deployment

### 1. Initialize Contracts

After deployment, initialize the contracts:

```javascript
// Set initial prices in oracle
await priceOracle.updatePrice(
  rBTC.address,
  ethers.utils.parseUnits("50000", 8),
  9500
);
await priceOracle.updatePrice(
  usdt.address,
  ethers.utils.parseUnits("1", 8),
  9800
);

// Add pools to yield farming
await yieldFarming.addPool(liquidityPool.address, 1000, false);
```

### 2. Update Frontend

Update your frontend with the new contract addresses and redeploy.

### 3. Monitor

Monitor the contracts using:

- **RSK Explorer**: Track transactions and contract interactions
- **Analytics Dashboard**: Monitor protocol metrics
- **Alerts**: Set up monitoring for critical events

## Maintenance

### Regular Tasks

1. **Update price feeds** in the oracle
2. **Monitor health factors** in lending protocol
3. **Check yield rates** and adjust if needed
4. **Review governance proposals**
5. **Update documentation**

### Emergency Procedures

1. **Pause contracts** if issues detected
2. **Update access controls** if needed
3. **Communicate with community** about any issues
4. **Implement fixes** and redeploy if necessary

---

**Remember**: Always test thoroughly on testnet before mainnet deployment!
