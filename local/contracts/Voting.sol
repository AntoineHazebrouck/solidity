// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    // store current status
    WorkflowStatus public status;

    // store winning proposal
    uint public winningProposalId;

    // store proposals
    mapping(uint => Proposal) public proposals;
    uint public proposalsCount;

    // store voters
    mapping(address => Voter) public voters;
    uint public votersCount;

    constructor(address initialOwner) Ownable(initialOwner) {
        console.log("Deploying a Voting with administrator:", owner());
        votersCount = 0;
        proposalsCount = 0;
        winningProposalId = 0;
        status = WorkflowStatus.RegisteringVoters;
    }

    function getAdministrator() public view returns (address) {
        return owner();
    }

    function addVoter(address ethereumAddress) public onlyOwner {
        votersCount = votersCount + 1;
        voters[ethereumAddress] = Voter(false, false, 0);
        emit VoterRegistered(ethereumAddress);
    }

    // parameter for testing purpose
    function proposeTest(address sender, string memory description) public {
        if (status == WorkflowStatus.ProposalsRegistrationStarted) {
            voters[sender].isRegistered = true;

            proposalsCount = proposalsCount + 1;
            proposals[proposalsCount] = Proposal(description, 0);
            emit ProposalRegistered(proposalsCount);
        }
    }

    function propose(string memory description) public {
        if (status == WorkflowStatus.ProposalsRegistrationStarted) {
            voters[msg.sender].isRegistered = true;

            proposalsCount = proposalsCount + 1;
            proposals[proposalsCount] = Proposal(description, 0);
            emit ProposalRegistered(proposalsCount);
        }
    }

    // parameter for testing purpose
    function voteTest(address sender, uint proposalId) public {
        if (proposalId > 0 && proposalId <= proposalsCount) {
            proposals[proposalId].voteCount += 1;

            voters[sender].hasVoted = true;
            voters[sender].votedProposalId = proposalId;

            emit Voted(sender, proposalId);
        }
    }

    function vote(uint proposalId) public {
        if (proposalId > 0 && proposalId <= proposalsCount) {
            proposals[proposalId].voteCount += 1;

            voters[msg.sender].hasVoted = true;
            voters[msg.sender].votedProposalId = proposalId;

            emit Voted(msg.sender, proposalId);
        }
    }

    function nextStatus() public onlyOwner {
        WorkflowStatus previousStatus = status;
        if (status == WorkflowStatus.RegisteringVoters) {
            status = WorkflowStatus.ProposalsRegistrationStarted;
        } else if (status == WorkflowStatus.ProposalsRegistrationStarted) {
            status = WorkflowStatus.ProposalsRegistrationEnded;
        } else if (status == WorkflowStatus.ProposalsRegistrationEnded) {
            status = WorkflowStatus.VotingSessionStarted;
        } else if (status == WorkflowStatus.VotingSessionStarted) {
            status = WorkflowStatus.VotingSessionEnded;
        } else if (status == WorkflowStatus.VotingSessionEnded) {
            uint maxVoteCount = 0;
            uint maxVoteCountIndex = 0;
            for (uint index = 1; index <= proposalsCount; index++) {
                if (proposals[index].voteCount > maxVoteCount) {
                    maxVoteCount = proposals[index].voteCount;
                    maxVoteCountIndex = index;
                }
            }
            winningProposalId = maxVoteCountIndex;
            status = WorkflowStatus.VotesTallied;
        }
        emit WorkflowStatusChange(previousStatus, status);
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    struct Proposal {
        string description;
        uint voteCount;
    }
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    function helloWorld() public pure returns (string memory) {
        return "Hello World!";
    }
}
