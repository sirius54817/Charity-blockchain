import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/transactions');
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error loading transactions: {error}</div>;
  if (!transactions || transactions.length === 0) return <div>No transactions found</div>;

  return (
    <div>
      {Array.isArray(transactions) && transactions.map((transaction, index) => (
        <div key={transaction.id || index}>
          {/* Your transaction display code here */}
          <p>{transaction.description || 'Transaction details'}</p>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const { user, loading } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Real charity campaign images (similar to GoFundMe style)
  const charityImages = [
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", // Education
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", // Healthcare
    "https://images.unsplash.com/photo-1469571486292-b53601010b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", // Community
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"  // Volunteers
  ];

  // Featured causes with real images
  const featuredCauses = [
    {
      title: "Education for All",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Support education initiatives for underprivileged children",
      progress: 75
    },
    {
      title: "Medical Relief",
      image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Provide essential medical supplies to communities in need",
      progress: 60
    },
    {
      title: "Environmental Protection",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      description: "Help preserve our planet for future generations",
      progress: 45
    }
  ];

  // Auto-scroll carousel with smooth transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === charityImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          variants={itemVariants}
        >
          {/* Hero Section with Animated Background */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <img 
                  src={charityImages[currentImageIndex]} 
                  alt="Charity Background" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-3000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70" />
              </motion.div>
            </AnimatePresence>
            
            {/* Carousel Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 z-20">
              <button 
                onClick={() => setCurrentImageIndex(prev => prev === 0 ? charityImages.length - 1 : prev - 1)}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all duration-300 group"
                aria-label="Previous slide"
              >
                <svg 
                  className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => setCurrentImageIndex(prev => prev === charityImages.length - 1 ? 0 : prev + 1)}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all duration-300 group"
                aria-label="Next slide"
              >
                <svg 
                  className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Carousel Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Welcome, {user.fullName}!
              </motion.h1>
              <motion.p 
                className="text-md md:text-lg lg:text-xl text-blue-100 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Your trusted platform for transparent giving
              </motion.p>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
              {charityImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`
                    w-2.5 h-2.5 rounded-full transition-all duration-300 
                    ${index === currentImageIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/80'
                    }
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-white/30"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 5,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </div>

          {/* Featured Causes Section */}
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-semibold mb-6 text-gray-800"
              variants={itemVariants}
            >
              Featured Causes
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCauses.map((cause, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl overflow-hidden shadow-lg"
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-48">
                    <img
                      src={cause.image}
                      alt={cause.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{cause.title}</h3>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-gray-600 text-sm mb-4">{cause.description}</p>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${cause.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-blue-600 font-semibold">{cause.progress}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions Section - Redesigned */}
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-semibold mb-8 text-gray-800"
              variants={itemVariants}
            >
              Quick Actions
            </motion.h2>
            <motion.div 
              className="grid md:grid-cols-3 gap-6"
              variants={itemVariants}
            >
              {user.role === 'donor' ? (
                <>
                  <Link to="/donate" className="block">
                    <motion.div 
                      className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                        <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Make a Donation</h3>
                      <p className="text-gray-600 text-sm">Support causes you care about with secure donations</p>
                    </motion.div>
                  </Link>

                  <Link to="/transactions" className="block">
                    <motion.div 
                      className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                        <svg className="w-6 h-6 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Donation History</h3>
                      <p className="text-gray-600 text-sm">Track and review your donation history</p>
                    </motion.div>
                  </Link>

                  <Link to="/impact" className="block">
                    <motion.div 
                      className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                        <svg className="w-6 h-6 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">View Impact</h3>
                      <p className="text-gray-600 text-sm">See how your donations are making a difference</p>
                    </motion.div>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/campaigns/new" className="block">
                    <motion.div 
                      className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                        <svg className="w-6 h-6 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Create Campaign</h3>
                      <p className="text-gray-600 text-sm">Start a new fundraising campaign</p>
                    </motion.div>
                  </Link>

                  <Link to="/campaigns" className="block">
                    <motion.div 
                      className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                        <svg className="w-6 h-6 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Manage Campaigns</h3>
                      <p className="text-gray-600 text-sm">View and manage your active campaigns</p>
                    </motion.div>
                  </Link>

                  <Link to="/analytics" className="block">
                    <motion.div 
                      className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                        <svg className="w-6 h-6 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics</h3>
                      <p className="text-gray-600 text-sm">Track campaign performance and impact</p>
                    </motion.div>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Global Crisis Statistics Section */}
          <div className="p-6 bg-gray-50">
            <motion.h2 
              className="text-2xl font-semibold mb-8 text-gray-800 text-center"
              variants={itemVariants}
            >
              Global Crisis Statistics
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={itemVariants}
            >
              {/* Hunger Crisis */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">828 Million</h3>
                <p className="text-gray-600 text-center text-sm">People affected by hunger worldwide</p>
                <div className="mt-4 text-xs text-center text-gray-500">Source: UN World Food Programme, 2023</div>
              </motion.div>

              {/* Refugee Crisis */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">108.4 Million</h3>
                <p className="text-gray-600 text-center text-sm">Forcibly displaced people globally</p>
                <div className="mt-4 text-xs text-center text-gray-500">Source: UNHCR, 2023</div>
              </motion.div>

              {/* Education Crisis */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0L3 9m0 0v11m9-11v11m0 0l9-5V9" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">244 Million</h3>
                <p className="text-gray-600 text-center text-sm">Children without access to education</p>
                <div className="mt-4 text-xs text-center text-gray-500">Source: UNESCO, 2023</div>
              </motion.div>

              {/* Healthcare Crisis */}
              <motion.div
                className="bg-white p-6 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">2 Billion</h3>
                <p className="text-gray-600 text-center text-sm">People lacking access to basic healthcare</p>
                <div className="mt-4 text-xs text-center text-gray-500">Source: WHO, 2023</div>
              </motion.div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              className="mt-8 text-center"
              variants={itemVariants}
            >
              <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                Every contribution matters in addressing these global challenges. Your support can make a real difference in someone's life.
              </p>
              <Link
                to="/donate"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Make a Difference Today
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Dashboard; 