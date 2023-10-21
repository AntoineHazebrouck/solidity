// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Voting {
    // store voters
    mapping(address => Voter) public voters;
    uint public votersCount;

    //
    address private administrator;

    constructor(address _administrator) {
        console.log("Deploying a Voting with administrator:", _administrator);
        administrator = _administrator;
        votersCount = 0;
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
