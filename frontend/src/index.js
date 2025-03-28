import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { testConnection, createTestUser } from './utils/supabaseClient';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Test connection on app start
testConnection().then(connected => {
  if (connected) {
    console.log('Successfully connected to Supabase');
    // Optionally create a test user
    createTestUser().then(result => {
      if (result.success) {
        console.log('Test user created successfully');
      } else {
        console.error('Failed to create test user:', result.error);
      }
    });
  } else {
    console.error('Failed to connect to Supabase');
  }
});
