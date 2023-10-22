const { ethers } = require("hardhat");
const {
	time,
	loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const IS_REGISTERED = 0;
const HAS_VOTED = 1;
const VOTED_PROPOSAL_ID = 2;

const REGISTERING_VOTERS = 0;
const PROPOSALS_REGISTRATION_STARTED = 1;
const PROPOSALS_REGISTRATION_ENDED = 2;
const VOTING_SESSION_STARTED = 3;
const VOTING_SESSION_ENDED = 4;
const VOTES_TALLIED = 5;

describe("Voting", function () {
	async function getSomeAccounts() {
		const [firstAccount, secondAccount, thirdAccount, fourthAccount] = await ethers.getSigners();
		return { firstAccount, secondAccount, thirdAccount, fourthAccount };
	}

	async function deploy(account) {
		const Voting = await ethers.getContractFactory("Voting");
		const voting = await Voting.deploy(account);

		return voting;
	}

	describe("Deployment", function () {
		it("Should say hello world", async function () {
			const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
			const voting = await deploy(firstAccount);

			expect(await voting.helloWorld()).to.equal("Hello World!");
		});
		it("Admin should be contract deployer", async function () {
			const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
			const voting = await deploy(firstAccount);

			expect(await voting.getAdministrator()).to.equal((await getSomeAccounts()).firstAccount.address);
		});
	});

	describe("Administrator adds voters", function () {
		it("Should be empty", async function () {
			const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
			const voting = await deploy(firstAccount);

			expect(await voting.votersCount()).to.equal(0);
		});
		it("Should add one voter", async function () {
			const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
			const voting = await deploy(firstAccount);

			await expect(voting.addVoter(firstAccount.address))
				.to
				.emit(voting, "VoterRegistered")
				.withArgs(firstAccount.address);

			expect(await voting.votersCount()).to.equal(1);

			const voter = await voting.voters(firstAccount.address);
			expect(voter[IS_REGISTERED]).to.equal(false);
			expect(voter[HAS_VOTED]).to.equal(false);
			expect(voter[VOTED_PROPOSAL_ID]).to.equal(0);
		});
	});

	describe("Administrator opens proposals registering", function () {

		it("Should have 'RegisteringVoters' as first status", async function () {
			const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
			const voting = await deploy(firstAccount);
			expect(await voting.status()).to.equal(REGISTERING_VOTERS);
		});

		it("Should have 'ProposalsRegistrationStarted' when opening proposals registering", async function () {
			const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
			const voting = await deploy(firstAccount);

			await expect(voting.nextStatus())
				.to
				.emit(voting, "WorkflowStatusChange")
				.withArgs(REGISTERING_VOTERS, PROPOSALS_REGISTRATION_STARTED);
		});

		describe("Voters can propose while proposals registration is opened", function () {
			it("Should not allow proposing when proposals registration is not opened", async function () {
				const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
				const voting = await deploy(firstAccount);

				await expect(voting.propose())
					.not.to.emit(voting, "ProposalRegistered");
			});

			it("Should allow proposing when proposals registration is opened", async function () {
				const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
				const voting = await deploy(firstAccount);

				await voting.nextStatus();

				await expect(voting.propose())
					.to
					.emit(voting, "ProposalRegistered")
					.withArgs(1);
			});

			it("Should not allow proposing when proposals registration is closed", async function () {
				const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
				const voting = await deploy(firstAccount);

				await voting.nextStatus();
				await voting.nextStatus();

				await expect(voting.propose())
					.not.to.emit(voting, "ProposalRegistered");
			});
		});

		it("Should have 'ProposalsRegistrationEnded' when closing proposals registering", async function () {
			const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
			const voting = await deploy(firstAccount);

			await voting.nextStatus();

			await expect(voting.nextStatus())
				.to
				.emit(voting, "WorkflowStatusChange")
				.withArgs(PROPOSALS_REGISTRATION_STARTED, PROPOSALS_REGISTRATION_ENDED);
		});
	});

	describe("Administrator opens voting session", function () {
		it("Should not allow voting when voting session has not started yet", async function () {
			const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
			const voting = await deploy(firstAccount);

			await expect(voting.vote(2))
				.not.to.emit(voting, "ProposalRegistered");
		});

		describe("Voters can vote while voting session is open", function () {

			it("Should not allow voting for non-existing proposal", async function () {
				const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
				const voting = await deploy(firstAccount);

				await voting.addVoter(firstAccount);
				await voting.addVoter(secondAccount);

				await voting.nextStatus();

				await voting.propose();

				await voting.nextStatus();
				await voting.nextStatus();

				await expect(voting.vote(2))
					.not.to
					.emit(voting, "Voted");
			});

			it("Should vote", async function () {
				const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
				const voting = await deploy(firstAccount);

				await voting.addVoter(secondAccount);
				await voting.addVoter(thirdAccount);
				await voting.addVoter(fourthAccount);

				await voting.nextStatus();

				await voting.proposeTest(secondAccount);

				await voting.nextStatus();
				await voting.nextStatus();

				await expect(voting.voteTest(thirdAccount, 1))
					.to
					.emit(voting, "Voted")
					.withArgs(thirdAccount.address, 1);

				expect((await voting.voters(thirdAccount.address))[VOTED_PROPOSAL_ID]).to.equal(1);
				expect((await voting.voters(thirdAccount.address))[HAS_VOTED]).to.equal(true);
			});


		});

		it("Should not allow voting when voting session is closed", async function () {
			const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
			const voting = await deploy(firstAccount);

			await voting.nextStatus();
			await voting.nextStatus();
			await voting.nextStatus();
			await voting.nextStatus();

			await expect(voting.vote(2))
				.not.to.emit(voting, "ProposalRegistered");
		});

		describe("Administrator counts votes", function () {

			it("Should have 'VotesTallied' when counting votes", async function () {
				const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
				const voting = await deploy(firstAccount);

				await voting.nextStatus();
				await voting.nextStatus();
				await voting.nextStatus();
				await voting.nextStatus();

				expect(await voting.status()).to.equal(VOTING_SESSION_ENDED);

				await voting.nextStatus();

				expect(await voting.status()).to.equal(VOTES_TALLIED);

			});

			it("Should count votes by proposal", async function () {
				const { firstAccount, secondAccount, thirdAccount, fourthAccount } = await getSomeAccounts();
				const voting = await deploy(firstAccount);


			});
		});

	});
});
