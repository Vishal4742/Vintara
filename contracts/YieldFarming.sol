// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title YieldFarming
 * @dev Yield farming contract for BitcoinYield protocol on Rootstock
 * @notice Enables users to stake LP tokens and earn rewards
 */
contract YieldFarming is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    // Pool information
    struct PoolInfo {
        IERC20 lpToken; // LP token contract
        uint256 allocPoint; // Allocation points for this pool
        uint256 lastRewardTime; // Last time reward was distributed
        uint256 accRewardPerShare; // Accumulated rewards per share
        uint256 totalStaked; // Total amount staked in this pool
        bool isActive; // Whether the pool is active
    }

    // User information
    struct UserInfo {
        uint256 amount; // Amount of LP tokens staked
        uint256 rewardDebt; // Reward debt
        uint256 pendingRewards; // Pending rewards
        uint256 lastClaimTime; // Last time user claimed rewards
    }

    // State variables
    IERC20 public immutable rewardToken; // VINT token
    uint256 public rewardPerSecond; // Reward tokens per second
    uint256 public totalAllocPoint; // Total allocation points
    uint256 public startTime; // Farming start time
    uint256 public endTime; // Farming end time

    // Pool and user data
    PoolInfo[] public poolInfo;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;

    // Events
    event PoolAdded(
        uint256 indexed pid,
        address indexed lpToken,
        uint256 allocPoint
    );
    event PoolUpdated(uint256 indexed pid, uint256 allocPoint);
    event Deposited(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdrawn(address indexed user, uint256 indexed pid, uint256 amount);
    event RewardsClaimed(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );
    event RewardRateUpdated(uint256 newRate);

    // Errors
    error PoolNotFound();
    error PoolNotActive();
    error InsufficientBalance();
    error InvalidAmount();
    error FarmingNotStarted();
    error FarmingEnded();

    constructor(address _rewardToken) {
        rewardToken = IERC20(_rewardToken);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);

        startTime = block.timestamp;
        endTime = startTime.add(365 days); // 1 year farming period
        rewardPerSecond = 1000000000000000000; // 1 VINT per second
    }

    /**
     * @dev Add a new pool
     * @param _lpToken LP token contract address
     * @param _allocPoint Allocation points for this pool
     * @param _withUpdate Whether to update all pools
     */
    function addPool(
        address _lpToken,
        uint256 _allocPoint,
        bool _withUpdate
    ) external onlyRole(MANAGER_ROLE) {
        if (_withUpdate) {
            massUpdatePools();
        }

        uint256 lastRewardTime = block.timestamp > startTime
            ? block.timestamp
            : startTime;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);

        poolInfo.push(
            PoolInfo({
                lpToken: IERC20(_lpToken),
                allocPoint: _allocPoint,
                lastRewardTime: lastRewardTime,
                accRewardPerShare: 0,
                totalStaked: 0,
                isActive: true
            })
        );

        emit PoolAdded(poolInfo.length - 1, _lpToken, _allocPoint);
    }

    /**
     * @dev Update pool allocation points
     * @param _pid Pool ID
     * @param _allocPoint New allocation points
     * @param _withUpdate Whether to update all pools
     */
    function setPool(
        uint256 _pid,
        uint256 _allocPoint,
        bool _withUpdate
    ) external onlyRole(MANAGER_ROLE) {
        if (_pid >= poolInfo.length) revert PoolNotFound();

        if (_withUpdate) {
            massUpdatePools();
        }

        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(
            _allocPoint
        );
        poolInfo[_pid].allocPoint = _allocPoint;

        emit PoolUpdated(_pid, _allocPoint);
    }

    /**
     * @dev Deposit LP tokens to farm
     * @param _pid Pool ID
     * @param _amount Amount of LP tokens to deposit
     */
    function deposit(
        uint256 _pid,
        uint256 _amount
    ) external nonReentrant whenNotPaused {
        if (_pid >= poolInfo.length) revert PoolNotFound();
        if (!poolInfo[_pid].isActive) revert PoolNotActive();
        if (block.timestamp < startTime) revert FarmingNotStarted();
        if (block.timestamp > endTime) revert FarmingEnded();

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        updatePool(_pid);

        if (user.amount > 0) {
            uint256 pending = user
                .amount
                .mul(pool.accRewardPerShare)
                .div(1e12)
                .sub(user.rewardDebt);
            if (pending > 0) {
                user.pendingRewards = user.pendingRewards.add(pending);
            }
        }

        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(msg.sender, address(this), _amount);
            user.amount = user.amount.add(_amount);
            pool.totalStaked = pool.totalStaked.add(_amount);
        }

        user.rewardDebt = user.amount.mul(pool.accRewardPerShare).div(1e12);
        user.lastClaimTime = block.timestamp;

        emit Deposited(msg.sender, _pid, _amount);
    }

    /**
     * @dev Withdraw LP tokens from farming
     * @param _pid Pool ID
     * @param _amount Amount of LP tokens to withdraw
     */
    function withdraw(uint256 _pid, uint256 _amount) external nonReentrant {
        if (_pid >= poolInfo.length) revert PoolNotFound();

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        if (user.amount < _amount) revert InsufficientBalance();

        updatePool(_pid);

        uint256 pending = user.amount.mul(pool.accRewardPerShare).div(1e12).sub(
            user.rewardDebt
        );
        if (pending > 0) {
            user.pendingRewards = user.pendingRewards.add(pending);
        }

        if (_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.totalStaked = pool.totalStaked.sub(_amount);
            pool.lpToken.safeTransfer(msg.sender, _amount);
        }

        user.rewardDebt = user.amount.mul(pool.accRewardPerShare).div(1e12);

        emit Withdrawn(msg.sender, _pid, _amount);
    }

    /**
     * @dev Claim pending rewards
     * @param _pid Pool ID
     */
    function claimRewards(uint256 _pid) external nonReentrant {
        if (_pid >= poolInfo.length) revert PoolNotFound();

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        updatePool(_pid);

        uint256 pending = user.amount.mul(pool.accRewardPerShare).div(1e12).sub(
            user.rewardDebt
        );
        if (pending > 0) {
            user.pendingRewards = user.pendingRewards.add(pending);
        }

        uint256 totalPending = user.pendingRewards;
        if (totalPending > 0) {
            user.pendingRewards = 0;
            rewardToken.safeTransfer(msg.sender, totalPending);
            emit RewardsClaimed(msg.sender, _pid, totalPending);
        }

        user.rewardDebt = user.amount.mul(pool.accRewardPerShare).div(1e12);
        user.lastClaimTime = block.timestamp;
    }

    /**
     * @dev Emergency withdraw without claiming rewards
     * @param _pid Pool ID
     */
    function emergencyWithdraw(uint256 _pid) external nonReentrant {
        if (_pid >= poolInfo.length) revert PoolNotFound();

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        user.pendingRewards = 0;

        pool.totalStaked = pool.totalStaked.sub(amount);
        pool.lpToken.safeTransfer(msg.sender, amount);

        emit EmergencyWithdraw(msg.sender, _pid, amount);
    }

    /**
     * @dev Update pool rewards
     * @param _pid Pool ID
     */
    function updatePool(uint256 _pid) public {
        if (_pid >= poolInfo.length) revert PoolNotFound();

        PoolInfo storage pool = poolInfo[_pid];
        if (block.timestamp <= pool.lastRewardTime) {
            return;
        }

        if (pool.totalStaked == 0) {
            pool.lastRewardTime = block.timestamp;
            return;
        }

        uint256 multiplier = getMultiplier(
            pool.lastRewardTime,
            block.timestamp
        );
        uint256 reward = multiplier
            .mul(rewardPerSecond)
            .mul(pool.allocPoint)
            .div(totalAllocPoint);

        pool.accRewardPerShare = pool.accRewardPerShare.add(
            reward.mul(1e12).div(pool.totalStaked)
        );
        pool.lastRewardTime = block.timestamp;
    }

    /**
     * @dev Update all pools
     */
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    /**
     * @dev Get pending rewards for a user
     * @param _pid Pool ID
     * @param _user User address
     * @return pending Pending rewards
     */
    function pendingRewards(
        uint256 _pid,
        address _user
    ) external view returns (uint256 pending) {
        if (_pid >= poolInfo.length) revert PoolNotFound();

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];

        uint256 accRewardPerShare = pool.accRewardPerShare;
        if (block.timestamp > pool.lastRewardTime && pool.totalStaked != 0) {
            uint256 multiplier = getMultiplier(
                pool.lastRewardTime,
                block.timestamp
            );
            uint256 reward = multiplier
                .mul(rewardPerSecond)
                .mul(pool.allocPoint)
                .div(totalAllocPoint);
            accRewardPerShare = accRewardPerShare.add(
                reward.mul(1e12).div(pool.totalStaked)
            );
        }

        return
            user
                .amount
                .mul(accRewardPerShare)
                .div(1e12)
                .sub(user.rewardDebt)
                .add(user.pendingRewards);
    }

    /**
     * @dev Get multiplier for reward calculation
     * @param _from Start time
     * @param _to End time
     * @return multiplier Multiplier value
     */
    function getMultiplier(
        uint256 _from,
        uint256 _to
    ) public view returns (uint256 multiplier) {
        if (_to <= endTime) {
            return _to.sub(_from);
        } else if (_from >= endTime) {
            return 0;
        } else {
            return endTime.sub(_from);
        }
    }

    /**
     * @dev Update reward rate (only manager)
     * @param _rewardPerSecond New reward rate per second
     */
    function updateRewardRate(
        uint256 _rewardPerSecond
    ) external onlyRole(MANAGER_ROLE) {
        massUpdatePools();
        rewardPerSecond = _rewardPerSecond;
        emit RewardRateUpdated(_rewardPerSecond);
    }

    /**
     * @dev Get pool count
     * @return count Number of pools
     */
    function poolLength() external view returns (uint256 count) {
        return poolInfo.length;
    }

    /**
     * @dev Get pool information
     * @param _pid Pool ID
     * @return info Pool information
     */
    function getPoolInfo(
        uint256 _pid
    ) external view returns (PoolInfo memory info) {
        if (_pid >= poolInfo.length) revert PoolNotFound();
        return poolInfo[_pid];
    }

    /**
     * @dev Get user information
     * @param _pid Pool ID
     * @param _user User address
     * @return info User information
     */
    function getUserInfo(
        uint256 _pid,
        address _user
    ) external view returns (UserInfo memory info) {
        if (_pid >= poolInfo.length) revert PoolNotFound();
        return userInfo[_pid][_user];
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
