/* blockchain-task-manager/task-manager-frontend/src/components/ConnectWallet.tsx */
import { Button, useToast } from '@chakra-ui/react';
import { useBlockchain } from '../contexts/BlockchainContext';

const ConnectWallet = () => {
  const { currentAccount, connectWallet } = useBlockchain();
  const toast = useToast();

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast({
        title: 'Wallet connected',
        description: `Connected as ${currentAccount?.slice(0, 6)}...${currentAccount?.slice(-4)}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Wallet connection failed',
        description: error.message || 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Button colorScheme="blue" onClick={handleConnect} m={4}>
      {currentAccount
        ? `Connected: ${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`
        : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectWallet;