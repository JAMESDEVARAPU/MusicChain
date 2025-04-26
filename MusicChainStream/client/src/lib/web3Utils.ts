// Constants
const ETHEREUM_MAINNET_ID = '0x1';
const ETHEREUM_SEPOLIA_ID = '0xaa36a7';
const ETHEREUM_GOERLI_ID = '0x5';

// Types
export interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  selectedAddress?: string;
  isMetaMask?: boolean;
  chainId?: string;
}

export interface Web3Error extends Error {
  code: number;
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask);
};

// Check if a wallet is connected
export const isWalletConnected = async (): Promise<boolean> => {
  if (!isMetaMaskInstalled()) return false;

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};

// Get current account
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) return null;

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts[0] || null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
};

// Connect to MetaMask
export const connectWallet = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0] || null;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

// Get account balance in ETH
export const getBalance = async (address: string): Promise<number> => {
  if (!isMetaMaskInstalled()) return 0;

  try {
    const balanceHex = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    
    // Convert from wei to ether
    return parseFloat((parseInt(balanceHex, 16) / 1e18).toFixed(4));
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
};

// Send a transaction
export const sendTransaction = async (
  fromAddress: string,
  toAddress: string,
  amountInEth: number
): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Convert amount from ETH to wei (1 ETH = 10^18 wei)
    const amountInWei = `0x${(amountInEth * 1e18).toString(16)}`;

    const transactionParameters = {
      from: fromAddress,
      to: toAddress,
      value: amountInWei,
      gas: '0x5208', // 21000 gas (standard transaction)
    };

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    return txHash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

// Check current network
export const getCurrentNetwork = async (): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    switch (chainId) {
      case ETHEREUM_MAINNET_ID:
        return 'Ethereum Mainnet';
      case ETHEREUM_SEPOLIA_ID:
        return 'Sepolia Testnet';
      case ETHEREUM_GOERLI_ID:
        return 'Goerli Testnet';
      default:
        return `Unknown Network (${chainId})`;
    }
  } catch (error) {
    console.error('Error getting current network:', error);
    throw error;
  }
};

// Switch network
export const switchNetwork = async (chainId: string): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      throw new Error('This network needs to be added to your MetaMask');
    }
    throw switchError;
  }
};

// Helper to format addresses for display
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper to format amounts for display
export const formatAmount = (amount: number): string => {
  return amount.toFixed(4);
};

// Subscribe to account changes
export const subscribeToAccountChanges = (callback: (accounts: string[]) => void): void => {
  if (!isMetaMaskInstalled()) return;

  window.ethereum.on('accountsChanged', callback);
};

// Unsubscribe from account changes
export const unsubscribeFromAccountChanges = (callback: (accounts: string[]) => void): void => {
  if (!isMetaMaskInstalled()) return;

  window.ethereum.removeListener('accountsChanged', callback);
};

// Subscribe to network changes
export const subscribeToNetworkChanges = (callback: (chainId: string) => void): void => {
  if (!isMetaMaskInstalled()) return;

  window.ethereum.on('chainChanged', callback);
};

// Unsubscribe from network changes
export const unsubscribeFromNetworkChanges = (callback: (chainId: string) => void): void => {
  if (!isMetaMaskInstalled()) return;

  window.ethereum.removeListener('chainChanged', callback);
};

// Simulate a transaction for development
export const simulateTransaction = async (
  fromAddress: string,
  toAddress: string,
  amountInEth: number
): Promise<string> => {
  // Generate a random transaction hash
  const txHash = `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
  
  console.log(`Simulated transaction from ${fromAddress} to ${toAddress} for ${amountInEth} ETH`);
  console.log(`Transaction hash: ${txHash}`);
  
  return txHash;
};
