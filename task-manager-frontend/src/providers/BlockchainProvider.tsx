/* blockchain-task-maanger/task-manager-frontend/src/providers/BlockchainProviders.tsx */
import { useEffect, useState } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import { BlockchainContext } from '../contexts/BlockchainContext';
import TaskManagerABI from '../contracts/TaskManager.json';

export const BlockchainProvider = ({ children }: { children: React.ReactNode }) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS as string;

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      throw new Error('MetaMask not installed');
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();

      setCurrentAccount(accounts[0]);
      setContract(new Contract(contractAddress, TaskManagerABI.abi, signer));
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum?.isConnected()) {
        await connectWallet();
      }
    };
    checkWalletConnection();
  }, []);

  return (
    <BlockchainContext.Provider
      value={{
        contract,
        currentAccount,
        connectWallet,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};