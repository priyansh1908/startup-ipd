import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-6 text-center">
      <p className="mb-4">&copy; 2024 StartupSuccess. All Rights Reserved.</p>
      <div className="flex justify-center space-x-4">
        <a href="#" className="hover:text-blue-200">Privacy Policy</a>
        <a href="#" className="hover:text-blue-200">Terms of Service</a>
      </div>
    </footer>
  );
};

export default Footer;
