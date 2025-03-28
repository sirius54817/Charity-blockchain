import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import App from './App';
import './index.css';

// Initialize Supabase with environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App supabase={supabase} />
    </BrowserRouter>
  </React.StrictMode>
);
