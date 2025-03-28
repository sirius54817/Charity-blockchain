import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        Transparent Charity Donation System
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">For Donors</h2>
          <p className="mb-4">
            Make transparent donations and track how your funds are being used.
            Every transaction is recorded on the blockchain for complete
            transparency.
          </p>
          <Link
            to="/register"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Donating
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">For Charities</h2>
          <p className="mb-4">
            Register your charity and receive donations with full transparency.
            Build trust with donors through trackable fund usage.
          </p>
          <Link
            to="/register"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Register Charity
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home; 