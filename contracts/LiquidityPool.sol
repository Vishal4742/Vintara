// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title LiquidityPool
 * @dev Automated Market Maker (AMM) for BitcoinYield on Rootstock
 * @notice Implements Uniswap V2 style constant product formula with yield generation
 */
contract LiquidityPool is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    // Constants
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public constant PROTOCOL_FEE = 30; // 0.3%
    uint256 public constant MINIMUM_LIQUIDITY = 1000; // Minimum liquidity to prevent division by zero

    // State variables
    IERC20 public immutable token0;
    IERC20 public immutable token1;
    uint256 public reserve0;
    uint256 public reserve1;
    uint256 public totalSupply;
    uint256 public kLast; // K value at last liquidity event

    // User balances
    mapping(address => uint256) public balances;

    // Fee tracking
    uint256 public protocolFees0;
    uint256 public protocolFees1;

    // Events
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(
        address indexed sender,
        uint256 amount0,
        uint256 amount1,
        address indexed to
    );
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );
    event Sync(uint256 reserve0, uint256 reserve1);
    event FeesCollected(uint256 fee0, uint256 fee1);

    // Errors
    error InsufficientLiquidity();
    error InsufficientOutputAmount();
    error InsufficientInputAmount();
    error InsufficientLiquidityMinted();
    error TransferFailed();
    error InvalidAmount();

    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Add liquidity to the pool
     * @param amount0 Amount of token0 to add
     * @param amount1 Amount of token1 to add
     * @param to Address to receive LP tokens
     * @return liquidity Amount of LP tokens minted
     */
    function addLiquidity(
        uint256 amount0,
        uint256 amount1,
        address to
    ) external nonReentrant whenNotPaused returns (uint256 liquidity) {
        if (amount0 == 0 || amount1 == 0) revert InvalidAmount();

        uint256 _reserve0 = reserve0;
        uint256 _reserve1 = reserve1;

        if (_reserve0 == 0 && _reserve1 == 0) {
            // First liquidity provision
            liquidity = amount0.mul(amount1).sqrt().sub(MINIMUM_LIQUIDITY);
            _mint(address(0), MINIMUM_LIQUIDITY); // Permanently lock first liquidity
        } else {
            // Calculate liquidity based on existing reserves
            liquidity = Math.min(
                amount0.mul(totalSupply).div(_reserve0),
                amount1.mul(totalSupply).div(_reserve1)
            );
        }

        if (liquidity == 0) revert InsufficientLiquidityMinted();

        _mint(to, liquidity);
        _update(amount0, amount1, _reserve0, _reserve1);

        // Transfer tokens from user
        token0.safeTransferFrom(msg.sender, address(this), amount0);
        token1.safeTransferFrom(msg.sender, address(this), amount1);

        emit Mint(msg.sender, amount0, amount1);
        return liquidity;
    }

    /**
     * @dev Remove liquidity from the pool
     * @param liquidity Amount of LP tokens to burn
     * @param to Address to receive tokens
     * @return amount0 Amount of token0 received
     * @return amount1 Amount of token1 received
     */
    function removeLiquidity(
        uint256 liquidity,
        address to
    ) external nonReentrant returns (uint256 amount0, uint256 amount1) {
        if (liquidity == 0) revert InvalidAmount();

        uint256 _totalSupply = totalSupply;
        amount0 = liquidity.mul(reserve0).div(_totalSupply);
        amount1 = liquidity.mul(reserve1).div(_totalSupply);

        if (amount0 == 0 || amount1 == 0) revert InsufficientLiquidity();

        _burn(msg.sender, liquidity);
        _update(amount0, amount1, reserve0, reserve1);

        // Transfer tokens to user
        token0.safeTransfer(to, amount0);
        token1.safeTransfer(to, amount1);

        emit Burn(msg.sender, amount0, amount1, to);
        return (amount0, amount1);
    }

    /**
     * @dev Swap tokens
     * @param amount0Out Amount of token0 to output
     * @param amount1Out Amount of token1 to output
     * @param to Address to receive output tokens
     * @param data Additional data (for flash swaps)
     */
    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to,
        bytes calldata data
    ) external nonReentrant whenNotPaused {
        if (amount0Out == 0 && amount1Out == 0)
            revert InsufficientOutputAmount();
        if (amount0Out >= reserve0 || amount1Out >= reserve1)
            revert InsufficientLiquidity();

        uint256 _reserve0 = reserve0;
        uint256 _reserve1 = reserve1;

        // Calculate input amounts
        uint256 amount0In = amount0Out > 0
            ? _getAmountIn(amount0Out, _reserve1, _reserve0)
            : 0;
        uint256 amount1In = amount1Out > 0
            ? _getAmountIn(amount1Out, _reserve0, _reserve1)
            : 0;

        if (amount0In == 0 && amount1In == 0) revert InsufficientInputAmount();

        // Calculate fees
        uint256 fee0 = amount0In.mul(PROTOCOL_FEE).div(FEE_DENOMINATOR);
        uint256 fee1 = amount1In.mul(PROTOCOL_FEE).div(FEE_DENOMINATOR);

        // Update reserves
        uint256 balance0 = _reserve0.add(amount0In).sub(amount0Out);
        uint256 balance1 = _reserve1.add(amount1In).sub(amount1Out);

        // Check K constraint
        uint256 balance0Adjusted = balance0.mul(10000).sub(fee0);
        uint256 balance1Adjusted = balance1.mul(10000).sub(fee1);

        if (
            balance0Adjusted.mul(balance1Adjusted) <
            _reserve0.mul(_reserve1).mul(10000 ** 2)
        ) {
            revert InsufficientLiquidity();
        }

        _update(balance0, balance1, _reserve0, _reserve1);

        // Transfer output tokens
        if (amount0Out > 0) token0.safeTransfer(to, amount0Out);
        if (amount1Out > 0) token1.safeTransfer(to, amount1Out);

        // Transfer input tokens
        if (amount0In > 0)
            token0.safeTransferFrom(msg.sender, address(this), amount0In);
        if (amount1In > 0)
            token1.safeTransferFrom(msg.sender, address(this), amount1In);

        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    /**
     * @dev Get amount out for a given input
     * @param amountIn Input amount
     * @param reserveIn Input reserve
     * @param reserveOut Output reserve
     * @return amountOut Output amount
     */
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountOut) {
        if (amountIn == 0) revert InsufficientInputAmount();
        if (reserveIn == 0 || reserveOut == 0) revert InsufficientLiquidity();

        uint256 amountInWithFee = amountIn.mul(9970); // 0.3% fee
        uint256 numerator = amountInWithFee.mul(reserveOut);
        uint256 denominator = reserveIn.mul(10000).add(amountInWithFee);

        return numerator.div(denominator);
    }

    /**
     * @dev Get amount in for a given output
     * @param amountOut Output amount
     * @param reserveIn Input reserve
     * @param reserveOut Output reserve
     * @return amountIn Input amount
     */
    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountIn) {
        if (amountOut == 0) revert InsufficientOutputAmount();
        if (reserveIn == 0 || reserveOut == 0) revert InsufficientLiquidity();

        uint256 numerator = reserveIn.mul(amountOut).mul(10000);
        uint256 denominator = reserveOut.sub(amountOut).mul(9970);

        return numerator.div(denominator).add(1);
    }

    /**
     * @dev Collect protocol fees
     */
    function collectFees() external onlyRole(MANAGER_ROLE) {
        uint256 fee0 = protocolFees0;
        uint256 fee1 = protocolFees1;

        if (fee0 > 0) {
            protocolFees0 = 0;
            token0.safeTransfer(msg.sender, fee0);
        }

        if (fee1 > 0) {
            protocolFees1 = 0;
            token1.safeTransfer(msg.sender, fee1);
        }

        emit FeesCollected(fee0, fee1);
    }

    /**
     * @dev Get current reserves
     * @return _reserve0 Reserve of token0
     * @return _reserve1 Reserve of token1
     */
    function getReserves()
        external
        view
        returns (uint256 _reserve0, uint256 _reserve1)
    {
        return (reserve0, reserve1);
    }

    /**
     * @dev Get user's LP token balance
     * @param user User address
     * @return balance LP token balance
     */
    function getBalance(address user) external view returns (uint256 balance) {
        return balances[user];
    }

    /**
     * @dev Internal function to mint LP tokens
     * @param to Address to mint to
     * @param amount Amount to mint
     */
    function _mint(address to, uint256 amount) internal {
        balances[to] = balances[to].add(amount);
        totalSupply = totalSupply.add(amount);
    }

    /**
     * @dev Internal function to burn LP tokens
     * @param from Address to burn from
     * @param amount Amount to burn
     */
    function _burn(address from, uint256 amount) internal {
        balances[from] = balances[from].sub(amount);
        totalSupply = totalSupply.sub(amount);
    }

    /**
     * @dev Internal function to update reserves
     * @param balance0 New balance of token0
     * @param balance1 New balance of token1
     * @param _reserve0 Old reserve of token0
     * @param _reserve1 Old reserve of token1
     */
    function _update(
        uint256 balance0,
        uint256 balance1,
        uint256 _reserve0,
        uint256 _reserve1
    ) internal {
        reserve0 = balance0;
        reserve1 = balance1;
        emit Sync(balance0, balance1);
    }

    /**
     * @dev Internal function to get amount in
     * @param amountOut Output amount
     * @param reserveIn Input reserve
     * @param reserveOut Output reserve
     * @return amountIn Input amount
     */
    function _getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256 amountIn) {
        uint256 numerator = reserveIn.mul(amountOut).mul(10000);
        uint256 denominator = reserveOut.sub(amountOut).mul(9970);
        return numerator.div(denominator).add(1);
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

// Math library for square root calculation
library Math {
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}
