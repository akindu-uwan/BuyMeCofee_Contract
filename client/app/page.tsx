"use client";

import { useEffect, useState } from "react";
import "../app/globals.css"; // Import global styles
import { getContractAddress } from "ethers/lib/utils";
import { ethers, providers } from "ethers";

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
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "NewMemo",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_message",
        "type": "string"
      }
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
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "message",
            "type": "string"
          }
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
]



export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(null);

  const LOCAL_RPC_URL = "http://127.0.0.1:8545";
  const provider = new ethers.providers.JsonRpcProvider(LOCAL_RPC_URL);


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
        setIsConnected(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
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
      const tx = await contract.buyCoffee("Akindu", "Hello there");
      await tx.wait();
      alert("Transaction successful!");
    } catch (error) {
      console.error("Error calling contract:", error);
      alert("Transaction failed: " + error.message);
    }
  };

  const printDetails = async () => {
    try {
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const memos = await contract.getMemos();
      if(memos==null){
        console.log("hello");
      } else {
        console.log("out");
      }
    } catch (error) {
      console.error("Error fetching memos:", error.reason || error);
    }
  };
  
  



  return (
    <div className="container">
      <p className="title">Buy Me A Coffee</p>
      <button onClick={connectWallet} className="btn connect-btn">Connect Wallet</button>
      <button onClick={writeContract} className="btn buy-btn">Buy Coffee</button>
      <button onClick={printDetails} className="btn buy-btn">View Details</button>
    </div>
  );
}
