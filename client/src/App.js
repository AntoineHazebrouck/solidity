import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
	// TODO interact with contract
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
	const contractAdress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

	const connectWallet = async () => {
		await provider.send("eth_requestAccounts", []);
	}

	const getBalance = async () => {
		const balance = provider.getBalance("ethers.eth")

		const formattedEthers = ethers.utils.formatEther(balance);
	}

	connectWallet().catch(console.error);
	
	return (<h1>Hello</h1>);
}

export default App;
