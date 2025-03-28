import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    recentTransactions: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user.id]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/donations/user/${user.id}`
      );
      const data = await response.json();
      
      setStats({
        totalDonations: data.reduce((sum, tx) => sum + tx.amount, 0),
        recentTransactions: data.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Total Donations</h2>
          <p className="text-3xl font-bold text-blue-600">
            ${stats.totalDonations.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {stats.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center">
                <span>{tx.charities.name}</span>
                <span className="font-semibold">${tx.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 