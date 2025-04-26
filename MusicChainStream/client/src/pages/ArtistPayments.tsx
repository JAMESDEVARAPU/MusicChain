import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ArtistPayments = () => {
  const { connectWallet, isConnected, account, walletBalance } = useBlockchain();
  
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });
  
  if (isLoadingTransactions) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954]"></div>
      </div>
    );
  }
  
  if (!isConnected) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto text-center bg-[#181818] rounded-lg p-10">
          <i className="ri-wallet-3-line text-6xl text-[#644EFF] mb-6"></i>
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-[#B3B3B3] mb-8 max-w-lg mx-auto">
            Connect your wallet to view your payment history, support your favorite artists with direct blockchain payments, and track your impact.
          </p>
          <Button 
            className="bg-[#644EFF] hover:bg-[#7161FF]"
            onClick={connectWallet}
          >
            <i className="ri-wallet-line mr-2"></i>
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }
  
  // Transform transactions data for visualizations
  const monthlyData = [
    { name: 'Jan', amount: 0.042 },
    { name: 'Feb', amount: 0.035 },
    { name: 'Mar', amount: 0.061 },
    { name: 'Apr', amount: 0.078 },
    { name: 'May', amount: 0.056 },
    { name: 'Jun', amount: 0.023 },
  ];
  
  const artistDistribution = [
    { name: 'The Blockchain Beats', value: 35 },
    { name: 'Crypto Keys', value: 25 },
    { name: 'Decentralized Sound', value: 20 },
    { name: 'Ethereum Echoes', value: 15 },
    { name: 'Other', value: 5 },
  ];
  
  const COLORS = ['#1DB954', '#644EFF', '#FFCE08', '#E91429', '#1AADCA'];
  
  return (
    <>
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 md:p-6 sticky top-0 z-10 bg-opacity-80 bg-[#181818] backdrop-blur-sm">
        <div className="hidden md:flex items-center space-x-4">
          <button className="bg-black bg-opacity-50 rounded-full p-1">
            <i className="ri-arrow-left-s-line text-xl text-white"></i>
          </button>
          <button className="bg-black bg-opacity-50 rounded-full p-1">
            <i className="ri-arrow-right-s-line text-xl text-white"></i>
          </button>
        </div>
        
        <SearchBar />
        
        <div className="flex items-center space-x-4">
          {isConnected && (
            <Button 
              className="py-1 px-3 bg-[#1DB954] rounded-full text-xs font-medium text-white hidden md:block"
            >
              {account.slice(0, 6)}...{account.slice(-4)}
            </Button>
          )}
          <div className="relative">
            <button className="bg-black bg-opacity-50 rounded-full h-8 w-8 flex items-center justify-center">
              <i className="ri-user-line text-white"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold font-heading mb-6">Artist Payments</h1>
        
        {/* Wallet Info */}
        <div className="bg-gradient-to-r from-[#644EFF] to-[#1DB954] rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="text-white text-opacity-80 mb-1">Connected Wallet</p>
              <p className="text-white font-semibold mb-2">{account}</p>
              <div className="flex items-center space-x-2">
                <span className="bg-white bg-opacity-20 text-white text-xs rounded-full px-2 py-0.5">
                  Ethereum
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-white text-opacity-80 mb-1">Balance</p>
              <p className="text-white text-2xl font-bold">{walletBalance} ETH</p>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#181818] border-[#282828]">
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-[#1DB954] bg-opacity-20 flex items-center justify-center mr-3">
                  <i className="ri-coin-line text-[#1DB954]"></i>
                </div>
                <h3 className="text-white font-medium">Total Payments</h3>
              </div>
              <p className="text-3xl font-bold text-white">0.295 ETH</p>
              <p className="text-[#B3B3B3] mt-1 text-sm">Lifetime</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#181818] border-[#282828]">
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-[#644EFF] bg-opacity-20 flex items-center justify-center mr-3">
                  <i className="ri-user-star-line text-[#644EFF]"></i>
                </div>
                <h3 className="text-white font-medium">Artists Supported</h3>
              </div>
              <p className="text-3xl font-bold text-white">12</p>
              <p className="text-[#B3B3B3] mt-1 text-sm">Including 5 blockchain artists</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#181818] border-[#282828]">
            <CardContent className="p-6">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mr-3">
                  <i className="ri-bar-chart-line text-green-500"></i>
                </div>
                <h3 className="text-white font-medium">This Month</h3>
              </div>
              <p className="text-3xl font-bold text-white">0.023 ETH</p>
              <p className="text-[#B3B3B3] mt-1 text-sm">Across 3 artists</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-[#181818] border-[#282828]">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-4">Monthly Payments</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#282828" />
                    <XAxis dataKey="name" stroke="#B3B3B3" />
                    <YAxis stroke="#B3B3B3" />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#282828', 
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="amount" fill="#1DB954" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#181818] border-[#282828]">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-4">Artist Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={artistDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {artistDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#282828', 
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Transaction History */}
        <Card className="bg-[#181818] border-[#282828]">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold text-xl mb-4">Transaction History</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#282828] text-[#B3B3B3] text-xs">
                    <th className="py-3 px-4 text-left font-medium">DATE</th>
                    <th className="py-3 px-4 text-left font-medium">ARTIST</th>
                    <th className="py-3 px-4 text-left font-medium">AMOUNT</th>
                    <th className="py-3 px-4 text-left font-medium">STATUS</th>
                    <th className="py-3 px-4 text-right font-medium">TRANSACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions && transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-[#282828] hover:bg-[#282828]">
                      <td className="py-4 px-4 text-white">{tx.date}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <img
                            src={tx.artistImg}
                            alt={tx.artist}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <span className="text-white">{tx.artist}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">{tx.amount} ETH</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === 'Completed' 
                            ? 'bg-green-500 bg-opacity-20 text-green-400' 
                            : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a 
                          href={`https://etherscan.io/tx/${tx.txHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#644EFF] hover:underline text-sm flex items-center justify-end"
                        >
                          <span className="hidden md:inline">{tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}</span>
                          <span className="md:hidden">View</span>
                          <i className="ri-external-link-line ml-1"></i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {(!transactions || transactions.length === 0) && (
              <div className="text-center py-12">
                <i className="ri-file-list-3-line text-4xl text-[#B3B3B3] mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
                <p className="text-[#B3B3B3] mb-4">Start supporting artists to see your transaction history</p>
                <Button className="bg-[#644EFF] hover:bg-[#7161FF]">
                  Discover Artists
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ArtistPayments;
