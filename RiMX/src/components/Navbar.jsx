import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }}
      className="fixed w-full top-0 z-50 flex justify-between items-center p-6 px-4 md:px-12 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"
    >
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        className="flex items-center space-x-4"
      >
        <Link to="/" className="text-2xl font-bold text-white flex items-center">
          <Zap className="text-blue-500 mr-2" /> RiMX
        </Link>
        <nav className="hidden md:flex ml-12 space-x-6">
          <Link 
            to="#features" 
            className="hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Features
          </Link>
          <Link 
            to="#solutions" 
            className="hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Solutions
          </Link>
          <Link 
            to="#pricing" 
            className="hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Pricing
          </Link>
          <Link 
            to="#resources" 
            className="hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Resources
          </Link>
          <Link 
            to="#contact" 
            className="hover:text-blue-400 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Contact
          </Link>
        </nav>
      </motion.div>
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
        className="space-x-4"
      >
        <Link to="/login">
          <button className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Up
          </motion.button>
        </Link>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;