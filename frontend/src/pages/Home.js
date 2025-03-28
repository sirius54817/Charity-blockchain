import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView as framerUseInView, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink, Element } from 'react-scroll';

function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Background carousel images for hero section
  const carouselImages = [
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", // People helping
    "https://images.unsplash.com/photo-1469571486292-b53601010b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", // Community work
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", // Hands together
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80", // Children education
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"  // Volunteers
  ];

  // State for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Create ref for the image section using Framer Motion's useInView
  const ref = React.useRef(null);
  const inView = framerUseInView(ref, { once: false, amount: 0.1 });

  // Image data for the overlapping scroll section
  const images = [
    {
      src: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      alt: "Charity work 1",
      offsetY: -50,
    },
    {
      src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      alt: "Charity work 2",
      offsetY: 100,
    },
    {
      src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      alt: "Charity work 3",
      offsetY: -80,
    },
    {
      src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      alt: "Charity work 4",
      offsetY: 60,
    },
    {
      src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      alt: "Charity work 5",
      offsetY: -30,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Carousel */}
      <motion.div 
        className="relative h-screen flex items-center justify-center text-white overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Carousel Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <img 
              src={carouselImages[currentImageIndex]} 
              alt="Background" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70 z-10"></div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20 space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 z-20 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Fund Hope, Change Lives
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            A transparent blockchain-based platform where every donation makes a difference and every transaction is traceable.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition duration-300 mr-4"
            >
              Start Donating
            </Link>
            <ScrollLink
              to="featured-campaigns"
              smooth={true}
              duration={800}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300 inline-block cursor-pointer"
            >
              Explore Campaigns
            </ScrollLink>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 text-center z-20">
          <ScrollLink
            to="how-it-works"
            smooth={true}
            duration={800}
            className="text-white animate-bounce inline-block cursor-pointer"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </ScrollLink>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <Element name="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
                title: "Create a Campaign",
                description: "Set up your fundraising campaign in minutes with all the details about your cause."
              },
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Share With Everyone",
                description: "Spread the word through social media, email, and messaging to reach potential donors."
              },
              {
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                title: "Manage Transparently",
                description: "Every donation is recorded on the blockchain, ensuring complete transparency and trust."
              }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-lg text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Element>

      {/* Overlapping Images Section */}
      <Element name="impact-gallery" className="py-20 bg-gray-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Impact
          </motion.h2>
          
          <div ref={ref} className="relative h-[600px] md:h-[800px]">
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="absolute w-[250px] md:w-[350px] rounded-lg shadow-xl overflow-hidden"
                style={{
                  left: `${(index * 15) + 10}%`,
                  top: '50%',
                  zIndex: index,
                }}
                initial={{ 
                  y: image.offsetY,
                  opacity: 0,
                  rotate: index % 2 === 0 ? -5 : 5 
                }}
                animate={{ 
                  y: inView ? [image.offsetY, image.offsetY + 30, image.offsetY] : image.offsetY,
                  opacity: inView ? 1 : 0,
                  rotate: index % 2 === 0 ? -5 : 5
                }}
                transition={{ 
                  y: { 
                    repeat: Infinity, 
                    duration: 3 + index, 
                    repeatType: "reverse" 
                  },
                  opacity: { duration: 0.8, delay: index * 0.2 }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotate: 0,
                  zIndex: 10,
                  transition: { duration: 0.3 } 
                }}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <p className="text-white p-4 font-medium">Making a difference</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.p
            className="text-center text-gray-600 mt-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Through your generous donations, we've been able to support countless initiatives 
            and make a real difference in communities around the world.
          </motion.p>
        </div>
      </Element>

      {/* Featured Campaigns Section */}
      <Element name="featured-campaigns" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Campaigns
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Medical Treatment Fund",
                image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                raised: 8750,
                goal: 10000,
                description: "Help fund life-saving medical treatment for those in need."
              },
              {
                title: "Education for Children",
                image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                raised: 5200,
                goal: 15000,
                description: "Support education initiatives for underprivileged children."
              },
              {
                title: "Disaster Relief",
                image: "https://images.unsplash.com/photo-1469571486292-b53601010b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
                raised: 12500,
                goal: 20000,
                description: "Provide essential supplies to communities affected by natural disasters."
              }
            ].map((campaign, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <img src={campaign.image} alt={campaign.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{campaign.title}</h3>
                  <p className="text-gray-600 mb-4">{campaign.description}</p>
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>${campaign.raised.toLocaleString()} raised</span>
                      <span>${campaign.goal.toLocaleString()} goal</span>
                    </div>
                  </div>
                  <Link
                    to="/donate"
                    className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Donate Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/campaigns"
              className="inline-block bg-white border border-blue-500 text-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 transition duration-300"
            >
              View All Campaigns
            </Link>
          </div>
        </div>
      </Element>

      {/* Testimonials Section */}
      <Element name="testimonials" className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Success Stories
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "Thanks to the generous donors on this platform, we were able to fund our community garden project that now feeds over 50 families.",
                name: "Sarah Johnson",
                role: "Community Organizer"
              },
              {
                quote: "The transparency of this platform gave our donors confidence that their funds were being used exactly as promised. We exceeded our fundraising goal by 40%!",
                name: "Michael Chen",
                role: "Nonprofit Director"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-lg"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-12 h-12 text-blue-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 mb-6 italic">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-500 font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Element>

      {/* CTA Section */}
      <motion.div 
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join our community of donors and fundraisers who are changing lives through transparent giving.</p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              Start a Campaign
            </Link>
            <Link
              to="/campaigns"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home; 