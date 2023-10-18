const { ethers } = require("hardhat");

describe("Voting", function () {
	async function deploy() {
		// Contracts are deployed using the first signer/account by default

		const Voting = await ethers.getContractFactory("Voting");
		const voting = await Voting.deploy();

		return voting;
	}

	describe("Deployment", function () {
		it("Should say hello world", async function () {
			const voting = await loadFixture(deploy);

			expect(await voting.helloWorld()).to.equal("Hello World!");
		});
	});
});
