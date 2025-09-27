// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

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

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
}

/**
 * @title LiquidityProtocol
 * @dev Automated Market Maker (AMM) for BitcoinYield on Rootstock
 * @notice Implements Uniswap V2 style constant product formula with yield generation
 */
contract LiquidityProtocol is ReentrancyGuard, Pausable, AccessControl {
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
            // First liquidity provision - use geometric mean
            liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
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
        _update(_reserve0.add(amount0), _reserve1.add(amount1), _reserve0, _reserve1);

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
        _update(reserve0.sub(amount0), reserve1.sub(amount1), reserve0, reserve1);

        // Transfer tokens to user
        token0.safeTransfer(to, amount0);
        token1.safeTransfer(to, amount1);

        emit Burn(msg.sender, amount0, amount1, to);
        return (amount0, amount1);
    }

    /**
     * @dev Swap exact tokens for tokens
     * @param amountIn Input amount
     * @param amountOutMin Minimum output amount
     * @param tokenIn Input token address
     * @param to Address to receive output tokens
     * @return amountOut Output amount
     */
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenIn,
        address to
    ) external nonReentrant whenNotPaused returns (uint256 amountOut) {
        if (amountIn == 0) revert InsufficientInputAmount();
        
        bool token0In = tokenIn == address(token0);
        if (!token0In && tokenIn != address(token1)) revert InvalidAmount();

        // Calculate output amount
        (uint256 reserveIn, uint256 reserveOut) = token0In 
            ? (reserve0, reserve1) 
            : (reserve1, reserve0);
            
        amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
        if (amountOut < amountOutMin) revert InsufficientOutputAmount();

        // Calculate and collect fees
        uint256 fee = amountIn.mul(PROTOCOL_FEE).div(FEE_DENOMINATOR);
        if (token0In) {
            protocolFees0 = protocolFees0.add(fee);
        } else {
            protocolFees1 = protocolFees1.add(fee);
        }

        // Update reserves
        if (token0In) {
            _update(reserve0.add(amountIn), reserve1.sub(amountOut), reserve0, reserve1);
            // Transfer tokens
            token0.safeTransferFrom(msg.sender, address(this), amountIn);
            token1.safeTransfer(to, amountOut);
            
            emit Swap(msg.sender, amountIn, 0, 0, amountOut, to);
        } else {
            _update(reserve0.sub(amountOut), reserve1.add(amountIn), reserve0, reserve1);
            // Transfer tokens
            token1.safeTransferFrom(msg.sender, address(this), amountIn);
            token0.safeTransfer(to, amountOut);
            
            emit Swap(msg.sender, 0, amountIn, amountOut, 0, to);
        }

        return amountOut;
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
    ) public pure returns (uint256 amountOut) {
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
    ) public pure returns (uint256 amountIn) {
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