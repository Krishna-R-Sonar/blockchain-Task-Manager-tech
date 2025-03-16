/* blockchain-task-manager/task-manager-frontend/src/global.d.ts */
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}