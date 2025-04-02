"use client";

import { useEffect, useState } from "react";
import "../app/globals.css";
import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "message", "type": "string" }
    ],
    "name": "NewMemo",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_message", "type": "string" }
    ],
    "name": "buyCoffee",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMemos",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "from", "type": "address" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "message", "type": "string" }
        ],
        "internalType": "struct BuyMeACoffee.Memo[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawTips",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(null);
  const [connection, setconnection] = useState("           ");

  useEffect(()=>{
    connectWallet();
  },[])

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setSigner(signer);
        setIsConnected(true);
        setconnection("Connected")
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet: " + (error.reason || error.message));
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const writeContract = async () => {
    if (!signer) {
      alert("Please connect your wallet first");
      return;
    }
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.buyCoffee("Alice", "Enjoy your coffee!", {
        value: ethers.utils.parseEther("0.21"),
      });
      await tx.wait();
      alert("Coffee bought successfully!");
    } catch (error) {
      console.error("Error calling contract:", error);
      alert("Transaction failed: " + (error.reason || error.message));
    }
  };

  return (
    <div className="container">
      <p className="title">Buy Me A Coffee</p>
      <button onClick={connectWallet} className="btn connect-btn">{connection}</button>
      <button onClick={writeContract} className="btn buy-btn">Buy Coffee</button>
    </div>
  );
}
