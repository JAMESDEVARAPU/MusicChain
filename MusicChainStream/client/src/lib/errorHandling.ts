
import { toast } from '@/components/ui/use-toast';

export class Web3Error extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'Web3Error';
  }
}

export const handleTransactionError = (error: any) => {
  console.error('Transaction Error:', error);
  
  if (error instanceof Web3Error) {
    toast({
      title: 'Transaction Failed',
      description: error.message,
      variant: 'destructive',
    });
    return;
  }

  toast({
    title: 'Error',
    description: 'An unexpected error occurred. Please try again.',
    variant: 'destructive',
  });
};

export const validateTransaction = (amount: number, address: string) => {
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Web3Error('Invalid wallet address');
  }
  
  if (amount <= 0) {
    throw new Web3Error('Invalid transaction amount');
  }
};

export const secureWalletConnection = async (provider: any) => {
  try {
    // Request only necessary permissions
    const accounts = await provider.request({ 
      method: 'eth_requestAccounts',
      params: [{ eth_accounts: {} }]
    });
    
    return accounts[0];
  } catch (error) {
    throw new Web3Error('Failed to connect wallet securely');
  }
};
