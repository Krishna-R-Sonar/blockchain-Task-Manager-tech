/* blockchain-task-manager/task-manager-frontend/src/App.tsx */
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import ConnectWallet from './components/ConnectWallet';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <header className="App-header">
          <ConnectWallet />
          <TaskList />
        </header>
      </div>
    </ChakraProvider>
  );
}

export default App;
