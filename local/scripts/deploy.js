const hre = require("hardhat");

async function main() {
	const Greeter = await hre.ethers.getContractFactory("Greeter");
	const greeter = await Greeter.deploy("Hello, Hardhat!");

	const Voting = await hre.ethers.getContractFactory("Voting");
	const voting = await Voting.deploy();

	await greeter.waitForDeployment();
	await voting.waitForDeployment();

	console.log("Greeter deployed to:", greeter.target);
}


main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});