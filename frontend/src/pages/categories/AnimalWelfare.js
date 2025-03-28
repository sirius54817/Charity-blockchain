import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function AnimalWelfare() {
  const animalCauses = [
    {
      id: 'animal1',
      name: 'Wildlife Conservation',
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=80',
      description: 'Protect endangered species and their habitats',
      ethAddress: '0xstu...123',
      targetAmount: 65000,
      raisedAmount: 43000
    },
    {
      id: 'animal2',
      name: 'Animal Shelter Support',
      image: 'https://images.unsplash.com/photo-1601758177266-bc599de87707?auto=format&fit=crop&w=1000&q=80',
      description: 'Help local animal shelters provide care and housing',
      ethAddress: '0xvwx...456',
      targetAmount: 35000,
      raisedAmount: 22000
    },
    {
      id: 'animal3',
      name: 'Marine Life Protection',
      image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=1000&q=80',
      description: 'Conserve marine ecosystems and protect sea life',
      ethAddress: '0xyz...789',
      targetAmount: 50000,
      raisedAmount: 31000
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Animal Welfare Projects</h1>
          <p className="text-xl text-gray-600">Help protect and care for animals in need</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animalCauses.map((cause) => (
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
                  to={`/donate?cause=${cause.id}&category=animals`}
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

export default AnimalWelfare; 