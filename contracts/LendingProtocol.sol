// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title LendingProtocol
 * @dev Collateralized lending protocol for BitcoinYield on Rootstock
 * @notice Enables users to borrow against rBTC collateral with dynamic interest rates
 */
contract LendingProtocol is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

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

    uint256 public totalBorrowed;
    uint256 public totalCollateral;
    uint256 public borrowRate; // Annual borrow rate in basis points
    uint256 public supplyRate; // Annual supply rate in basis points

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

    // Errors
    error InsufficientCollateral();
    error InsufficientLiquidity();
    error PositionNotHealthy();
    error InvalidAmount();
    error Unauthorized();

    constructor(address _rBTC, address _borrowToken) {
        rBTC = IERC20(_rBTC);
        borrowToken = IERC20(_borrowToken);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(LIQUIDATOR_ROLE, msg.sender);

        borrowRate = 800; // 8% initial borrow rate
        supplyRate = 600; // 6% initial supply rate
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

        positions[msg.sender].collateral = positions[msg.sender].collateral.add(
            amount
        );
        totalCollateral = totalCollateral.add(amount);

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
        uint256 newCollateral = positions[msg.sender].collateral.sub(amount);
        if (positions[msg.sender].borrowed > 0) {
            uint256 healthFactor = _calculateHealthFactor(
                newCollateral,
                positions[msg.sender].borrowed
            );
            if (healthFactor < LIQUIDATION_THRESHOLD)
                revert PositionNotHealthy();
        }

        positions[msg.sender].collateral = newCollateral;
        totalCollateral = totalCollateral.sub(amount);

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
        uint256 maxBorrow = positions[msg.sender].collateral.mul(MAX_LTV).div(
            10000
        );
        if (positions[msg.sender].borrowed.add(amount) > maxBorrow)
            revert InsufficientCollateral();

        // Check if protocol has enough liquidity
        if (amount > _getAvailableLiquidity()) revert InsufficientLiquidity();

        positions[msg.sender].borrowed = positions[msg.sender].borrowed.add(
            amount
        );
        totalBorrowed = totalBorrowed.add(amount);

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

        positions[msg.sender].borrowed = debt.sub(amount);
        totalBorrowed = totalBorrowed.sub(amount);

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
        uint256 collateralSeized = repayAmount.mul(11000).div(10000); // 10% bonus

        if (collateralSeized > positions[user].collateral) {
            collateralSeized = positions[user].collateral;
        }

        // Update positions
        positions[user].borrowed = positions[user].borrowed.sub(repayAmount);
        positions[user].collateral = positions[user].collateral.sub(
            collateralSeized
        );
        totalBorrowed = totalBorrowed.sub(repayAmount);
        totalCollateral = totalCollateral.sub(collateralSeized);

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
        return collateral.mul(10000).div(borrowed);
    }

    /**
     * @dev Update interest for a user
     * @param user User address
     */
    function _updateInterest(address user) internal {
        if (!positions[user].exists) return;

        uint256 timeElapsed = block.timestamp.sub(
            positions[user].lastUpdateTime
        );
        if (timeElapsed == 0) return;

        uint256 interest = positions[user]
            .borrowed
            .mul(borrowRate)
            .mul(timeElapsed)
            .div(365 days)
            .div(10000);
        positions[user].borrowed = positions[user].borrowed.add(interest);
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
        return borrowToken.balanceOf(address(this)).sub(totalBorrowed);
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
