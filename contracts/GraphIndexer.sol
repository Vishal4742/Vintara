// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GraphIndexer
 * @dev The Graph Protocol integration for data indexing and analytics
 * @notice Provides indexed data queries for protocol analytics and user data
 */
contract GraphIndexer is AccessControl, Pausable, ReentrancyGuard {
    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant INDEXER_ROLE = keccak256("INDEXER_ROLE");

    // Protocol data structures
    struct ProtocolStats {
        uint256 totalValueLocked;
        uint256 totalBorrowed;
        uint256 totalSupplied;
        uint256 totalFeesEarned;
        uint256 activeUsers;
        uint256 lastUpdated;
    }

    struct UserStats {
        uint256 totalDeposits;
        uint256 totalBorrows;
        uint256 totalFeesPaid;
        uint256 totalRewardsEarned;
        uint256 lastActivity;
        bool isActive;
    }

    struct PoolStats {
        uint256 liquidity;
        uint256 volume24h;
        uint256 fees24h;
        uint256 apr;
        uint256 lastUpdated;
    }

    // Stored data
    ProtocolStats public protocolStats;
    mapping(address => UserStats) public userStats;
    mapping(string => PoolStats) public poolStats;
    
    // Indexing configuration
    mapping(string => bool) public indexedPools;
    mapping(address => bool) public indexedUsers;
    
    // Events
    event ProtocolStatsUpdated(
        uint256 totalValueLocked,
        uint256 totalBorrowed,
        uint256 totalSupplied,
        uint256 totalFeesEarned,
        uint256 activeUsers
    );
    
    event UserStatsUpdated(
        address indexed user,
        uint256 totalDeposits,
        uint256 totalBorrows,
        uint256 totalFeesPaid,
        uint256 totalRewardsEarned
    );
    
    event PoolStatsUpdated(
        string indexed poolName,
        uint256 liquidity,
        uint256 volume24h,
        uint256 fees24h,
        uint256 apr
    );
    
    event PoolIndexed(string indexed poolName, bool indexed);
    event UserIndexed(address indexed user, bool indexed);

    // Errors
    error InvalidData();
    error PoolNotIndexed();
    error UserNotIndexed();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(INDEXER_ROLE, msg.sender);

        // Initialize protocol stats
        protocolStats = ProtocolStats({
            totalValueLocked: 0,
            totalBorrowed: 0,
            totalSupplied: 0,
            totalFeesEarned: 0,
            activeUsers: 0,
            lastUpdated: block.timestamp
        });
    }

    /**
     * @dev Update protocol-wide statistics
     * @param totalValueLocked Total value locked in the protocol
     * @param totalBorrowed Total amount borrowed
     * @param totalSupplied Total amount supplied
     * @param totalFeesEarned Total fees earned by the protocol
     * @param activeUsers Number of active users
     */
    function updateProtocolStats(
        uint256 totalValueLocked,
        uint256 totalBorrowed,
        uint256 totalSupplied,
        uint256 totalFeesEarned,
        uint256 activeUsers
    ) external onlyRole(INDEXER_ROLE) {
        protocolStats = ProtocolStats({
            totalValueLocked: totalValueLocked,
            totalBorrowed: totalBorrowed,
            totalSupplied: totalSupplied,
            totalFeesEarned: totalFeesEarned,
            activeUsers: activeUsers,
            lastUpdated: block.timestamp
        });

        emit ProtocolStatsUpdated(
            totalValueLocked,
            totalBorrowed,
            totalSupplied,
            totalFeesEarned,
            activeUsers
        );
    }

    /**
     * @dev Update user statistics
     * @param user User address
     * @param totalDeposits Total deposits by user
     * @param totalBorrows Total borrows by user
     * @param totalFeesPaid Total fees paid by user
     * @param totalRewardsEarned Total rewards earned by user
     */
    function updateUserStats(
        address user,
        uint256 totalDeposits,
        uint256 totalBorrows,
        uint256 totalFeesPaid,
        uint256 totalRewardsEarned
    ) external onlyRole(INDEXER_ROLE) {
        if (user == address(0)) revert InvalidData();

        userStats[user] = UserStats({
            totalDeposits: totalDeposits,
            totalBorrows: totalBorrows,
            totalFeesPaid: totalFeesPaid,
            totalRewardsEarned: totalRewardsEarned,
            lastActivity: block.timestamp,
            isActive: true
        });

        emit UserStatsUpdated(
            user,
            totalDeposits,
            totalBorrows,
            totalFeesPaid,
            totalRewardsEarned
        );
    }

    /**
     * @dev Update pool statistics
     * @param poolName Pool identifier
     * @param liquidity Current pool liquidity
     * @param volume24h 24-hour trading volume
     * @param fees24h 24-hour fees generated
     * @param apr Current APR
     */
    function updatePoolStats(
        string calldata poolName,
        uint256 liquidity,
        uint256 volume24h,
        uint256 fees24h,
        uint256 apr
    ) external onlyRole(INDEXER_ROLE) {
        if (!indexedPools[poolName]) revert PoolNotIndexed();

        poolStats[poolName] = PoolStats({
            liquidity: liquidity,
            volume24h: volume24h,
            fees24h: fees24h,
            apr: apr,
            lastUpdated: block.timestamp
        });

        emit PoolStatsUpdated(poolName, liquidity, volume24h, fees24h, apr);
    }

    /**
     * @dev Add a pool to indexing
     * @param poolName Pool identifier
     */
    function addPoolToIndexing(string calldata poolName) external onlyRole(MANAGER_ROLE) {
        indexedPools[poolName] = true;
        emit PoolIndexed(poolName, true);
    }

    /**
     * @dev Remove a pool from indexing
     * @param poolName Pool identifier
     */
    function removePoolFromIndexing(string calldata poolName) external onlyRole(MANAGER_ROLE) {
        indexedPools[poolName] = false;
        emit PoolIndexed(poolName, false);
    }

    /**
     * @dev Add a user to indexing
     * @param user User address
     */
    function addUserToIndexing(address user) external onlyRole(MANAGER_ROLE) {
        if (user == address(0)) revert InvalidData();
        indexedUsers[user] = true;
        emit UserIndexed(user, true);
    }

    /**
     * @dev Remove a user from indexing
     * @param user User address
     */
    function removeUserFromIndexing(address user) external onlyRole(MANAGER_ROLE) {
        indexedUsers[user] = false;
        emit UserIndexed(user, false);
    }

    /**
     * @dev Get protocol statistics
     * @return stats Protocol statistics struct
     */
    function getProtocolStats() external view returns (ProtocolStats memory stats) {
        return protocolStats;
    }

    /**
     * @dev Get user statistics
     * @param user User address
     * @return stats User statistics struct
     */
    function getUserStats(address user) external view returns (UserStats memory stats) {
        return userStats[user];
    }

    /**
     * @dev Get pool statistics
     * @param poolName Pool identifier
     * @return stats Pool statistics struct
     */
    function getPoolStats(string calldata poolName) external view returns (PoolStats memory stats) {
        return poolStats[poolName];
    }

    /**
     * @dev Get all indexed pools
     * @return pools Array of pool names
     */
    function getIndexedPools() external view returns (string[] memory pools) {
        // This is a simplified version - in practice, you'd maintain a list
        // For now, return common pool names
        pools = new string[](3);
        pools[0] = "rBTC-USDT";
        pools[1] = "rBTC-ETH";
        pools[2] = "USDT-ETH";
        return pools;
    }

    /**
     * @dev Check if a pool is indexed
     * @param poolName Pool identifier
     * @return isIndexed True if pool is indexed
     */
    function isPoolIndexed(string calldata poolName) external view returns (bool isIndexed) {
        return indexedPools[poolName];
    }

    /**
     * @dev Check if a user is indexed
     * @param user User address
     * @return isIndexed True if user is indexed
     */
    function isUserIndexed(address user) external view returns (bool isIndexed) {
        return indexedUsers[user];
    }

    /**
     * @dev Get protocol health score based on indexed data
     * @return healthScore Health score (0-100)
     */
    function getProtocolHealthScore() external view returns (uint256 healthScore) {
        ProtocolStats memory stats = protocolStats;
        
        // Simple health calculation based on TVL, active users, and fees
        uint256 tvlScore = stats.totalValueLocked > 0 ? 40 : 0;
        uint256 userScore = stats.activeUsers > 0 ? 30 : 0;
        uint256 feeScore = stats.totalFeesEarned > 0 ? 30 : 0;
        
        return tvlScore + userScore + feeScore;
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