import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Education() {
  const educationCauses = [
    {
      id: 'edu1',
      name: 'School Building Project',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80',
      description: 'Help build schools in underprivileged communities',
      ethAddress: '0x901...123',
      targetAmount: 80000,
      raisedAmount: 52000
    },
    {
      id: 'edu2',
      name: 'Digital Learning Initiative',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
      description: 'Provide computers and internet access to rural schools',
      ethAddress: '0x234...567',
      targetAmount: 45000,
      raisedAmount: 28000
    },
    {
      id: 'edu3',
      name: 'Teacher Training Program',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
      description: 'Support professional development for educators',
      ethAddress: '0x890...123',
      targetAmount: 35000,
      raisedAmount: 15000
    },
    {
      id: 'edu4',
      name: 'Girls Education Fund',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80',
      description: 'Empower girls through education and scholarships',
      ethAddress: '0x456...789',
      targetAmount: 65000,
      raisedAmount: 41000
    },
    {
      id: 'edu5',
      name: 'STEM Education Project',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
      description: 'Promote science and technology education in schools',
      ethAddress: '0x567...890',
      targetAmount: 55000,
      raisedAmount: 33000
    },
    {
      id: 'edu6',
      name: 'Library Development',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80',
      description: 'Build and stock libraries in underserved communities',
      ethAddress: '0x678...901',
      targetAmount: 40000,
      raisedAmount: 22000
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Education Projects</h1>
          <p className="text-xl text-gray-600">Support educational initiatives worldwide</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {educationCauses.map((cause) => (
            <motion.div
              key={cause.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={cause.image}
                  alt={cause.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{cause.name}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">{cause.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="text-blue-600 font-semibold">
                      {Math.round((cause.raisedAmount / cause.targetAmount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cause.raisedAmount / cause.targetAmount) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Raised: ${cause.raisedAmount.toLocaleString()}</span>
                    <span className="text-gray-600">Goal: ${cause.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Link 
                  to={`/donate?cause=${cause.id}&category=education`}
                  className="block"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                  >
                    Donate Now
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Education; 