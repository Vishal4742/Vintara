// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title ENSResolver
 * @dev ENS (Ethereum Name Service) resolver for DeFi protocol on Rootstock
 * @notice Allows using ENS names as wallet addresses in lending protocol
 */
contract ENSResolver is AccessControl, Pausable, ReentrancyGuard {
    using SafeMath for uint256;

    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant RESOLVER_ROLE = keccak256("RESOLVER_ROLE");

    // ENS Registry interface (simplified for Rootstock)
    interface IENSRegistry {
        function resolver(bytes32 node) external view returns (address);
    }

    interface IENSResolver {
        function addr(bytes32 node) external view returns (address);
        function name(bytes32 node) external view returns (string memory);
    }

    // State variables
    IENSRegistry public ensRegistry;
    mapping(bytes32 => address) public nameToAddress; // ENS name hash to address
    mapping(address => bytes32) public addressToName; // Address to ENS name hash
    mapping(bytes32 => bool) public supportedNames; // Supported ENS names
    mapping(address => bool) public authorizedAddresses; // Authorized addresses for operations

    // Events
    event ENSNameResolved(bytes32 indexed nameHash, string name, address indexed resolvedAddress);
    event ENSNameRegistered(bytes32 indexed nameHash, string name, address indexed owner);
    event ENSNameUpdated(bytes32 indexed nameHash, string name, address indexed newAddress);
    event ENSNameRemoved(bytes32 indexed nameHash, string name);
    event AuthorizedAddressAdded(address indexed addr);
    event AuthorizedAddressRemoved(address indexed addr);

    // Errors
    error ENSNameNotFound();
    error InvalidENSName();
    error AddressAlreadyRegistered();
    error Unauthorized();
    error InvalidAddress();

    constructor(address _ensRegistry) {
        ensRegistry = IENSRegistry(_ensRegistry);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(RESOLVER_ROLE, msg.sender);
    }

    /**
     * @dev Register an ENS name for an address
     * @param nameHash Hash of the ENS name
     * @param name Human-readable ENS name
     * @param addr Address to associate with the ENS name
     */
    function registerENSName(
        bytes32 nameHash,
        string calldata name,
        address addr
    ) external onlyRole(RESOLVER_ROLE) whenNotPaused {
        if (addr == address(0)) revert InvalidAddress();
        if (nameToAddress[nameHash] != address(0)) revert AddressAlreadyRegistered();

        nameToAddress[nameHash] = addr;
        addressToName[addr] = nameHash;
        supportedNames[nameHash] = true;

        emit ENSNameRegistered(nameHash, name, addr);
    }

    /**
     * @dev Update an ENS name's associated address
     * @param nameHash Hash of the ENS name
     * @param name Human-readable ENS name
     * @param newAddr New address to associate with the ENS name
     */
    function updateENSName(
        bytes32 nameHash,
        string calldata name,
        address newAddr
    ) external onlyRole(RESOLVER_ROLE) whenNotPaused {
        if (newAddr == address(0)) revert InvalidAddress();
        if (nameToAddress[nameHash] == address(0)) revert ENSNameNotFound();

        address oldAddr = nameToAddress[nameHash];
        
        // Update mappings
        nameToAddress[nameHash] = newAddr;
        addressToName[oldAddr] = bytes32(0);
        addressToName[newAddr] = nameHash;

        emit ENSNameUpdated(nameHash, name, newAddr);
    }

    /**
     * @dev Remove an ENS name registration
     * @param nameHash Hash of the ENS name
     * @param name Human-readable ENS name
     */
    function removeENSName(
        bytes32 nameHash,
        string calldata name
    ) external onlyRole(RESOLVER_ROLE) whenNotPaused {
        if (nameToAddress[nameHash] == address(0)) revert ENSNameNotFound();

        address addr = nameToAddress[nameHash];
        
        // Clear mappings
        nameToAddress[nameHash] = address(0);
        addressToName[addr] = bytes32(0);
        supportedNames[nameHash] = false;

        emit ENSNameRemoved(nameHash, name);
    }

    /**
     * @dev Resolve ENS name to address
     * @param nameHash Hash of the ENS name
     * @return addr Resolved address
     */
    function resolveENSName(bytes32 nameHash) external view returns (address addr) {
        addr = nameToAddress[nameHash];
        if (addr == address(0)) revert ENSNameNotFound();
        return addr;
    }

    /**
     * @dev Resolve ENS name string to address
     * @param name ENS name string (e.g., "user.vintara.eth")
     * @return addr Resolved address
     */
    function resolveENSNameString(string calldata name) external view returns (address addr) {
        bytes32 nameHash = keccak256(abi.encodePacked(name));
        return this.resolveENSName(nameHash);
    }

    /**
     * @dev Get ENS name for an address
     * @param addr Address to look up
     * @return nameHash Hash of the ENS name
     */
    function getENSNameForAddress(address addr) external view returns (bytes32 nameHash) {
        nameHash = addressToName[addr];
        if (nameHash == bytes32(0)) revert ENSNameNotFound();
        return nameHash;
    }

    /**
     * @dev Check if an ENS name is supported
     * @param nameHash Hash of the ENS name
     * @return isSupported Whether the ENS name is supported
     */
    function isENSSupported(bytes32 nameHash) external view returns (bool isSupported) {
        return supportedNames[nameHash];
    }

    /**
     * @dev Check if an address has an ENS name
     * @param addr Address to check
     * @return hasENS Whether the address has an ENS name
     */
    function hasENSName(address addr) external view returns (bool hasENS) {
        return addressToName[addr] != bytes32(0);
    }

    /**
     * @dev Batch resolve multiple ENS names
     * @param nameHashes Array of ENS name hashes
     * @return addresses Array of resolved addresses
     */
    function batchResolveENSNames(
        bytes32[] calldata nameHashes
    ) external view returns (address[] memory addresses) {
        addresses = new address[](nameHashes.length);
        
        for (uint256 i = 0; i < nameHashes.length; i++) {
            addresses[i] = nameToAddress[nameHashes[i]];
        }
        
        return addresses;
    }

    /**
     * @dev Add authorized address for operations
     * @param addr Address to authorize
     */
    function addAuthorizedAddress(address addr) external onlyRole(MANAGER_ROLE) {
        if (addr == address(0)) revert InvalidAddress();
        authorizedAddresses[addr] = true;
        emit AuthorizedAddressAdded(addr);
    }

    /**
     * @dev Remove authorized address
     * @param addr Address to remove authorization
     */
    function removeAuthorizedAddress(address addr) external onlyRole(MANAGER_ROLE) {
        authorizedAddresses[addr] = false;
        emit AuthorizedAddressRemoved(addr);
    }

    /**
     * @dev Check if address is authorized
     * @param addr Address to check
     * @return isAuthorized Whether the address is authorized
     */
    function isAuthorized(address addr) external view returns (bool isAuthorized) {
        return authorizedAddresses[addr];
    }

    /**
     * @dev Resolve ENS name with fallback to address
     * @param nameOrAddress ENS name or address string
     * @return addr Resolved address
     */
    function resolveNameOrAddress(string calldata nameOrAddress) external view returns (address addr) {
        // Check if it's a valid address
        if (_isValidAddress(nameOrAddress)) {
            return _parseAddress(nameOrAddress);
        }
        
        // Try to resolve as ENS name
        bytes32 nameHash = keccak256(abi.encodePacked(nameOrAddress));
        return this.resolveENSName(nameHash);
    }

    /**
     * @dev Update ENS registry address
     * @param newRegistry New ENS registry address
     */
    function updateENSRegistry(address newRegistry) external onlyRole(MANAGER_ROLE) {
        if (newRegistry == address(0)) revert InvalidAddress();
        ensRegistry = IENSRegistry(newRegistry);
    }

    /**
     * @dev Internal function to check if string is a valid address
     * @param addr String to check
     * @return isValid Whether the string is a valid address
     */
    function _isValidAddress(string calldata addr) internal pure returns (bool isValid) {
        bytes memory addrBytes = bytes(addr);
        if (addrBytes.length != 42) return false;
        if (addrBytes[0] != '0' || addrBytes[1] != 'x') return false;
        
        for (uint256 i = 2; i < 42; i++) {
            bytes1 char = addrBytes[i];
            if (!(char >= 0x30 && char <= 0x39) && // 0-9
                !(char >= 0x41 && char <= 0x46) && // A-F
                !(char >= 0x61 && char <= 0x66)) { // a-f
                return false;
            }
        }
        return true;
    }

    /**
     * @dev Internal function to parse address from string
     * @param addr String address
     * @return parsedAddr Parsed address
     */
    function _parseAddress(string calldata addr) internal pure returns (address parsedAddr) {
        bytes memory addrBytes = bytes(addr);
        require(addrBytes.length == 42, "Invalid address length");
        
        uint160 result = 0;
        for (uint256 i = 2; i < 42; i++) {
            result = result * 16 + _hexCharToUint(addrBytes[i]);
        }
        return address(result);
    }

    /**
     * @dev Internal function to convert hex character to uint
     * @param char Hex character
     * @return value Numeric value
     */
    function _hexCharToUint(bytes1 char) internal pure returns (uint8 value) {
        if (char >= 0x30 && char <= 0x39) {
            return uint8(char) - 0x30;
        } else if (char >= 0x41 && char <= 0x46) {
            return uint8(char) - 0x37;
        } else if (char >= 0x61 && char <= 0x66) {
            return uint8(char) - 0x57;
        } else {
            revert("Invalid hex character");
        }
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
