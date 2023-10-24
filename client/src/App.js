import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";

function App() {

	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
	const ABI = [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "initialOwner",
					"type": "address"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "owner",
					"type": "address"
				}
			],
			"name": "OwnableInvalidOwner",
			"type": "error"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "account",
					"type": "address"
				}
			],
			"name": "OwnableUnauthorizedAccount",
			"type": "error"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "previousOwner",
					"type": "address"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "OwnershipTransferred",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "proposalId",
					"type": "uint256"
				}
			],
			"name": "ProposalRegistered",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "voter",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "proposalId",
					"type": "uint256"
				}
			],
			"name": "Voted",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "address",
					"name": "voterAddress",
					"type": "address"
				}
			],
			"name": "VoterRegistered",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "enum Voting.WorkflowStatus",
					"name": "previousStatus",
					"type": "uint8"
				},
				{
					"indexed": false,
					"internalType": "enum Voting.WorkflowStatus",
					"name": "newStatus",
					"type": "uint8"
				}
			],
			"name": "WorkflowStatusChange",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "ethereumAddress",
					"type": "address"
				}
			],
			"name": "addVoter",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getAdministrator",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "helloWorld",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "pure",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "nextStatus",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "owner",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "proposals",
			"outputs": [
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "voteCount",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "proposalsCount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				}
			],
			"name": "propose",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "sender",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				}
			],
			"name": "proposeTest",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "renounceOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "status",
			"outputs": [
				{
					"internalType": "enum Voting.WorkflowStatus",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "newOwner",
					"type": "address"
				}
			],
			"name": "transferOwnership",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "proposalId",
					"type": "uint256"
				}
			],
			"name": "vote",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "sender",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "proposalId",
					"type": "uint256"
				}
			],
			"name": "voteTest",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "voters",
			"outputs": [
				{
					"internalType": "bool",
					"name": "isRegistered",
					"type": "bool"
				},
				{
					"internalType": "bool",
					"name": "hasVoted",
					"type": "bool"
				},
				{
					"internalType": "uint256",
					"name": "votedProposalId",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "votersCount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "winningProposalId",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	];
	const contract = new ethers.Contract(contractAddress, ABI, signer);

	useEffect(() => {
		const requestAccounts = async () => {
			await provider.send("eth_requestAccounts", []);
		}

		requestAccounts()
			.catch(console.error);
	}, []);

	return (
		<div className="container">
			<div className="row mt-5">

				<div className="col">
					<h3>Hello world</h3>
				</div>

				{/* <div className="col">
					<div className="mb-3">
						<h4>Deposit ETH</h4>
						<form onSubmit={handleDepositSubmit}>
							<div className="mb-3">
								<input type="number" className="form-control" placeholder="0" onChange={handleDepositChange} value={depositValue} />
							</div>
							<button type="submit" className="btn btn-success">Deposit</button>
						</form>

						<h4 className="mt-3">Change Greeting</h4>
						<form onSubmit={handleGreetingSubmit}>
							<div className="mb-3">
								<input type="text" className="form-control" placeholder="" onChange={handleGreetingChange} value={greetingValue} />
							</div>
							<button type="submit" className="btn btn-dark">Change</button>
						</form>
					</div>
				</div> */}
			</div>
		</div>
	);
}

export default App;