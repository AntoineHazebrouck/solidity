const { ethers } = require("hardhat");
const {
	time,
	loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const HAS_VOTED = 0;
const IS_REGISTERED = 1;
const VOTED_PROPOSAL_ID = 2;

const REGISTERING_VOTERS = 0;
const PROPOSALS_REGISTRATION_STARTED = 1;
const PROPOSALS_REGISTRATION_ENDED = 2;
describe("Voting", function () {
	async function deploy() {
		// Contracts are deployed using the first signer/account by default
		const [owner, otherAccount] = await ethers.getSigners();

		const Voting = await ethers.getContractFactory("Voting");
		const voting = await Voting.deploy(owner);

		return { voting, owner, otherAccount };
	}

	describe("Deployment", function () {
		it("Should say hello world", async function () {
			const { voting, owner, otherAccount } = await loadFixture(deploy);

			expect(await voting.helloWorld()).to.equal("Hello World!");
		});
		it("Admin should be contract deployer", async function () {
			const { voting, owner, otherAccount } = await loadFixture(deploy);

			expect(await voting.getAdministrator()).to.equal(owner.address);
		});
	});

	describe("Administrator adds voters", function () {
		it("Should be empty", async function () {
			const { voting, owner, otherAccount } = await loadFixture(deploy);

			expect(await voting.votersCount()).to.equal(0);
		});
		it("Should add one voter", async function () {
			const { voting, owner, otherAccount } = await loadFixture(deploy);

			await expect(voting.addVoter(newVoter.isRegistered, newVoter.hasVoted, newVoter.votedProposalId))
				.to
				.emit(voting, "VoterRegistered")
				.withArgs(owner.address);

			expect(await voting.votersCount()).to.equal(1);

			const voter = await voting.voters(owner.address);
			expect(voter[IS_REGISTERED]).to.equal(newVoter.isRegistered);
			expect(voter[HAS_VOTED]).to.equal(newVoter.hasVoted);
			expect(voter[VOTED_PROPOSAL_ID]).to.equal(newVoter.votedProposalId);
		});
	});

	describe("Administrator opens proposals registering", function () {

		it("Should have 'RegisteringVoters' as first status", async function () {
			const { voting, owner, otherAccount } = await loadFixture(deploy);
			expect(await voting.status()).to.equal(REGISTERING_VOTERS);
		});

		it("Should have 'ProposalsRegistrationStarted' when opening proposals registering", async function () {
			const { voting, owner, otherAccount } = await loadFixture(deploy);

			await expect(voting.nextStatus())
				.to
				.emit(voting, "WorkflowStatusChange")
				.withArgs(REGISTERING_VOTERS, PROPOSALS_REGISTRATION_STARTED);
		});

		describe("Voters can propose while proposals registration is opened", function () {
			it("Should not allow proposing when proposals registration is not opened", async function () {
				const { voting, owner, otherAccount } = await loadFixture(deploy);

				await expect(voting.propose())
					.not.to.emit(voting, "ProposalRegistered");
			});

			it("Should allow proposing when proposals registration is opened", async function () {
				const { voting, owner, otherAccount } = await loadFixture(deploy);

				await voting.nextStatus();

				await expect(voting.propose())
					.to
					.emit(voting, "ProposalRegistered")
					.withArgs(1);
			});

			it("Should not allow proposing when proposals registration is closed", async function () {
				const { voting, owner, otherAccount } = await loadFixture(deploy);

				await voting.nextStatus();
				await voting.nextStatus();

				await expect(voting.propose())
					.not.to.emit(voting, "ProposalRegistered");
			});
		});

		it("Should have 'ProposalsRegistrationEnded' when closing proposals registering", async function () {
			const { voting, owner, otherAccount } = await loadFixture(deploy);

			await voting.nextStatus();

			await expect(voting.nextStatus())
				.to
				.emit(voting, "WorkflowStatusChange")
				.withArgs(PROPOSALS_REGISTRATION_STARTED, PROPOSALS_REGISTRATION_ENDED);
		});
	});

	describe("Administrator opens voting session", function () {
		it("Should not allow voting when voting session has not started yet", async function () {
			const { voting, owner, otherAccount } = await loadFixture(deploy);

			await expect(voting.vote(2))
				.not.to.emit(voting, "ProposalRegistered");
		});

		describe("Voters can vote while voting session is open", function () {

			it("Should not allow voting for non-existing proposal", async function () {
				const { voting, owner, otherAccount } = await loadFixture(deploy);

				await voting.addVoter(false, false, 0);
				await voting.addVoter(false, false, 0);
				await voting.addVoter(false, false, 0);

				await voting.nextStatus();

				await voting.propose();

				await voting.nextStatus();
				await voting.nextStatus();

				await expect(voting.vote(2))
					.not.to
					.emit(voting, "Voted");
			});

			it("Should vote", async function () {
				const { voting, owner, otherAccount } = await loadFixture(deploy);

				await voting.addVoter(false, false, 0);

				await voting.nextStatus();

				await voting.propose();

				await voting.nextStatus();
				await voting.nextStatus();

				await expect(voting.vote(1))
					.to
					.emit(voting, "Voted")
					.withArgs(owner.address, 1);

				expect((await voting.voters(owner.address))[HAS_VOTED]).to.equal(true)
				expect((await voting.voters(owner.address))[VOTED_PROPOSAL_ID]).to.equal(1)
			});


		});
		it("Should not allow voting when voting session is closed", async function () {
			const { voting, owner, otherAccount } = await loadFixture(deploy);

			await voting.nextStatus();
			await voting.nextStatus();
			await voting.nextStatus();
			await voting.nextStatus();

			await expect(voting.vote(2))
				.not.to.emit(voting, "ProposalRegistered");
		});

	});

});
