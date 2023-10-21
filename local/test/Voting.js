const { ethers } = require("hardhat");
const {
	time,
	loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

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

			const newVoter = {
				isRegistered: false,
				hasVoted: false,
				votedProposalId: 2
			};
			// !!! await ici .then faire le test
			await voting.addVoter(newVoter.isRegistered, newVoter.hasVoted, newVoter.votedProposalId);

			
			expect(await voting.votersCount()).to.equal(1);
			expect(await voting.voters(1)).to.equal(newVoter);
		});
	});
});
