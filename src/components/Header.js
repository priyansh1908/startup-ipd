import React from 'react';
import logo from '../assets/logo.png';

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 px-6 shadow-lg fixed w-full top-0 left-0 z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-10 h-10 mr-3" />
          <h1 className="text-2xl font-bold">StartupSuccess</h1>
        </div>
        <nav className="space-x-4">
          <a href="#about" className="hover:underline">About Us</a>
          <a href="#features" className="hover:underline">Features</a>
        </nav>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </header>
  );
};

export default Header;
