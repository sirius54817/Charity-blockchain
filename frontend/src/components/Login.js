import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, testDatabaseConnection, testUserCreation, testDirectPostgresConnection } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login with username:', username);
        
        if (!username || !password) {
          setError('Username and password are required');
          setIsLoading(false);
          return;
        }
        
        // First test database connection
        const connectionTest = await testDatabaseConnection();
        if (!connectionTest.success) {
          setError('Database connection failed: ' + connectionTest.error);
          setIsLoading(false);
          return;
        }
        
        const { user, error } = await loginUser(username, password);
        
        if (error) {
          console.error('Login error:', error);
          setError(error);
          setIsLoading(false);
          return;
        }
        
        console.log('Login successful, user:', user);
        setUser(user);
        navigate('/dashboard');
      } else {
        if (!username || !password || !fullName || !email) {
          setError('All fields are required');
          setIsLoading(false);
          return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError('Please enter a valid email address');
          setIsLoading(false);
          return;
        }
        
        // Validate password strength
        if (password.length < 8) {
          setError('Password must be at least 8 characters long');
          setIsLoading(false);
          return;
        }
        
        const { user, error } = await registerUser(username, password, fullName, email);
        if (error) {
          setError(error);
        } else {
          setUser(user);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Login/registration error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await testDatabaseConnection();
      if (result.success) {
        alert('Database connection successful!');
      } else {
        setError('Database connection failed: ' + result.error);
      }
    } catch (err) {
      setError('Test failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestDirectConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await testDirectPostgresConnection();
      if (result.success) {
        alert('Direct PostgreSQL connection successful!');
      } else {
        setError('Direct PostgreSQL connection failed: ' + result.error);
      }
    } catch (err) {
      setError('Direct connection test failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        {!isLogin && (
          <>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </>
        )}
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      
      <p className="toggle-form">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          type="button" 
          className="toggle-button"
          onClick={() => setIsLogin(!isLogin)}
          disabled={isLoading}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
      
      <div className="mt-4">
        <button 
          type="button" 
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={handleTestConnection}
          disabled={isLoading}
        >
          Test Database Connection
        </button>
      </div>
      
      <div className="mt-2">
        <button 
          type="button" 
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={handleTestDirectConnection}
          disabled={isLoading}
        >
          Test Direct PostgreSQL Connection
        </button>
      </div>
    </div>
  );
};

export default Login; 