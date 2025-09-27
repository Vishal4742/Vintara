// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title PythOracle
 * @dev PyTH Network oracle integration for real-time price feeds
 * @notice Fetches price data from PyTH Network via Hermes for rBTC and USDT
 */
contract PythOracle is AccessControl, Pausable, ReentrancyGuard {
    using SafeMath for uint256;

    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    // PyTH Network price feed IDs (these are the actual PyTH price feed IDs)
    bytes32 public constant RBTC_PRICE_ID =
        0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43; // BTC/USD
    bytes32 public constant USDT_PRICE_ID =
        0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b; // USDT/USD

    // Price data structure
    struct PriceData {
        int64 price; // Price in 8 decimals
        uint64 conf; // Confidence interval
        int32 expo; // Price exponent
        uint64 publishTime; // Publish timestamp
        bool isValid; // Whether the price is valid
    }

    // State variables
    mapping(bytes32 => PriceData) public prices;
    mapping(bytes32 => uint256) public lastUpdateTime;
    mapping(bytes32 => string) public priceFeedNames;

    uint256 public constant MAX_PRICE_AGE = 300; // 5 minutes
    uint256 public constant MIN_CONFIDENCE = 1000; // Minimum confidence in 8 decimals
    uint256 public constant PRICE_DECIMALS = 8;

    // Hermes endpoint (this would be the actual Hermes API endpoint)
    string public hermesEndpoint =
        "https://hermes.pyth.network/v2/updates/price/latest";

    // Events
    event PriceUpdated(
        bytes32 indexed priceId,
        int64 price,
        uint64 confidence,
        uint64 publishTime
    );
    event PriceFeedNameSet(bytes32 indexed priceId, string name);
    event HermesEndpointUpdated(string newEndpoint);

    // Errors
    error InvalidPrice();
    error PriceTooOld();
    error LowConfidence();
    error PriceFeedNotFound();
    error Unauthorized();
    error InvalidPriceId();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);

        // Set price feed names
        priceFeedNames[RBTC_PRICE_ID] = "rBTC/USD";
        priceFeedNames[USDT_PRICE_ID] = "USDT/USD";

        emit PriceFeedNameSet(RBTC_PRICE_ID, "rBTC/USD");
        emit PriceFeedNameSet(USDT_PRICE_ID, "USDT/USD");
    }

    /**
     * @dev Update price from PyTH Network via Hermes
     * @param priceId PyTH price feed ID
     * @param price Price in 8 decimals
     * @param conf Confidence interval
     * @param expo Price exponent
     * @param publishTime Publish timestamp
     */
    function updatePrice(
        bytes32 priceId,
        int64 price,
        uint64 conf,
        int32 expo,
        uint64 publishTime
    ) external onlyRole(UPDATER_ROLE) whenNotPaused {
        if (price <= 0) revert InvalidPrice();
        if (conf < MIN_CONFIDENCE) revert LowConfidence();
        if (publishTime == 0) revert InvalidPrice();

        prices[priceId] = PriceData({
            price: price,
            conf: conf,
            expo: expo,
            publishTime: publishTime,
            isValid: true
        });

        lastUpdateTime[priceId] = block.timestamp;

        emit PriceUpdated(priceId, price, conf, publishTime);
    }

    /**
     * @dev Batch update prices from PyTH Network
     * @param priceIds Array of PyTH price feed IDs
     * @param pricesArray Array of prices
     * @param confs Array of confidence intervals
     * @param expos Array of price exponents
     * @param publishTimes Array of publish timestamps
     */
    function batchUpdatePrices(
        bytes32[] calldata priceIds,
        int64[] calldata pricesArray,
        uint64[] calldata confs,
        int32[] calldata expos,
        uint64[] calldata publishTimes
    ) external onlyRole(UPDATER_ROLE) whenNotPaused {
        if (
            priceIds.length != pricesArray.length ||
            priceIds.length != confs.length ||
            priceIds.length != expos.length ||
            priceIds.length != publishTimes.length
        ) {
            revert InvalidPrice();
        }

        for (uint256 i = 0; i < priceIds.length; i++) {
            if (pricesArray[i] <= 0) revert InvalidPrice();
            if (confs[i] < MIN_CONFIDENCE) revert LowConfidence();
            if (publishTimes[i] == 0) revert InvalidPrice();

            prices[priceIds[i]] = PriceData({
                price: pricesArray[i],
                conf: confs[i],
                expo: expos[i],
                publishTime: publishTimes[i],
                isValid: true
            });

            lastUpdateTime[priceIds[i]] = block.timestamp;

            emit PriceUpdated(
                priceIds[i],
                pricesArray[i],
                confs[i],
                publishTimes[i]
            );
        }
    }

    /**
     * @dev Get current price for rBTC
     * @return price Price in 8 decimals
     */
    function getRBTCPrice() external view returns (int64 price) {
        return _getPrice(RBTC_PRICE_ID);
    }

    /**
     * @dev Get current price for USDT
     * @return price Price in 8 decimals
     */
    function getUSDTPrice() external view returns (int64 price) {
        return _getPrice(USDT_PRICE_ID);
    }

    /**
     * @dev Get price for a specific price feed ID
     * @param priceId PyTH price feed ID
     * @return price Price in 8 decimals
     */
    function getPrice(bytes32 priceId) external view returns (int64 price) {
        return _getPrice(priceId);
    }

    /**
     * @dev Get price with full data for a specific price feed ID
     * @param priceId PyTH price feed ID
     * @return priceData Complete price data structure
     */
    function getPriceData(
        bytes32 priceId
    ) external view returns (PriceData memory priceData) {
        priceData = prices[priceId];
        if (!priceData.isValid) revert PriceFeedNotFound();
        if (block.timestamp.sub(lastUpdateTime[priceId]) > MAX_PRICE_AGE)
            revert PriceTooOld();
        return priceData;
    }

    /**
     * @dev Get price ratio between rBTC and USDT
     * @return ratio Price ratio (rBTC/USDT) in 8 decimals
     */
    function getRBTCToUSDTRatio() external view returns (uint256 ratio) {
        int64 rbtcPrice = _getPrice(RBTC_PRICE_ID);
        int64 usdtPrice = _getPrice(USDT_PRICE_ID);

        // Convert to uint256 and calculate ratio
        uint256 rbtcPriceUint = uint256(uint64(rbtcPrice));
        uint256 usdtPriceUint = uint256(uint64(usdtPrice));

        return rbtcPriceUint.mul(10 ** PRICE_DECIMALS).div(usdtPriceUint);
    }

    /**
     * @dev Check if price is valid and fresh
     * @param priceId PyTH price feed ID
     * @return isValid Whether the price is valid and fresh
     */
    function isPriceValid(
        bytes32 priceId
    ) external view returns (bool isValid) {
        PriceData memory priceData = prices[priceId];
        return
            priceData.isValid &&
            block.timestamp.sub(lastUpdateTime[priceId]) <= MAX_PRICE_AGE &&
            priceData.conf >= MIN_CONFIDENCE;
    }

    /**
     * @dev Get price age in seconds
     * @param priceId PyTH price feed ID
     * @return age Age in seconds
     */
    function getPriceAge(bytes32 priceId) external view returns (uint256 age) {
        return block.timestamp.sub(lastUpdateTime[priceId]);
    }

    /**
     * @dev Set price feed name
     * @param priceId PyTH price feed ID
     * @param name Human-readable name
     */
    function setPriceFeedName(
        bytes32 priceId,
        string calldata name
    ) external onlyRole(MANAGER_ROLE) {
        priceFeedNames[priceId] = name;
        emit PriceFeedNameSet(priceId, name);
    }

    /**
     * @dev Update Hermes endpoint
     * @param newEndpoint New Hermes API endpoint
     */
    function updateHermesEndpoint(
        string calldata newEndpoint
    ) external onlyRole(MANAGER_ROLE) {
        hermesEndpoint = newEndpoint;
        emit HermesEndpointUpdated(newEndpoint);
    }

    /**
     * @dev Internal function to get price with validation
     * @param priceId PyTH price feed ID
     * @return price Price in 8 decimals
     */
    function _getPrice(bytes32 priceId) internal view returns (int64 price) {
        PriceData memory priceData = prices[priceId];

        if (!priceData.isValid) revert PriceFeedNotFound();
        if (block.timestamp.sub(lastUpdateTime[priceId]) > MAX_PRICE_AGE)
            revert PriceTooOld();
        if (priceData.conf < MIN_CONFIDENCE) revert LowConfidence();

        return priceData.price;
    }

    /**
     * @dev Emergency pause (only admin)
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause (only admin)
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Get supported price feed IDs
     * @return priceIds Array of supported price feed IDs
     */
    function getSupportedPriceFeeds()
        external
        pure
        returns (bytes32[] memory priceIds)
    {
        priceIds = new bytes32[](2);
        priceIds[0] = RBTC_PRICE_ID;
        priceIds[1] = USDT_PRICE_ID;
        return priceIds;
    }
}
