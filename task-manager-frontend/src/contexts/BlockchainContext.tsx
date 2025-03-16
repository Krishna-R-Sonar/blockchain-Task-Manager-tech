/* blockchain-task-manager/task-manager-frontend/src/contexts/BlockchainContext.tsx */
import { createContext, useContext } from 'react';
import { Contract } from 'ethers';

type BlockchainContextType = {
  contract: Contract | null;
  currentAccount: string | null;
  connectWallet: () => Promise<void>;
};

export const BlockchainContext = createContext<BlockchainContextType>({
  contract: null,
  currentAccount: null,
  connectWallet: async () => {},
});

export const useBlockchain = () => useContext(BlockchainContext);