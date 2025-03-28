import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchTransactions();
  }, [user.id]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/donations/user/${user.id}`
      );
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Date</th>
              <th className="px-6 py-3 border-b">Charity</th>
              <th className="px-6 py-3 border-b">Amount</th>
              <th className="px-6 py-3 border-b">Status</th>
              <th className="px-6 py-3 border-b">Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 border-b">
                  {new Date(tx.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b">
                  {tx.charities.name}
                </td>
                <td className="px-6 py-4 border-b">
                  ${tx.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 border-b">
                  <span className={`px-2 py-1 rounded ${
                    tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-4 border-b font-mono text-sm">
                  {tx.transaction_hash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistory; 