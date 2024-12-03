import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../assets/logo.png';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header
      className={`bg-gradient-to-r ${
        darkMode ? 'from-gray-900 to-gray-700' : 'from-blue-600 to-blue-400'
      } text-white py-4 px-6 shadow-lg fixed w-full top-0 left-0 z-10`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo and Branding */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center"> {/* Link redirects to the homepage */}
            <img src={logo} alt="Logo" className="w-12 h-12 mr-4 rounded-full shadow-lg" />
            <h1 className="text-3xl font-bold tracking-tight">StartupSuccess</h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-lg">
          <a href="#about" className="hover:underline transition-colors duration-300">
            About Us
          </a>
          <a href="#features" className="hover:underline transition-colors duration-300">
            Our Features
          </a>
          <a href="#get-started" className="hover:underline transition-colors duration-300">
            Get Started
          </a>
          <a href="#faq" className="hover:underline transition-colors duration-300">
            FAQ
          </a>
          <a href="#stay-updated" className="hover:underline transition-colors duration-300">
            Stay Updated
          </a>
        </nav>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
            onClick={() => alert('Mobile menu functionality to be implemented')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
