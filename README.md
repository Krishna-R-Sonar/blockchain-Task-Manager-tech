# Blockchain-Based Task Manager

A decentralized task management system built on Ethereum blockchain, featuring a Solidity smart contract and React frontend.

## Features

### Smart Contract (Solidity)
- **CRUD Operations**: Create, Read, Update, Delete tasks on blockchain
- **Ownership Management**: Only task owners can modify their tasks
- **Gas Optimization**: Efficient data structures for cost-effective transactions
- **Event Logging**: Track all task-related activities on-chain
- **Test Coverage**: Comprehensive Foundry tests for all contract functions

### Frontend (React)
- **Wallet Integration**: MetaMask connection for blockchain interactions
- **Real-time Updates**: Automatic refresh of task list
- **Responsive UI**: Clean and modern interface using Chakra UI
- **Transaction Feedback**: Toast notifications for all user actions
- **Task Management**: Intuitive interface for managing blockchain tasks

- ## Tech Stack

- **Smart Contracts**: Solidity (0.8.20)
- **Frontend**: React 18, TypeScript, Ethers.js 6
- **UI Framework**: Chakra UI
- **Testing**: Foundry (Forge)
- **Wallet**: MetaMask Integration
- **Deployment**: Ethereum/Polygon Testnets

## Installation

### Prerequisites
- Node.js v16+
- npm v8+
- MetaMask browser extension
- **Foundry Requirements**:
  - Linux/Unix system (Ubuntu recommended)
  - Windows users: Use WSL2 or Linux VM for Foundry operations

### Smart Contract Setup (Linux/Unix only)
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Navigate to contracts directory
cd contracts

# Install dependencies
forge install

# Compile contracts
forge build

# Run tests
forge test -vvv

# Deploy to testnet
forge script script/Deploy.s.sol:Deploy --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast

Frontend Setup

cd task-manager-frontend
npm install
npm start
