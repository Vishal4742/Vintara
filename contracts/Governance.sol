// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title Governance
 * @dev DAO governance contract for BitcoinYield protocol on Rootstock
 * @notice Enables community governance with voting and proposal execution
 */
contract Governance is ReentrancyGuard, Pausable, AccessControl {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Roles
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    // Proposal states
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }

    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        address[] targets;
        uint256[] values;
        string[] signatures;
        bytes[] calldatas;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool canceled;
        bool executed;
        string description;
        uint256 eta;
    }

    // Vote structure
    struct Vote {
        bool hasVoted;
        uint8 support; // 0 = against, 1 = for, 2 = abstain
        uint256 votes;
    }

    // State variables
    IERC20 public immutable governanceToken; // VINT token
    uint256 public constant VOTING_DELAY = 1; // 1 block
    uint256 public constant VOTING_PERIOD = 17280; // ~3 days in blocks
    uint256 public constant PROPOSAL_THRESHOLD = 1000000000000000000000; // 1000 VINT
    uint256 public constant QUORUM_VOTES = 10000000000000000000000; // 10000 VINT
    uint256 public constant TIMELOCK_DELAY = 2 days;

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(address => uint256) public proposalCounts;

    // Timelock
    mapping(bytes32 => bool) public queuedTransactions;
    uint256 public constant GRACE_PERIOD = 14 days;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        address[] targets,
        uint256[] values,
        string[] signatures,
        bytes[] calldatas,
        uint256 startBlock,
        uint256 endBlock,
        string description
    );
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        uint8 support,
        uint256 votes
    );
    event ProposalCanceled(uint256 indexed proposalId);
    event ProposalQueued(uint256 indexed proposalId, uint256 eta);
    event ProposalExecuted(uint256 indexed proposalId);
    event TransactionQueued(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 eta
    );
    event TransactionExecuted(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data
    );
    event TransactionCanceled(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data
    );

    // Errors
    error ProposalNotFound();
    error ProposalNotActive();
    error AlreadyVoted();
    error InsufficientVotingPower();
    error ProposalNotSucceeded();
    error ProposalNotQueued();
    error TransactionNotQueued();
    error TransactionNotReady();
    error TransactionExpired();
    error Unauthorized();

    constructor(address _governanceToken) {
        governanceToken = IERC20(_governanceToken);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Create a new proposal
     * @param targets Target addresses for calls
     * @param values ETH values for calls
     * @param signatures Function signatures for calls
     * @param calldatas Calldata for calls
     * @param description Description of the proposal
     * @return proposalId ID of the created proposal
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256 proposalId) {
        if (governanceToken.balanceOf(msg.sender) < PROPOSAL_THRESHOLD) {
            revert InsufficientVotingPower();
        }

        proposalId = proposalCount.add(1);
        proposalCount = proposalId;

        uint256 startBlock = block.number.add(VOTING_DELAY);
        uint256 endBlock = startBlock.add(VOTING_PERIOD);

        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            targets: targets,
            values: values,
            signatures: signatures,
            calldatas: calldatas,
            startBlock: startBlock,
            endBlock: endBlock,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            canceled: false,
            executed: false,
            description: description,
            eta: 0
        });

        proposalCounts[msg.sender] = proposalCounts[msg.sender].add(1);

        emit ProposalCreated(
            proposalId,
            msg.sender,
            targets,
            values,
            signatures,
            calldatas,
            startBlock,
            endBlock,
            description
        );

        return proposalId;
    }

    /**
     * @dev Cast a vote on a proposal
     * @param proposalId ID of the proposal
     * @param support Support value (0 = against, 1 = for, 2 = abstain)
     */
    function castVote(uint256 proposalId, uint8 support) external {
        if (proposalId > proposalCount) revert ProposalNotFound();

        Proposal storage proposal = proposals[proposalId];
        if (
            block.number < proposal.startBlock ||
            block.number > proposal.endBlock
        ) {
            revert ProposalNotActive();
        }

        Vote storage vote = votes[proposalId][msg.sender];
        if (vote.hasVoted) revert AlreadyVoted();

        uint256 votes_ = governanceToken.balanceOf(msg.sender);
        if (votes_ == 0) revert InsufficientVotingPower();

        vote.hasVoted = true;
        vote.support = support;
        vote.votes = votes_;

        if (support == 0) {
            proposal.againstVotes = proposal.againstVotes.add(votes_);
        } else if (support == 1) {
            proposal.forVotes = proposal.forVotes.add(votes_);
        } else if (support == 2) {
            proposal.abstainVotes = proposal.abstainVotes.add(votes_);
        }

        emit VoteCast(msg.sender, proposalId, support, votes_);
    }

    /**
     * @dev Queue a proposal for execution
     * @param proposalId ID of the proposal
     */
    function queue(uint256 proposalId) external {
        if (proposalId > proposalCount) revert ProposalNotFound();

        Proposal storage proposal = proposals[proposalId];
        if (proposal.state() != ProposalState.Succeeded)
            revert ProposalNotSucceeded();

        uint256 eta = block.timestamp.add(TIMELOCK_DELAY);
        proposal.eta = eta;

        for (uint256 i = 0; i < proposal.targets.length; i++) {
            _queueOrRevert(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i],
                eta
            );
        }

        emit ProposalQueued(proposalId, eta);
    }

    /**
     * @dev Execute a queued proposal
     * @param proposalId ID of the proposal
     */
    function execute(uint256 proposalId) external payable {
        if (proposalId > proposalCount) revert ProposalNotFound();

        Proposal storage proposal = proposals[proposalId];
        if (proposal.state() != ProposalState.Queued)
            revert ProposalNotQueued();

        proposal.executed = true;

        for (uint256 i = 0; i < proposal.targets.length; i++) {
            _executeTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i]
            );
        }

        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev Cancel a proposal
     * @param proposalId ID of the proposal
     */
    function cancel(uint256 proposalId) external {
        if (proposalId > proposalCount) revert ProposalNotFound();

        Proposal storage proposal = proposals[proposalId];
        if (
            msg.sender != proposal.proposer &&
            !hasRole(MANAGER_ROLE, msg.sender)
        ) {
            revert Unauthorized();
        }

        proposal.canceled = true;

        for (uint256 i = 0; i < proposal.targets.length; i++) {
            _cancelTransaction(
                proposal.targets[i],
                proposal.values[i],
                proposal.signatures[i],
                proposal.calldatas[i]
            );
        }

        emit ProposalCanceled(proposalId);
    }

    /**
     * @dev Get proposal state
     * @param proposalId ID of the proposal
     * @return state Current state of the proposal
     */
    function getProposalState(
        uint256 proposalId
    ) external view returns (ProposalState state) {
        if (proposalId > proposalCount) revert ProposalNotFound();
        return proposals[proposalId].state();
    }

    /**
     * @dev Get proposal votes
     * @param proposalId ID of the proposal
     * @return forVotes For votes
     * @return againstVotes Against votes
     * @return abstainVotes Abstain votes
     */
    function getProposalVotes(
        uint256 proposalId
    )
        external
        view
        returns (uint256 forVotes, uint256 againstVotes, uint256 abstainVotes)
    {
        if (proposalId > proposalCount) revert ProposalNotFound();

        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes
        );
    }

    /**
     * @dev Get user's vote on a proposal
     * @param proposalId ID of the proposal
     * @param voter Voter address
     * @return hasVoted Whether the user has voted
     * @return support Support value
     * @return votes Number of votes
     */
    function getVote(
        uint256 proposalId,
        address voter
    ) external view returns (bool hasVoted, uint8 support, uint256 votes) {
        if (proposalId > proposalCount) revert ProposalNotFound();

        Vote storage vote = votes[proposalId][voter];
        return (vote.hasVoted, vote.support, vote.votes);
    }

    /**
     * @dev Internal function to queue a transaction
     */
    function _queueOrRevert(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) internal {
        bytes32 txHash = keccak256(
            abi.encode(target, value, signature, data, eta)
        );
        queuedTransactions[txHash] = true;

        emit TransactionQueued(txHash, target, value, signature, data, eta);
    }

    /**
     * @dev Internal function to execute a transaction
     */
    function _executeTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal {
        bytes32 txHash = keccak256(
            abi.encode(
                target,
                value,
                signature,
                data,
                proposals[proposalCount].eta
            )
        );

        if (!queuedTransactions[txHash]) revert TransactionNotQueued();
        if (block.timestamp < proposals[proposalCount].eta)
            revert TransactionNotReady();
        if (block.timestamp > proposals[proposalCount].eta.add(GRACE_PERIOD))
            revert TransactionExpired();

        queuedTransactions[txHash] = false;

        // Execute the transaction
        (bool success, ) = target.call{value: value}(data);
        require(success, "Transaction execution failed");

        emit TransactionExecuted(txHash, target, value, signature, data);
    }

    /**
     * @dev Internal function to cancel a transaction
     */
    function _cancelTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data
    ) internal {
        bytes32 txHash = keccak256(
            abi.encode(
                target,
                value,
                signature,
                data,
                proposals[proposalCount].eta
            )
        );
        queuedTransactions[txHash] = false;

        emit TransactionCanceled(txHash, target, value, signature, data);
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

/**
 * @title Proposal
 * @dev Extension to add state function to Proposal struct
 */
library Proposal {
    using SafeMath for uint256;

    function state(
        Governance.Proposal storage proposal
    ) internal view returns (Governance.ProposalState) {
        if (proposal.canceled) {
            return Governance.ProposalState.Canceled;
        } else if (block.number <= proposal.startBlock) {
            return Governance.ProposalState.Pending;
        } else if (block.number <= proposal.endBlock) {
            return Governance.ProposalState.Active;
        } else if (
            proposal.forVotes <= proposal.againstVotes ||
            proposal.forVotes < 10000000000000000000000
        ) {
            return Governance.ProposalState.Defeated;
        } else if (proposal.eta == 0) {
            return Governance.ProposalState.Succeeded;
        } else if (proposal.executed) {
            return Governance.ProposalState.Executed;
        } else if (block.timestamp >= proposal.eta.add(14 days)) {
            return Governance.ProposalState.Expired;
        } else {
            return Governance.ProposalState.Queued;
        }
    }
}
