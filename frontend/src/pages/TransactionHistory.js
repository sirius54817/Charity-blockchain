import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Web3 from 'web3';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    connectWallet();
    // Listen for new transactions
    if (window.ethereum) {
      window.ethereum.on('message', (message) => {
        if (message.type === 'eth_subscription') {
          refreshTransactions();
        }
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('message');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      fetchTransactions(accounts[0]);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        fetchTransactions(accounts[0]);
      });

    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError('Failed to connect to MetaMask');
    }
  };

  const fetchTransactions = async (address) => {
    try {
      setLoading(true);
      setError(null);

      const web3 = new Web3(window.ethereum);

      // Get latest block number
      const latestBlock = await web3.eth.getBlockNumber();
      const fromBlock = Math.max(0, latestBlock - 5000); // Look back 5000 blocks

      // Get normal transactions
      const normalTxs = await web3.eth.getTransactionCount(address).then(async (nonce) => {
        const txPromises = [];
        
        for (let i = fromBlock; i <= latestBlock; i += 50) {
          const endBlock = Math.min(i + 49, latestBlock);
          const batch = new web3.BatchRequest();
          
          const promise = new Promise((resolve, reject) => {
            batch.add(
              web3.eth.getBlock.request(i, true, (error, block) => {
                if (error) reject(error);
                if (block && block.transactions) {
                  const addressTxs = block.transactions.filter(
                    tx => tx.from?.toLowerCase() === address.toLowerCase() || 
                         tx.to?.toLowerCase() === address.toLowerCase()
                  );
                  resolve(addressTxs);
                }
                resolve([]);
              })
            );
          });
          
          txPromises.push(promise);
          batch.execute();
        }

        const blockTxs = await Promise.all(txPromises);
        return blockTxs.flat();
      });

      // Format transactions
      const formattedTxs = await Promise.all(
        normalTxs.map(async (tx) => {
          try {
            const receipt = await web3.eth.getTransactionReceipt(tx.hash);
            const block = await web3.eth.getBlock(tx.blockNumber);
            
            return {
              id: tx.hash,
              transaction_hash: tx.hash,
              from: tx.from,
              to: tx.to || 'Contract Creation',
              amount: web3.utils.fromWei(tx.value, 'ether'),
              timestamp: block ? new Date(block.timestamp * 1000).toLocaleString() : new Date().toLocaleString(),
              status: receipt ? (receipt.status ? 'completed' : 'failed') : 'pending',
              blockNumber: tx.blockNumber,
              gasPrice: web3.utils.fromWei(tx.gasPrice, 'gwei'),
              gas: tx.gas,
              gasUsed: receipt?.gasUsed,
              confirmations: tx.blockNumber ? latestBlock - tx.blockNumber + 1 : 0,
              timeAgo: block ? getTimeAgo(block.timestamp * 1000) : 'Just now'
            };
          } catch (err) {
            console.error('Error formatting transaction:', err);
            return null;
          }
        })
      );

      // Filter out null values and sort by timestamp
      const validTxs = formattedTxs
        .filter(tx => tx !== null)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setTransactions(validTxs);
      localStorage.setItem('metamask_transactions', JSON.stringify(validTxs));

    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
      
      // Try to load from localStorage as fallback
      const storedTxs = localStorage.getItem('metamask_transactions');
      if (storedTxs) {
        setTransactions(JSON.parse(storedTxs));
        setError('Showing cached transactions. Please refresh for latest data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (let [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'Just now';
  };

  const refreshTransactions = () => {
    if (account) {
      fetchTransactions(account);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            {account ? (
              <span>Connected: {account.substring(0, 6)}...{account.substring(38)}</span>
            ) : (
              <span>Not connected</span>
            )}
          </div>
          <button
            onClick={refreshTransactions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-600">
          {error}
        </div>
      ) : !transactions.length ? (
        <div className="text-center p-8 text-gray-600">
          No transactions found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (ETH)
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gas (Gwei)
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hash
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <motion.tr 
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={tx.status === 'pending' ? 'bg-yellow-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{tx.timestamp}</div>
                    <div className="text-xs text-gray-500">{tx.timeAgo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      tx.from.toLowerCase() === account?.toLowerCase()
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {tx.from.toLowerCase() === account?.toLowerCase() ? 'Sent' : 'Received'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.from.substring(0, 6)}...{tx.from.substring(38)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tx.to.substring(0, 6)}...{tx.to.substring(38)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Number(tx.amount).toFixed(6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                      {tx.confirmations && tx.status === 'completed' && 
                        ` (${tx.confirmations} confirmations)`
                      }
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{Number(tx.gasPrice).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {tx.gasUsed ? `Used: ${tx.gasUsed}` : `Limit: ${tx.gas}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    <a 
                      href={`https://etherscan.io/tx/${tx.transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {tx.transaction_hash.substring(0, 6)}...{tx.transaction_hash.substring(62)}
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory; 