// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// Mock Chainlink interface for deployment
interface AggregatorV3Interface {
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

/**
 * @title ChainlinkOracle
 * @dev Chainlink oracle integration for real-time price feeds on Rootstock
 * @notice Fetches price data from Chainlink price feeds for rBTC and USDT
 */
contract ChainlinkOracle is AccessControl, Pausable, ReentrancyGuard {
    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    // Chainlink price feed interfaces
    AggregatorV3Interface public rBTCPriceFeed;
    AggregatorV3Interface public usdtPriceFeed;

    // Price data structure
    struct PriceData {
        int256 price;
        uint256 timestamp;
        uint8 decimals;
        bool isValid;
    }

    // Stored price data
    mapping(string => PriceData) public prices;

    // Price feed addresses for Rootstock
    mapping(string => address) public priceFeedAddresses;

    // Events
    event PriceUpdated(string indexed asset, int256 price, uint256 timestamp);
    event PriceFeedUpdated(string indexed asset, address indexed newFeed);
    event FallbackPriceSet(string indexed asset, int256 price);

    // Errors
    error InvalidPriceFeed();
    error StalePrice();
    error InvalidAsset();
    error PriceFeedNotSet();

    // Constants
    uint256 public constant MAX_PRICE_AGE = 3600; // 1 hour
    uint256 public constant PRICE_DECIMALS = 8;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);

        // Initialize with placeholder addresses - these will be set to actual Chainlink feeds
        // For Rootstock, we'll use mock addresses initially
        priceFeedAddresses["rBTC"] = address(0);
        priceFeedAddresses["USDT"] = address(0);
    }

    /**
     * @dev Set Chainlink price feed address for an asset
     * @param asset Asset symbol (e.g., "rBTC", "USDT")
     * @param priceFeedAddress Chainlink price feed contract address
     */
    function setPriceFeed(
        string calldata asset,
        address priceFeedAddress
    ) external onlyRole(MANAGER_ROLE) {
        if (priceFeedAddress == address(0)) revert InvalidPriceFeed();

        priceFeedAddresses[asset] = priceFeedAddress;

        if (keccak256(bytes(asset)) == keccak256(bytes("rBTC"))) {
            rBTCPriceFeed = AggregatorV3Interface(priceFeedAddress);
        } else if (keccak256(bytes(asset)) == keccak256(bytes("USDT"))) {
            usdtPriceFeed = AggregatorV3Interface(priceFeedAddress);
        }

        emit PriceFeedUpdated(asset, priceFeedAddress);
    }

    /**
     * @dev Get rBTC price from Chainlink
     * @return price rBTC price in USD with 8 decimals
     */
    function getRBTCPrice() external view returns (int256 price) {
        if (address(rBTCPriceFeed) == address(0)) {
            // Return fallback price if Chainlink feed not set
            PriceData memory fallbackPrice = prices["rBTC"];
            if (!fallbackPrice.isValid) revert PriceFeedNotSet();
            return fallbackPrice.price;
        }

        try rBTCPriceFeed.latestRoundData() returns (
            uint80,
            int256 answer,
            uint256,
            uint256 updatedAt,
            uint80
        ) {
            if (block.timestamp - updatedAt > MAX_PRICE_AGE)
                revert StalePrice();
            return answer;
        } catch {
            // Fallback to stored price
            PriceData memory fallbackPrice = prices["rBTC"];
            if (!fallbackPrice.isValid) revert PriceFeedNotSet();
            return fallbackPrice.price;
        }
    }

    /**
     * @dev Get USDT price from Chainlink
     * @return price USDT price in USD with 8 decimals
     */
    function getUSDTPrice() external view returns (int256 price) {
        if (address(usdtPriceFeed) == address(0)) {
            // Return fallback price if Chainlink feed not set
            PriceData memory fallbackPrice = prices["USDT"];
            if (!fallbackPrice.isValid) revert PriceFeedNotSet();
            return fallbackPrice.price;
        }

        try usdtPriceFeed.latestRoundData() returns (
            uint80,
            int256 answer,
            uint256,
            uint256 updatedAt,
            uint80
        ) {
            if (block.timestamp - updatedAt > MAX_PRICE_AGE)
                revert StalePrice();
            return answer;
        } catch {
            // Fallback to stored price
            PriceData memory fallbackPrice = prices["USDT"];
            if (!fallbackPrice.isValid) revert PriceFeedNotSet();
            return fallbackPrice.price;
        }
    }

    /**
     * @dev Get rBTC to USDT ratio
     * @return ratio rBTC/USDT ratio with 8 decimals
     */
    function getRBTCToUSDTRatio() external view returns (uint256 ratio) {
        int256 rbtcPrice = this.getRBTCPrice();
        int256 usdtPrice = this.getUSDTPrice();

        if (rbtcPrice <= 0 || usdtPrice <= 0) revert InvalidPriceFeed();

        // Calculate ratio: (rBTC price * 10^8) / (USDT price * 10^8)
        return
            (uint256(rbtcPrice) * (10 ** PRICE_DECIMALS)) / uint256(usdtPrice);
    }

    /**
     * @dev Set fallback price for an asset (when Chainlink is unavailable)
     * @param asset Asset symbol
     * @param price Price in USD with 8 decimals
     */
    function setFallbackPrice(
        string calldata asset,
        int256 price
    ) external onlyRole(UPDATER_ROLE) {
        if (price <= 0) revert InvalidPriceFeed();

        prices[asset] = PriceData({
            price: price,
            timestamp: block.timestamp,
            decimals: 8,
            isValid: true
        });

        emit FallbackPriceSet(asset, price);
    }

    /**
     * @dev Update price from external source (for manual updates)
     * @param asset Asset symbol
     * @param price Price in USD with 8 decimals
     */
    function updatePrice(
        string calldata asset,
        int256 price
    ) external onlyRole(UPDATER_ROLE) {
        if (price <= 0) revert InvalidPriceFeed();

        prices[asset] = PriceData({
            price: price,
            timestamp: block.timestamp,
            decimals: 8,
            isValid: true
        });

        emit PriceUpdated(asset, price, block.timestamp);
    }

    /**
     * @dev Check if price is valid and not stale
     * @param asset Asset symbol
     * @return isValid True if price is valid and fresh
     */
    function isPriceValid(
        string calldata asset
    ) external view returns (bool isValid) {
        PriceData memory priceData = prices[asset];

        return
            priceData.isValid &&
            (block.timestamp - priceData.timestamp) <= MAX_PRICE_AGE;
    }

    /**
     * @dev Get price age in seconds
     * @param asset Asset symbol
     * @return age Age in seconds
     */
    function getPriceAge(
        string calldata asset
    ) external view returns (uint256 age) {
        PriceData memory priceData = prices[asset];
        return block.timestamp - priceData.timestamp;
    }

    /**
     * @dev Get price feed address for an asset
     * @param asset Asset symbol
     * @return feedAddress Price feed contract address
     */
    function getPriceFeedAddress(
        string calldata asset
    ) external view returns (address feedAddress) {
        return priceFeedAddresses[asset];
    }

    /**
     * @dev Emergency pause (only admin)
     */
    function emergencyPause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause (only admin)
     */
    function emergencyUnpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
