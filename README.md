# 🚀 Crowdfunding DApp (Sobachki)

This project is a decentralized crowdfunding platform built with **Solidity, Hardhat, React (Vite), Ethers.js v6 and MetaMask**.  
It allows users to create fundraising campaigns, contribute ETH through MetaMask, and automatically receive internal ERC-20 reward tokens (CRT).

⚡ The project runs on the **Sepolia Test Network** (test ETH only).

---

## 🧠 Smart Contract Architecture

The system consists of three main smart contracts:

- 🏭 **CampaignFactory** — Deploys new Campaign contracts and stores their addresses  
- 📢 **Campaign** — Handles contributions, tracks total raised funds, goal, deadline and mints reward tokens  
- 🪙 **RewardToken (CRT)** — ERC-20 token minted to contributors  

💰 Reward logic:  
**1 ETH contributed → 100 CRT tokens minted**

---

## 🛠 Tech Stack

- Solidity ^0.8.x  
- Hardhat v3  
- OpenZeppelin Contracts  
- React + Vite  
- Ethers.js v6  
- MetaMask  
- Sepolia Testnet  

---

## ⚙️ Installation

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

---

## 🔑 Environment Setup

Create a `.env` file in the root folder:

```env
SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_wallet_private_key
```

After deploying the factory contract, create `frontend/.env`:

```env
VITE_FACTORY_ADDRESS=deployed_factory_address
```

---

## 🧾 Compile Contracts

```bash
npx hardhat compile
```

---

## 🚀 Deploy to Sepolia

```bash
npx hardhat run scripts/deployFactory.ts --network sepolia
```

Copy the deployed **CampaignFactory** address and paste it into:

```
frontend/.env
```

---

## 🌐 Run Frontend

```bash
cd frontend
npm run dev
```

Open in browser:

```
http://localhost:5173
```

Connect MetaMask and switch network to **Sepolia**.

---

## 🎯 Features

- ✅ Create crowdfunding campaigns  
- ✅ Contribute ETH using MetaMask  
- ✅ Automatic minting of reward tokens (CRT)  
- ✅ View total raised funds  
- ✅ Check reward token balance  
- ✅ Factory pattern implementation  
- ✅ ERC-20 token integration  
- ✅ Full-stack blockchain interaction  

---

## 📚 What This Project Demonstrates

- Smart contract architecture with factory pattern  
- On-chain ETH handling  
- ERC-20 reward token minting  
- Frontend ↔ blockchain interaction using Ethers v6  
- Real testnet deployment  
- Full-stack Web3 development  

---

## 🎓 Academic Context

This project was developed as a **Final Blockchain Development Project**  
and demonstrates practical knowledge of decentralized application architecture and smart contract integration.

---

Sepolia Test Network  
