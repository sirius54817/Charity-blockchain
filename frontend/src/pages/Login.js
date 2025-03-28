import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Bubble animation variants
  const bubbleVariants = {
    animate: {
      y: [-20, 20],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  // Update background image array with more opacity and larger sizes
  const backgroundImages = [
    {
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80",
      position: "top-0 left-0",
      rotation: "rotate-3",
      size: "w-96 h-96"
    },
    {
      src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80",
      position: "top-0 right-0",
      rotation: "-rotate-6",
      size: "w-[500px] h-[400px]"
    },
    {
      src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
      position: "bottom-0 left-0",
      rotation: "rotate-6",
      size: "w-[450px] h-[350px]"
    },
    {
      src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80",
      position: "bottom-0 right-0",
      rotation: "-rotate-3",
      size: "w-[400px] h-[400px]"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Background overlay - changed to white with less opacity */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-0" />

      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <motion.div
          key={index}
          className={`absolute ${image.position} ${image.rotation} ${image.size} opacity-20 pointer-events-none`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 0.2,
            scale: 1,
            rotate: image.rotation.includes('-') ? -6 : 6
          }}
          transition={{
            duration: 3,
            delay: index * 0.4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <img
            src={image.src}
            alt="Background Charity"
            className="w-full h-full object-cover rounded-none"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-indigo-100/30" />
        </motion.div>
      ))}

      {/* Animated Bubbles - adjusted for light background */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-gradient-to-br from-purple-200/20 to-indigo-200/20 backdrop-blur-sm"
          style={{
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: 1
          }}
          variants={bubbleVariants}
          animate="animate"
          custom={i}
          initial={{ opacity: 0.1 }}
        />
      ))}

      {/* Main Content */}
      <div className="container mx-auto px-4 h-screen flex items-center justify-center relative z-10">
        <div className="max-w-md w-full space-y-8 relative">
          {/* Enhanced glow effect - adjusted for light background */}
          <div className="absolute inset-0 bg-purple-200/20 blur-3xl rounded-full" />
          
          {/* Logo and Main Image */}
          <div className="text-center relative">
            <motion.img
              src="/images/log.png"
              alt=""
              className="mx-auto h-24 w-auto"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.h2
              className="mt-6 text-4xl font-bold text-gray-900"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Welcome Back
            </motion.h2>
          </div>

          {/* Login Form */}
          <motion.div
            className="mt-8 bg-white shadow-xl rounded-2xl p-8 border border-gray-200 relative z-20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {error && (
              <motion.div
                className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-purple-600 hover:text-purple-500">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Sign in'
                  )}
                </motion.button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600">New to CyberPunkz?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Create new account
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login; 