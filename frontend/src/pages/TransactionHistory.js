import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

function TransactionHistory() {
  // Add this sample data
  const sampleTransactions = [
    {
      id: 1,
      charities: {
        name: "Emergency Medical Relief"
      },
      amount: 250.00,
      status: "completed",
      transaction_hash: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
      id: 2,
      charities: {
        name: "School Building Project"
      },
      amount: 500.00,
      status: "pending",
      transaction_hash: "0x901f35Aa7744B0642935c4b854Bc454e4438d12c"
    },
    {
      id: 3,
      charities: {
        name: "Wildlife Conservation"
      },
      amount: 150.00,
      status: "completed",
      transaction_hash: "0xstu123Bb8855C0532925a3b844Bc454e4438f87d"
    },
    {
      id: 4,
      charities: {
        name: "Ocean Cleanup Initiative"
      },
      amount: 300.00,
      status: "completed",
      transaction_hash: "0xdef456Dd9966D0532925a3b844Bc454e4438a45e"
    },
    {
      id: 5,
      charities: {
        name: "Food Bank Support"
      },
      amount: 175.00,
      status: "pending",
      transaction_hash: "0xjkl789Ee2233E0532925a3b844Bc454e4438b98f"
    }
  ];

  // Replace the existing useState and useEffect with this:
  const [transactions] = useState(sampleTransactions);
  const [loading] = useState(false);
  const [error] = useState(null);

  // Remove the fetchTransactions function since we're using static data

  // Keep the existing conditional renders for loading and error states

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charity
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction Hash
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
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tx.charities?.name || 'Unknown Charity'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${tx.amount?.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    tx.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                  {tx.transaction_hash}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistory; 