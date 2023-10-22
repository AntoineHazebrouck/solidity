// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Voting {
    // store current status
    WorkflowStatus public status;

    // store proposals
    // TODO map proposalIds to Proposal objects, maybe even Voter objects
    uint public proposalsCount;

    // store voters
    mapping(address => Voter) public voters;
    uint public votersCount;

    // store administrator address
    address private administrator;

    constructor(address _administrator) {
        console.log("Deploying a Voting with administrator:", _administrator);
        administrator = _administrator;
        votersCount = 0;
        proposalsCount = 0;
        status = WorkflowStatus.RegisteringVoters;
    }

    function getAdministrator() public view returns (address) {
        return administrator;
    }

    // TODO, c'est l'admin qui ajoute les voters, donc on peut utiliser l'adresse ethereum en param
    function addVoter(address ethereumAddress) public {
        votersCount = votersCount + 1;
        voters[ethereumAddress] = Voter(false, false, 0);
        emit VoterRegistered(ethereumAddress);
    }

    // parameter for testing purpose
    function proposeTest(address sender) public {
        if (status == WorkflowStatus.ProposalsRegistrationStarted) {
            voters[sender].isRegistered = true;
            proposalsCount = proposalsCount + 1;
            emit ProposalRegistered(proposalsCount);
        }
    }

    function propose() public {
        if (status == WorkflowStatus.ProposalsRegistrationStarted) {
            voters[msg.sender].isRegistered = true;
            proposalsCount = proposalsCount + 1;
            emit ProposalRegistered(proposalsCount);
        }
    }

    // parameter for testing purpose
    function voteTest(address sender, uint proposalId) public {
        if (proposalId > 0 && proposalId <= proposalsCount) {
            voters[sender].hasVoted = true;
            voters[sender].votedProposalId = proposalId;

            emit Voted(sender, proposalId);
        }
    }

    function vote(uint proposalId) public {
        if (proposalId > 0 && proposalId <= proposalsCount) {
            voters[msg.sender].hasVoted = true;
            voters[msg.sender].votedProposalId = proposalId;

            emit Voted(msg.sender, proposalId);
        }
    }

    function nextStatus() public {
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

    //  fonction getWinner qui retourne le gagnant

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
