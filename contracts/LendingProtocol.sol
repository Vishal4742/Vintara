// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./PythOracle.sol";
import "./ENSResolver.sol";

/**
 * @title LendingProtocol
 * @dev Collateralized lending protocol for BitcoinYield on Rootstock
 * @notice Enables users to borrow against rBTC collateral with dynamic interest rates
 */
contract LendingProtocol is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;

    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant LIQUIDATOR_ROLE = keccak256("LIQUIDATOR_ROLE");

    // Constants
    uint256 public constant COLLATERAL_FACTOR = 15000; // 150% (15000 basis points)
    uint256 public constant LIQUIDATION_THRESHOLD = 12000; // 120% (12000 basis points)
    uint256 public constant MAX_LTV = 8000; // 80% (8000 basis points)

    // State variables
    IERC20 public immutable rBTC;
    IERC20 public immutable borrowToken; // USDT or DAI
    PythOracle public immutable pythOracle;
    ENSResolver public immutable ensResolver;

    uint256 public totalBorrowed;
    uint256 public totalCollateral;
    uint256 public borrowRate; // Annual borrow rate in basis points
    uint256 public supplyRate; // Annual supply rate in basis points
    uint256 public dynamicBorrowRate; // Dynamic borrow rate based on market conditions
    uint256 public dynamicSupplyRate; // Dynamic supply rate based on market conditions

    // User positions
    struct Position {
        uint256 collateral;
        uint256 borrowed;
        uint256 lastUpdateTime;
        bool exists;
    }

    mapping(address => Position) public positions;
    mapping(address => uint256) public borrowIndex; // For interest calculation

    // Events
    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event Liquidated(
        address indexed user,
        address indexed liquidator,
        uint256 collateralSeized,
        uint256 debtRepaid
    );
    event InterestRatesUpdated(uint256 newBorrowRate, uint256 newSupplyRate);
    event DynamicInterestRatesUpdated(
        uint256 newBorrowRate,
        uint256 newSupplyRate
    );
    event ENSBorrowed(
        string indexed ensName,
        address indexed resolvedAddress,
        uint256 amount
    );
    event ENSRepaid(
        string indexed ensName,
        address indexed resolvedAddress,
        uint256 amount
    );

    // Errors
    error InsufficientCollateral();
    error InsufficientLiquidity();
    error PositionNotHealthy();
    error InvalidAmount();
    error Unauthorized();

    constructor(
        address _rBTC,
        address _borrowToken,
        address _pythOracle,
        address _ensResolver
    ) {
        rBTC = IERC20(_rBTC);
        borrowToken = IERC20(_borrowToken);
        pythOracle = PythOracle(_pythOracle);
        ensResolver = ENSResolver(_ensResolver);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(LIQUIDATOR_ROLE, msg.sender);

        borrowRate = 800; // 8% initial borrow rate
        supplyRate = 600; // 6% initial supply rate
        dynamicBorrowRate = 800; // 8% initial dynamic borrow rate
        dynamicSupplyRate = 600; // 6% initial dynamic supply rate
    }

    /**
     * @dev Deposit collateral
     * @param amount Amount of rBTC to deposit as collateral
     */
    function depositCollateral(
        uint256 amount
    ) external nonReentrant whenNotPaused {
        if (amount == 0) revert InvalidAmount();

        // Update position
        if (positions[msg.sender].exists) {
            _updateInterest(msg.sender);
        } else {
            positions[msg.sender].exists = true;
            positions[msg.sender].lastUpdateTime = block.timestamp;
        }

        positions[msg.sender].collateral = positions[msg.sender].collateral + amount;
        totalCollateral = totalCollateral + amount;

        // Transfer rBTC from user
        rBTC.safeTransferFrom(msg.sender, address(this), amount);

        emit CollateralDeposited(msg.sender, amount);
    }

    /**
     * @dev Withdraw collateral
     * @param amount Amount of rBTC to withdraw
     */
    function withdrawCollateral(uint256 amount) external nonReentrant {
        if (amount == 0 || amount > positions[msg.sender].collateral)
            revert InvalidAmount();

        _updateInterest(msg.sender);

        // Check if position remains healthy after withdrawal
        uint256 newCollateral = positions[msg.sender].collateral - amount;
        if (positions[msg.sender].borrowed > 0) {
            uint256 healthFactor = _calculateHealthFactor(
                newCollateral,
                positions[msg.sender].borrowed
            );
            if (healthFactor < LIQUIDATION_THRESHOLD)
                revert PositionNotHealthy();
        }

        positions[msg.sender].collateral = newCollateral;
        totalCollateral = totalCollateral - amount;

        // Transfer rBTC to user
        rBTC.safeTransfer(msg.sender, amount);

        emit CollateralWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Borrow tokens against collateral
     * @param amount Amount to borrow
     */
    function borrow(uint256 amount) external nonReentrant whenNotPaused {
        if (amount == 0) revert InvalidAmount();

        _updateInterest(msg.sender);

        // Check if user has enough collateral
        uint256 maxBorrow = (positions[msg.sender].collateral * MAX_LTV) / 10000;
        if (positions[msg.sender].borrowed + amount > maxBorrow)
            revert InsufficientCollateral();

        // Check if protocol has enough liquidity
        if (amount > _getAvailableLiquidity()) revert InsufficientLiquidity();

        positions[msg.sender].borrowed = positions[msg.sender].borrowed + amount;
        totalBorrowed = totalBorrowed + amount;

        // Transfer borrow token to user
        borrowToken.safeTransfer(msg.sender, amount);

        emit Borrowed(msg.sender, amount);
    }

    /**
     * @dev Repay borrowed amount
     * @param amount Amount to repay
     */
    function repay(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        _updateInterest(msg.sender);

        uint256 debt = positions[msg.sender].borrowed;
        if (amount > debt) amount = debt;

        positions[msg.sender].borrowed = debt - amount;
        totalBorrowed = totalBorrowed - amount;

        // Transfer borrow token from user
        borrowToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Repaid(msg.sender, amount);
    }

    /**
     * @dev Liquidate unhealthy position
     * @param user User to liquidate
     * @param repayAmount Amount of debt to repay
     */
    function liquidate(
        address user,
        uint256 repayAmount
    ) external nonReentrant onlyRole(LIQUIDATOR_ROLE) {
        _updateInterest(user);

        uint256 healthFactor = _calculateHealthFactor(
            positions[user].collateral,
            positions[user].borrowed
        );
        if (healthFactor >= LIQUIDATION_THRESHOLD) revert PositionNotHealthy();

        if (repayAmount > positions[user].borrowed)
            repayAmount = positions[user].borrowed;

        // Calculate collateral to seize (with liquidation bonus)
        uint256 collateralSeized = (repayAmount * 11000) / 10000; // 10% bonus

        if (collateralSeized > positions[user].collateral) {
            collateralSeized = positions[user].collateral;
        }

        // Update positions
        positions[user].borrowed = positions[user].borrowed - repayAmount;
        positions[user].collateral = positions[user].collateral - collateralSeized;
        totalBorrowed = totalBorrowed - repayAmount;
        totalCollateral = totalCollateral - collateralSeized;

        // Transfer tokens
        borrowToken.safeTransferFrom(msg.sender, address(this), repayAmount);
        rBTC.safeTransfer(msg.sender, collateralSeized);

        emit Liquidated(user, msg.sender, collateralSeized, repayAmount);
    }

    /**
     * @dev Update interest rates (only manager)
     * @param newBorrowRate New borrow rate in basis points
     * @param newSupplyRate New supply rate in basis points
     */
    function updateInterestRates(
        uint256 newBorrowRate,
        uint256 newSupplyRate
    ) external onlyRole(MANAGER_ROLE) {
        borrowRate = newBorrowRate;
        supplyRate = newSupplyRate;
        emit InterestRatesUpdated(newBorrowRate, newSupplyRate);
    }

    /**
     * @dev Update dynamic interest rates based on market conditions (only manager)
     * @param newBorrowRate New dynamic borrow rate in basis points
     * @param newSupplyRate New dynamic supply rate in basis points
     */
    function updateDynamicInterestRates(
        uint256 newBorrowRate,
        uint256 newSupplyRate
    ) external onlyRole(MANAGER_ROLE) {
        dynamicBorrowRate = newBorrowRate;
        dynamicSupplyRate = newSupplyRate;
        emit DynamicInterestRatesUpdated(newBorrowRate, newSupplyRate);
    }

    /**
     * @dev Calculate and update dynamic interest rates based on PyTH price feeds
     * This function adjusts rates based on rBTC price volatility and market conditions
     */
    function updateRatesBasedOnMarketConditions()
        external
        onlyRole(MANAGER_ROLE)
    {
        try pythOracle.getRBTCToUSDTRatio() returns (uint256 ratio) {
            // Base rates
            uint256 baseBorrowRate = borrowRate;
            uint256 baseSupplyRate = supplyRate;

            // Adjust rates based on rBTC/USDT ratio
            // Higher ratio = higher demand for rBTC = higher borrow rates
            uint256 borrowAdjustment = 0;
            uint256 supplyAdjustment = 0;

            // Example adjustments based on ratio
            if (ratio > 50000 * 10 ** 8) {
                // rBTC > $50,000
                borrowAdjustment = 100; // 1% increase
                supplyAdjustment = 50; // 0.5% increase
            } else if (ratio < 30000 * 10 ** 8) {
                // rBTC < $30,000
                borrowAdjustment = 50; // 0.5% decrease
                supplyAdjustment = 25; // 0.25% decrease
            }

            // Calculate new dynamic rates
            uint256 newBorrowRate = baseBorrowRate + borrowAdjustment;
            uint256 newSupplyRate = baseSupplyRate + supplyAdjustment;

            // Ensure rates are within reasonable bounds
            if (newBorrowRate < 200) newBorrowRate = 200; // Min 2%
            if (newBorrowRate > 2000) newBorrowRate = 2000; // Max 20%
            if (newSupplyRate < 100) newSupplyRate = 100; // Min 1%
            if (newSupplyRate > 1500) newSupplyRate = 1500; // Max 15%

            dynamicBorrowRate = newBorrowRate;
            dynamicSupplyRate = newSupplyRate;
            emit DynamicInterestRatesUpdated(newBorrowRate, newSupplyRate);
        } catch {
            // If PyTH oracle fails, keep current dynamic rates
        }
    }

    /**
     * @dev Borrow tokens using ENS name
     * @param ensName ENS name (e.g., "user.vintara.eth")
     * @param amount Amount to borrow
     */
    function borrowWithENS(
        string calldata ensName,
        uint256 amount
    ) external nonReentrant whenNotPaused {
        if (amount == 0) revert InvalidAmount();

        // Resolve ENS name to address
        address resolvedAddress = ensResolver.resolveENSNameString(ensName);

        // Use resolved address for borrowing
        _updateInterest(resolvedAddress);

        // Check if user has enough collateral
        uint256 maxBorrow = positions[resolvedAddress]
            .collateral * MAX_LTV) / 10000;
        if (positions[resolvedAddress].borrowed + amount > maxBorrow)
            revert InsufficientCollateral();

        // Check if protocol has enough liquidity
        if (amount > _getAvailableLiquidity()) revert InsufficientLiquidity();

        positions[resolvedAddress].borrowed = positions[resolvedAddress].borrowed + amount;
        totalBorrowed = totalBorrowed + amount;

        // Transfer borrow token to msg.sender (the caller)
        borrowToken.safeTransfer(msg.sender, amount);

        emit Borrowed(resolvedAddress, amount);
        emit ENSBorrowed(ensName, resolvedAddress, amount);
    }

    /**
     * @dev Repay borrowed amount using ENS name
     * @param ensName ENS name (e.g., "user.vintara.eth")
     * @param amount Amount to repay
     */
    function repayWithENS(
        string calldata ensName,
        uint256 amount
    ) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        // Resolve ENS name to address
        address resolvedAddress = ensResolver.resolveENSNameString(ensName);

        _updateInterest(resolvedAddress);

        uint256 debt = positions[resolvedAddress].borrowed;
        if (amount > debt) amount = debt;

        positions[resolvedAddress].borrowed = debt - amount;
        totalBorrowed = totalBorrowed - amount;

        // Transfer borrow token from msg.sender (the caller)
        borrowToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Repaid(resolvedAddress, amount);
        emit ENSRepaid(ensName, resolvedAddress, amount);
    }

    /**
     * @dev Get user's health factor
     * @param user User address
     * @return healthFactor Health factor in basis points
     */
    function getHealthFactor(
        address user
    ) external view returns (uint256 healthFactor) {
        _updateInterest(user);
        return
            _calculateHealthFactor(
                positions[user].collateral,
                positions[user].borrowed
            );
    }

    /**
     * @dev Get user's position info
     * @param user User address
     * @return collateral Collateral amount
     * @return borrowed Borrowed amount
     * @return healthFactor Health factor
     */
    function getPosition(
        address user
    )
        external
        view
        returns (uint256 collateral, uint256 borrowed, uint256 healthFactor)
    {
        collateral = positions[user].collateral;
        borrowed = positions[user].borrowed;
        healthFactor = _calculateHealthFactor(collateral, borrowed);
    }

    /**
     * @dev Calculate health factor
     * @param collateral Collateral amount
     * @param borrowed Borrowed amount
     * @return healthFactor Health factor in basis points
     */
    function _calculateHealthFactor(
        uint256 collateral,
        uint256 borrowed
    ) internal pure returns (uint256 healthFactor) {
        if (borrowed == 0) return type(uint256).max;
        return (collateral * 10000) / borrowed;
    }

    /**
     * @dev Update interest for a user
     * @param user User address
     */
    function _updateInterest(address user) internal {
        if (!positions[user].exists) return;

        uint256 timeElapsed = block.timestamp - positions[user].lastUpdateTime;
        if (timeElapsed == 0) return;

        // Use dynamic borrow rate if available, otherwise use base rate
        uint256 currentBorrowRate = dynamicBorrowRate > 0
            ? dynamicBorrowRate
            : borrowRate;

        uint256 interest = (positions[user].borrowed * currentBorrowRate * timeElapsed) / (365 days * 10000);
        positions[user].borrowed = positions[user].borrowed + interest;
        positions[user].lastUpdateTime = block.timestamp;
    }

    /**
     * @dev Get available liquidity for borrowing
     * @return liquidity Available liquidity
     */
    function _getAvailableLiquidity()
        internal
        view
        returns (uint256 liquidity)
    {
        return borrowToken.balanceOf(address(this)) - totalBorrowed;
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
}
