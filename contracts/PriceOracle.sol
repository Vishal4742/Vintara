// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title PriceOracle
 * @dev Price oracle contract for BitcoinYield protocol on Rootstock
 * @notice Provides price feeds for various tokens with fallback mechanisms
 */
contract PriceOracle is AccessControl, Pausable {
    using SafeMath for uint256;

    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant FEEDER_ROLE = keccak256("FEEDER_ROLE");

    // Price data structure
    struct PriceData {
        uint256 price; // Price in 8 decimals (e.g., 1 BTC = 50000 * 10^8)
        uint256 timestamp; // Last update timestamp
        uint256 confidence; // Confidence level (0-10000)
        bool isValid; // Whether the price is valid
    }

    // State variables
    mapping(address => PriceData) public prices;
    mapping(address => address) public priceFeeds; // Token => Price feed contract
    uint256 public constant PRICE_DECIMALS = 8;
    uint256 public constant MAX_PRICE_AGE = 3600; // 1 hour
    uint256 public constant MIN_CONFIDENCE = 5000; // 50%

    // Events
    event PriceUpdated(
        address indexed token,
        uint256 price,
        uint256 timestamp,
        uint256 confidence
    );
    event PriceFeedSet(address indexed token, address indexed feed);
    event PriceInvalidated(address indexed token);

    // Errors
    error InvalidPrice();
    error PriceTooOld();
    error LowConfidence();
    error TokenNotFound();
    error Unauthorized();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(FEEDER_ROLE, msg.sender);
    }

    /**
     * @dev Update price for a token
     * @param token Token address
     * @param price Price in 8 decimals
     * @param confidence Confidence level (0-10000)
     */
    function updatePrice(
        address token,
        uint256 price,
        uint256 confidence
    ) external onlyRole(FEEDER_ROLE) whenNotPaused {
        if (price == 0) revert InvalidPrice();
        if (confidence < MIN_CONFIDENCE) revert LowConfidence();

        prices[token] = PriceData({
            price: price,
            timestamp: block.timestamp,
            confidence: confidence,
            isValid: true
        });

        emit PriceUpdated(token, price, block.timestamp, confidence);
    }

    /**
     * @dev Batch update prices
     * @param tokens Array of token addresses
     * @param pricesArray Array of prices
     * @param confidences Array of confidence levels
     */
    function batchUpdatePrices(
        address[] calldata tokens,
        uint256[] calldata pricesArray,
        uint256[] calldata confidences
    ) external onlyRole(FEEDER_ROLE) whenNotPaused {
        if (
            tokens.length != pricesArray.length ||
            tokens.length != confidences.length
        ) {
            revert InvalidPrice();
        }

        for (uint256 i = 0; i < tokens.length; i++) {
            if (pricesArray[i] == 0) revert InvalidPrice();
            if (confidences[i] < MIN_CONFIDENCE) revert LowConfidence();

            prices[tokens[i]] = PriceData({
                price: pricesArray[i],
                timestamp: block.timestamp,
                confidence: confidences[i],
                isValid: true
            });

            emit PriceUpdated(
                tokens[i],
                pricesArray[i],
                block.timestamp,
                confidences[i]
            );
        }
    }

    /**
     * @dev Get price for a token
     * @param token Token address
     * @return price Price in 8 decimals
     */
    function getPrice(address token) external view returns (uint256 price) {
        PriceData memory priceData = prices[token];

        if (!priceData.isValid) revert TokenNotFound();
        if (block.timestamp.sub(priceData.timestamp) > MAX_PRICE_AGE)
            revert PriceTooOld();
        if (priceData.confidence < MIN_CONFIDENCE) revert LowConfidence();

        return priceData.price;
    }

    /**
     * @dev Get price with validation
     * @param token Token address
     * @return price Price in 8 decimals
     * @return timestamp Last update timestamp
     * @return confidence Confidence level
     */
    function getPriceWithValidation(
        address token
    )
        external
        view
        returns (uint256 price, uint256 timestamp, uint256 confidence)
    {
        PriceData memory priceData = prices[token];

        if (!priceData.isValid) revert TokenNotFound();
        if (block.timestamp.sub(priceData.timestamp) > MAX_PRICE_AGE)
            revert PriceTooOld();
        if (priceData.confidence < MIN_CONFIDENCE) revert LowConfidence();

        return (priceData.price, priceData.timestamp, priceData.confidence);
    }

    /**
     * @dev Get price for multiple tokens
     * @param tokens Array of token addresses
     * @return pricesArray Array of prices
     */
    function getPrices(
        address[] calldata tokens
    ) external view returns (uint256[] memory pricesArray) {
        pricesArray = new uint256[](tokens.length);

        for (uint256 i = 0; i < tokens.length; i++) {
            PriceData memory priceData = prices[tokens[i]];

            if (!priceData.isValid) revert TokenNotFound();
            if (block.timestamp.sub(priceData.timestamp) > MAX_PRICE_AGE)
                revert PriceTooOld();
            if (priceData.confidence < MIN_CONFIDENCE) revert LowConfidence();

            pricesArray[i] = priceData.price;
        }

        return pricesArray;
    }

    /**
     * @dev Calculate price ratio between two tokens
     * @param tokenA First token address
     * @param tokenB Second token address
     * @return ratio Price ratio (tokenA/tokenB)
     */
    function getPriceRatio(
        address tokenA,
        address tokenB
    ) external view returns (uint256 ratio) {
        uint256 priceA = this.getPrice(tokenA);
        uint256 priceB = this.getPrice(tokenB);

        return priceA.mul(10 ** PRICE_DECIMALS).div(priceB);
    }

    /**
     * @dev Set price feed contract for a token
     * @param token Token address
     * @param feed Price feed contract address
     */
    function setPriceFeed(
        address token,
        address feed
    ) external onlyRole(MANAGER_ROLE) {
        priceFeeds[token] = feed;
        emit PriceFeedSet(token, feed);
    }

    /**
     * @dev Invalidate price for a token
     * @param token Token address
     */
    function invalidatePrice(address token) external onlyRole(MANAGER_ROLE) {
        prices[token].isValid = false;
        emit PriceInvalidated(token);
    }

    /**
     * @dev Check if price is valid and fresh
     * @param token Token address
     * @return isValid Whether the price is valid
     */
    function isPriceValid(address token) external view returns (bool isValid) {
        PriceData memory priceData = prices[token];

        return
            priceData.isValid &&
            block.timestamp.sub(priceData.timestamp) <= MAX_PRICE_AGE &&
            priceData.confidence >= MIN_CONFIDENCE;
    }

    /**
     * @dev Get price age in seconds
     * @param token Token address
     * @return age Age in seconds
     */
    function getPriceAge(address token) external view returns (uint256 age) {
        PriceData memory priceData = prices[token];
        return block.timestamp.sub(priceData.timestamp);
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
     * @dev Update price from external feed
     * @param token Token address
     */
    function updatePriceFromFeed(address token) external {
        address feed = priceFeeds[token];
        if (feed == address(0)) revert TokenNotFound();

        // This would call the external price feed contract
        // For now, we'll simulate a price update
        // In a real implementation, this would call the Chainlink or other oracle

        // Simulate getting price from feed (this is a placeholder)
        uint256 price = 50000 * 10 ** PRICE_DECIMALS; // 50,000 USD for BTC
        uint256 confidence = 9500; // 95% confidence

        prices[token] = PriceData({
            price: price,
            timestamp: block.timestamp,
            confidence: confidence,
            isValid: true
        });

        emit PriceUpdated(token, price, block.timestamp, confidence);
    }
}
