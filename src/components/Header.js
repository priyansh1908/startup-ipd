import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import GlassCard from './GlassCard';
import FuturisticButton from './FuturisticButton';

const Header = ({ darkMode, setDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed w-full top-0 left-0 z-50 px-6 py-3">
        <GlassCard className="relative" blur="sm">
          <div className="flex justify-between items-center max-w-7xl mx-auto py-2">
        {/* Logo and Branding */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                <img src={logo} alt="Logo" className="relative w-12 h-12 rounded-full" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  StartupSuccess
                </h1>
              </div>
          </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { name: "Home", path: "/" },
                { name: "Startup", path: "/startup" },
                { name: "Investor", path: "/investor" },
                { name: "About", path: "/about" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
        </nav>

            {/* Dark Mode Toggle and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <FuturisticButton
          onClick={() => setDarkMode(!darkMode)}
                variant="outline"
                size="small"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </FuturisticButton>

        {/* Mobile Menu Button */}
          <button
                className="md:hidden text-gray-300 hover:text-white focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
            </svg>
          </button>
        </div>
      </div>
        </GlassCard>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full mt-2 px-6">
            <GlassCard className="py-4" blur="sm">
              <nav className="flex flex-col space-y-4">
                {[
                  { name: "Home", path: "/" },
                  { name: "Startup", path: "/startup" },
                  { name: "Investor", path: "/investor" },
                  { name: "About", path: "/about" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-300 hover:text-white transition-colors duration-300 px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </GlassCard>
          </div>
        )}
    </header>
      {/* Spacer to prevent content from being hidden under the fixed header */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;
