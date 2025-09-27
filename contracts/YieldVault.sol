// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ChainlinkOracle.sol";

/**
 * @title YieldVault
 * @dev Main vault contract for BitcoinYield protocol on Rootstock
 * @notice Enables users to deposit rBTC and earn yield through automated strategies
 */
contract YieldVault is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant STRATEGY_ROLE = keccak256("STRATEGY_ROLE");

    // State variables
    IERC20 public immutable rBTC;
    ChainlinkOracle public immutable chainlinkOracle;
    uint256 public totalAssets;
    uint256 public totalSupply;
    uint256 public lastUpdateTime;
    uint256 public yieldRate; // Annual yield rate in basis points (10000 = 100%)
    uint256 public dynamicYieldRate; // Dynamic yield rate based on market conditions

    // User balances
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lastClaimTime;

    // Events
    event Deposited(address indexed user, uint256 amount, uint256 shares);
    event Withdrawn(address indexed user, uint256 amount, uint256 shares);
    event YieldClaimed(address indexed user, uint256 amount);
    event YieldRateUpdated(uint256 newRate);
    event DynamicYieldRateUpdated(uint256 newRate);
    event StrategyExecuted(
        address indexed strategy,
        uint256 amount,
        uint256 profit
    );

    // Errors
    error InsufficientBalance();
    error InvalidAmount();
    error Unauthorized();
    error TransferFailed();

    constructor(address _rBTC, address _chainlinkOracle) {
        rBTC = IERC20(_rBTC);
        chainlinkOracle = ChainlinkOracle(_chainlinkOracle);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(STRATEGY_ROLE, msg.sender);

        lastUpdateTime = block.timestamp;
        yieldRate = 1000; // 10% initial APY
        dynamicYieldRate = 1000; // 10% initial dynamic APY
    }

    /**
     * @dev Deposit rBTC into the vault
     * @param amount Amount of rBTC to deposit
     * @return shares Number of shares minted
     */
    function deposit(
        uint256 amount
    ) external nonReentrant whenNotPaused returns (uint256 shares) {
        if (amount == 0) revert InvalidAmount();

        // Calculate shares based on current exchange rate
        shares = totalSupply == 0
            ? amount
            : (amount * totalSupply) / totalAssets;

        // Update user balance and total supply
        balances[msg.sender] = balances[msg.sender] + shares;
        totalSupply = totalSupply + shares;
        totalAssets = totalAssets + amount;

        // Transfer rBTC from user
        rBTC.safeTransferFrom(msg.sender, address(this), amount);

        emit Deposited(msg.sender, amount, shares);
        return shares;
    }

    /**
     * @dev Withdraw rBTC from the vault
     * @param shares Number of shares to burn
     * @return amount Amount of rBTC withdrawn
     */
    function withdraw(
        uint256 shares
    ) external nonReentrant returns (uint256 amount) {
        if (shares == 0 || shares > balances[msg.sender])
            revert InvalidAmount();

        // Calculate rBTC amount based on current exchange rate
        amount = (shares * totalAssets) / totalSupply;

        // Update balances
        balances[msg.sender] = balances[msg.sender] - shares;
        totalSupply = totalSupply - shares;
        totalAssets = totalAssets - amount;

        // Transfer rBTC to user
        rBTC.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount, shares);
        return amount;
    }

    /**
     * @dev Claim accumulated yield
     */
    function claimYield() external nonReentrant {
        uint256 yield = calculateYield(msg.sender);
        if (yield == 0) return;

        lastClaimTime[msg.sender] = block.timestamp;

        // Mint new shares for yield
        uint256 newShares = totalSupply == 0
            ? yield
            : (yield * totalSupply) / totalAssets;
        balances[msg.sender] = balances[msg.sender] + newShares;
        totalSupply = totalSupply + newShares;
        totalAssets = totalAssets + yield;

        emit YieldClaimed(msg.sender, yield);
    }

    /**
     * @dev Calculate yield for a user
     * @param user User address
     * @return yield Amount of yield earned
     */
    function calculateYield(address user) public view returns (uint256 yield) {
        if (balances[user] == 0) return 0;

        uint256 timeElapsed = block.timestamp - lastClaimTime[user];
        uint256 userAssets = (balances[user] * totalAssets) / totalSupply;

        // Use dynamic yield rate if available, otherwise use base rate
        uint256 currentYieldRate = dynamicYieldRate > 0
            ? dynamicYieldRate
            : yieldRate;

        // Calculate yield: (assets * rate * time) / (365 days * 10000)
        yield =
            (userAssets * currentYieldRate * timeElapsed) /
            (365 days * 10000);
    }

    /**
     * @dev Get user's total balance including yield
     * @param user User address
     * @return total Total balance in rBTC
     */
    function getTotalBalance(
        address user
    ) external view returns (uint256 total) {
        uint256 baseBalance = (balances[user] * totalAssets) / totalSupply;
        uint256 pendingYield = calculateYield(user);
        return baseBalance + pendingYield;
    }

    /**
     * @dev Update yield rate (only manager)
     * @param newRate New annual yield rate in basis points
     */
    function updateYieldRate(uint256 newRate) external onlyRole(MANAGER_ROLE) {
        yieldRate = newRate;
        emit YieldRateUpdated(newRate);
    }

    /**
     * @dev Update dynamic yield rate based on market conditions (only manager)
     * @param newRate New dynamic annual yield rate in basis points
     */
    function updateDynamicYieldRate(
        uint256 newRate
    ) external onlyRole(MANAGER_ROLE) {
        dynamicYieldRate = newRate;
        emit DynamicYieldRateUpdated(newRate);
    }

    /**
     * @dev Calculate and update dynamic yield rate based on PyTH price feeds
     * This function adjusts yield based on rBTC price volatility and market conditions
     */
    function updateYieldBasedOnMarketConditions()
        external
        onlyRole(MANAGER_ROLE)
    {
        try chainlinkOracle.getRBTCPrice() returns (int256 rbtcPrice) {
            // Convert to uint256 for calculations
            uint256 price = uint256(rbtcPrice);

            // Base yield rate
            uint256 baseRate = yieldRate;

            // Adjust yield based on price conditions
            // Higher prices = higher yield (more demand)
            // Lower prices = lower yield (less demand)
            uint256 priceAdjustment = 0;

            // Example: If rBTC price > $50,000, increase yield by 2%
            if (price > 50000 * 10 ** 8) {
                priceAdjustment = 200; // 2% increase
            }
            // If rBTC price < $30,000, decrease yield by 1%
            else if (price < 30000 * 10 ** 8) {
                priceAdjustment = 100; // 1% decrease
            }

            // Calculate new dynamic rate
            uint256 newDynamicRate = baseRate + priceAdjustment;

            // Ensure rate is within reasonable bounds (5% to 25%)
            if (newDynamicRate < 500) newDynamicRate = 500;
            if (newDynamicRate > 2500) newDynamicRate = 2500;

            dynamicYieldRate = newDynamicRate;
            emit DynamicYieldRateUpdated(newDynamicRate);
        } catch {
            // If PyTH oracle fails, keep current dynamic rate
            // This ensures the vault continues to function
        }
    }

    /**
     * @dev Execute strategy to generate yield (only strategy role)
     * @param strategy Strategy contract address
     * @param amount Amount to invest
     * @param data Strategy-specific data
     */
    function executeStrategy(
        address strategy,
        uint256 amount,
        bytes calldata data
    ) external onlyRole(STRATEGY_ROLE) {
        if (amount > totalAssets) revert InsufficientBalance();

        // Transfer rBTC to strategy
        rBTC.safeTransfer(strategy, amount);

        // Execute strategy (this would call the strategy contract)
        // For now, we'll simulate a profit
        uint256 profit = (amount * 100) / 10000; // 1% profit simulation

        // Transfer profit back
        rBTC.safeTransferFrom(strategy, address(this), amount + profit);

        // Update total assets
        totalAssets = totalAssets + profit;

        emit StrategyExecuted(strategy, amount, profit);
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
     * @dev Get current APY
     * @return apy Current APY in basis points
     */
    function getCurrentAPY() external view returns (uint256 apy) {
        return yieldRate;
    }

    /**
     * @dev Get vault TVL
     * @return tvl Total value locked in rBTC
     */
    function getTVL() external view returns (uint256 tvl) {
        return totalAssets;
    }
}
