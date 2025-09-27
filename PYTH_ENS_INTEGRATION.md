# PyTH Network & ENS Integration for Vintara DeFi Protocol

This document describes the integration of PyTH Network price feeds and ENS (Ethereum Name Service) functionality into the Vintara DeFi protocol on Rootstock.

## 🔮 PyTH Network Integration

### Overview

The PyTH Network integration provides real-time price feeds for rBTC and USDT, enabling dynamic interest rate calculations and market-responsive yield optimization.

### Smart Contracts

#### PythOracle.sol

- **Purpose**: Fetches real-time price data from PyTH Network via Hermes
- **Features**:
  - Real-time rBTC and USDT price feeds
  - Price confidence validation
  - Stale price detection (5-minute max age)
  - Batch price updates
  - Emergency pause functionality

#### Key Functions:

```solidity
// Update price from PyTH Network
function updatePrice(bytes32 priceId, int64 price, uint64 conf, int32 expo, uint64 publishTime)

// Get current rBTC price
function getRBTCPrice() external view returns (int64 price)

// Get current USDT price
function getUSDTPrice() external view returns (int64 price)

// Calculate rBTC/USDT ratio
function getRBTCToUSDTRatio() external view returns (uint256 ratio)
```

### Integration with Existing Contracts

#### YieldVault.sol Updates

- **Dynamic Yield Rates**: Yield rates now adjust based on rBTC price volatility
- **Market-Responsive APY**: Higher rBTC prices increase yield rates, lower prices decrease them
- **Price-Based Strategy Execution**: Automated strategies consider current market conditions

#### LendingProtocol.sol Updates

- **Dynamic Interest Rates**: Borrow and supply rates adjust based on market conditions
- **Real-Time Risk Assessment**: Health factors calculated using live price data
- **Market-Based Liquidation**: Liquidation thresholds adapt to price volatility

### Frontend Components

#### PythPriceFeed.tsx

- Real-time price display with confidence indicators
- Price change tracking (24h)
- Auto-refresh functionality
- Price staleness warnings

#### EnhancedLendingForm.tsx

- Integrated PyTH price feeds
- Dynamic rate calculations
- Market condition indicators
- Real-time health factor monitoring

## 🌐 ENS Integration

### Overview

ENS integration allows users to use human-readable names (like `user.vintara.eth`) instead of complex wallet addresses for DeFi operations.

### Smart Contracts

#### ENSResolver.sol

- **Purpose**: Resolves ENS names to Ethereum addresses for DeFi operations
- **Features**:
  - ENS name registration and management
  - Address resolution with fallback
  - Batch operations for multiple names
  - Authorization system for trusted addresses

#### Key Functions:

```solidity
// Register ENS name
function registerENSName(bytes32 nameHash, string calldata name, address addr)

// Resolve ENS name to address
function resolveENSNameString(string calldata name) external view returns (address addr)

// Get ENS name for address
function getENSNameForAddress(address addr) external view returns (bytes32 nameHash)

// Resolve name or address (with fallback)
function resolveNameOrAddress(string calldata nameOrAddress) external view returns (address addr)
```

### Integration with Lending Protocol

#### ENS-Enabled Functions:

```solidity
// Borrow using ENS name
function borrowWithENS(string calldata ensName, uint256 amount)

// Repay using ENS name
function repayWithENS(string calldata ensName, uint256 amount)
```

### Frontend Components

#### ENSInput.tsx

- ENS name validation and resolution
- Real-time address resolution
- Suggestion system for common names
- Fallback to regular addresses

#### ENSAddressDisplay.tsx

- Display resolved addresses with ENS names
- Copy to clipboard functionality
- Block explorer integration

#### useENS.ts Hook

- ENS name resolution utilities
- Validation functions
- Error handling and loading states

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Hardhat
- Rootstock testnet access

### Installation

1. **Install Dependencies**:

```bash
npm install
```

2. **Compile Contracts**:

```bash
npm run compile
```

3. **Run Tests**:

```bash
npm run test
```

4. **Deploy to Testnet**:

```bash
npm run deploy:testnet
```

### Configuration

#### Environment Variables

Create a `.env` file with:

