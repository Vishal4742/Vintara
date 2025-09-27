// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title YieldVault
 * @dev Main vault contract for BitcoinYield protocol on Rootstock
 * @notice Enables users to deposit rBTC and earn yield through automated strategies
 */
contract YieldVault is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant STRATEGY_ROLE = keccak256("STRATEGY_ROLE");

    // State variables
    IERC20 public immutable rBTC;
    uint256 public totalAssets;
    uint256 public totalSupply;
    uint256 public lastUpdateTime;
    uint256 public yieldRate; // Annual yield rate in basis points (10000 = 100%)

    // User balances
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lastClaimTime;

    // Events
    event Deposited(address indexed user, uint256 amount, uint256 shares);
    event Withdrawn(address indexed user, uint256 amount, uint256 shares);
    event YieldClaimed(address indexed user, uint256 amount);
    event YieldRateUpdated(uint256 newRate);
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

    constructor(address _rBTC) {
        rBTC = IERC20(_rBTC);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(STRATEGY_ROLE, msg.sender);

        lastUpdateTime = block.timestamp;
        yieldRate = 1000; // 10% initial APY
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
            : amount.mul(totalSupply).div(totalAssets);

        // Update user balance and total supply
        balances[msg.sender] = balances[msg.sender].add(shares);
        totalSupply = totalSupply.add(shares);
        totalAssets = totalAssets.add(amount);

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
        amount = shares.mul(totalAssets).div(totalSupply);

        // Update balances
        balances[msg.sender] = balances[msg.sender].sub(shares);
        totalSupply = totalSupply.sub(shares);
        totalAssets = totalAssets.sub(amount);

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
            : yield.mul(totalSupply).div(totalAssets);
        balances[msg.sender] = balances[msg.sender].add(newShares);
        totalSupply = totalSupply.add(newShares);
        totalAssets = totalAssets.add(yield);

        emit YieldClaimed(msg.sender, yield);
    }

    /**
     * @dev Calculate yield for a user
     * @param user User address
     * @return yield Amount of yield earned
     */
    function calculateYield(address user) public view returns (uint256 yield) {
        if (balances[user] == 0) return 0;

        uint256 timeElapsed = block.timestamp.sub(lastClaimTime[user]);
        uint256 userAssets = balances[user].mul(totalAssets).div(totalSupply);

        // Calculate yield: (assets * rate * time) / (365 days * 10000)
        yield = userAssets.mul(yieldRate).mul(timeElapsed).div(365 days).div(
            10000
        );
    }

    /**
     * @dev Get user's total balance including yield
     * @param user User address
     * @return total Total balance in rBTC
     */
    function getTotalBalance(
        address user
    ) external view returns (uint256 total) {
        uint256 baseBalance = balances[user].mul(totalAssets).div(totalSupply);
        uint256 pendingYield = calculateYield(user);
        return baseBalance.add(pendingYield);
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
        uint256 profit = amount.mul(100).div(10000); // 1% profit simulation

        // Transfer profit back
        rBTC.safeTransferFrom(strategy, address(this), amount.add(profit));

        // Update total assets
        totalAssets = totalAssets.add(profit);

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
