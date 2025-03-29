import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Search, Home, Layers, CreditCard, Users, Mail } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Features", path: "/Features", icon: <Layers size={18} /> },
    { name: "Pricing", path: "/Pricing", icon: <CreditCard size={18} /> },
    { name: "Team", path: "/Teams", icon: <Users size={18} /> },
    { name: "Contact", path: "/ContactPage", icon: <Mail size={18} /> }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full top-0 z-50 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 shadow-lg" // Removed border-b
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Navigation */}
          <div className="flex items-center flex-1">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center mr-8">
              <Link to="/" className="flex items-center">
                <Zap className="h-7 w-7 text-blue-500" />
                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  RiMX
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "bg-gray-800 text-blue-400"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar and Auth Buttons */}
          <div className="flex items-center justify-end flex-1 space-x-4">
            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:block relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 bg-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              >
                Sign up
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-md hover:bg-gray-700/50"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-gray-800" // Removed border-t
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-2 py-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 bg-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Mobile Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-3 py-3 text-base font-medium ${
                  location.pathname === link.path
                    ? "text-blue-400 bg-gray-700/50"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/30"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="px-2 pt-2 pb-4">
              <Link
                to="/login"
                className="block w-full px-3 py-3 text-base font-medium text-center text-gray-300 hover:text-white hover:bg-gray-700/30 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block w-full mt-2 px-3 py-3 text-base font-medium text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;