```env
PRIVATE_KEY=your_private_key
ROOTSTOCK_RPC_URL=your_rpc_url
PYTH_HERMES_ENDPOINT=https://hermes.pyth.network/v2/updates/price/latest
```

#### Contract Addresses

After deployment, update your frontend configuration with the deployed contract addresses:

- PythOracle
- ENSResolver
- Updated YieldVault
- Updated LendingProtocol

## 📊 API Endpoints

### ENS Resolution

```typescript
// Resolve ENS name to address
POST /api/ens/resolve
{
  "name": "alice.vintara.eth"
}

// Reverse resolve address to ENS name
POST /api/ens/reverse
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
}

// Validate ENS name
POST /api/ens/validate
{
  "name": "alice.vintara.eth"
}
```

### PyTH Price Feeds

```typescript
// Get current prices
GET /api/pyth/prices
Response: {
  "rbtc": {
    "price": 45000,
    "confidence": 95.5,
    "timestamp": 1640995200,
    "change24h": 2.5,
    "isValid": true
  },
  "usdt": {
    "price": 1.00,
    "confidence": 98.2,
    "timestamp": 1640995200,
    "change24h": 0.1,
    "isValid": true
  }
}
```

## 🧪 Testing

### Smart Contract Tests

```bash
# Test PyTH Oracle
npx hardhat test test/PythOracle.test.js

# Test ENS Resolver
npx hardhat test test/ENSResolver.test.js

# Test integration
npx hardhat test test/Integration.test.js
```

### Frontend Tests

```bash
# Test ENS components
npm test -- --testPathPattern=ENS

# Test PyTH components
npm test -- --testPathPattern=Pyth
```

## 🔧 Usage Examples

### Using ENS Names in Lending

```typescript
// Borrow using ENS name
const tx = await lendingProtocol.borrowWithENS(
  "alice.vintara.eth",
  ethers.parseEther("1000")
);

// Repay using ENS name
const tx = await lendingProtocol.repayWithENS(
  "alice.vintara.eth",
  ethers.parseEther("500")
);
```

### Dynamic Yield Calculation

```typescript
// Update yield based on market conditions
const tx = await yieldVault.updateYieldBasedOnMarketConditions();

// Get current dynamic yield rate
const dynamicRate = await yieldVault.dynamicYieldRate();
```

### Price Feed Integration

```typescript
// Get current rBTC price
const rbtcPrice = await pythOracle.getRBTCPrice();

// Get price ratio
const ratio = await pythOracle.getRBTCToUSDTRatio();

// Check price validity
const isValid = await pythOracle.isPriceValid(rbtcPriceId);
```

## 🛡️ Security Considerations

### PyTH Integration

- **Price Validation**: All prices validated for confidence and staleness
- **Fallback Mechanisms**: Graceful degradation if PyTH oracle fails
- **Rate Limiting**: Prevents excessive price update calls
- **Access Control**: Only authorized updaters can modify prices

### ENS Integration

- **Name Validation**: Strict ENS name format validation
- **Authorization**: Only authorized resolvers can register names
- **Fallback Resolution**: Falls back to regular addresses if ENS fails
- **Pause Functionality**: Emergency pause for security incidents

## 📈 Performance Optimizations

### Smart Contracts

- **Batch Operations**: Batch price updates and ENS resolutions
- **Gas Optimization**: Efficient storage patterns and minimal external calls
- **Caching**: Price data cached with configurable TTL

### Frontend

- **Debounced Input**: ENS resolution debounced to prevent excessive calls
- **Caching**: Resolved addresses cached locally
- **Lazy Loading**: Components loaded on demand

## 🔮 Future Enhancements

### PyTH Network

- **Additional Assets**: Support for more tokens (ETH, DAI, etc.)
- **Cross-Chain Prices**: Multi-chain price aggregation
- **Volatility Metrics**: Real-time volatility calculations
- **Price Alerts**: Automated price-based notifications

### ENS Integration

- **Subdomain Support**: Support for subdomains (user.vintara.eth)
- **Reverse Resolution**: Automatic ENS name display
- **Batch Operations**: Bulk ENS operations
- **Integration with Other Protocols**: Cross-protocol ENS support

## 📞 Support

For questions or issues:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Community**: Join our Discord for discussions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the Rootstock ecosystem**
