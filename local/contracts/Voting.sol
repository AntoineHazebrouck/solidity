// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Voting {
    // store current status
    WorkflowStatus public status;

    // store voters
    mapping(address => Voter) public voters;
    uint public votersCount;

    // store administrator address
    address private administrator;

    constructor(address _administrator) {
        console.log("Deploying a Voting with administrator:", _administrator);
        administrator = _administrator;
        votersCount = 0;
        status = WorkflowStatus.RegisteringVoters;
    }

    function getAdministrator() public view returns (address) {
        return administrator;
    }

    function addVoter(
        bool isRegistered,
        bool hasVoted,
        uint votedProposalId
    ) public {
        votersCount = votersCount + 1;
        voters[msg.sender] = Voter(isRegistered, hasVoted, votedProposalId);
    }

    function propose() public view returns (bool) {
        if (status != WorkflowStatus.ProposalsRegistrationStarted) {
            return false;
        }

        return true;
    }

    function nextStatus() public {
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
        // TODO emit changement de status
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
