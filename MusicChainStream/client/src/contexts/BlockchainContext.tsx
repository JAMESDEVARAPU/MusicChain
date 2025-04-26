import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface BlockchainContextType {
  isConnected: boolean;
  account: string;
  walletBalance: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  payArtist: (artistId: number, amount: number) => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const { toast } = useToast();
  
  // Check if wallet is already connected on initial load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum && window.ethereum.selectedAddress) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            fetchBalance(accounts[0]);
          }
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
      }
    };
    
    checkConnection();
  }, []);
  
  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount("");
          setWalletBalance(0);
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);
          fetchBalance(accounts[0]);
        }
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);
  
  const fetchBalance = async (address: string) => {
    try {
      if (window.ethereum) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        
        // Convert from wei to eth
        const etherBalance = parseInt(balance, 16) / 1e18;
        setWalletBalance(parseFloat(etherBalance.toFixed(4)));
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet not found",
        description: "Please install MetaMask or another Web3 wallet to continue.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);
      fetchBalance(accounts[0]);
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount("");
    setWalletBalance(0);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };
  
  const payArtist = async (artistId: number, amount: number) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make payments.",
        variant: "destructive",
      });
      await connectWallet();
      return;
    }
    
    try {
      // Simulate blockchain transaction
      toast({
        title: "Processing Payment",
        description: "Your payment is being processed...",
      });
      
      // Make API call to backend
      const response = await fetch(`/api/artists/${artistId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          fromAddress: account,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Payment failed');
      }
      
      // Update balance
      fetchBalance(account);
      
      toast({
        title: "Payment Successful",
        description: `You have successfully supported the artist with ${amount} ETH.`,
      });
    } catch (error) {
      console.error("Payment failed:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <BlockchainContext.Provider
      value={{
        isConnected,
        account,
        walletBalance,
        connectWallet,
        disconnectWallet,
        payArtist,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  
  return context;
};

// Add type definition for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      selectedAddress?: string;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}
