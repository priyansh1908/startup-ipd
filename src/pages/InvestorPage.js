import React from 'react';

const InvestorPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-6">Welcome, Investor!</h1>
      <p className="text-xl mb-4">Here you can explore startups and find your next big investment opportunity.</p>
      <button
        className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition"
        onClick={() => alert('Investor functionality coming soon!')}
      >
        Get Started
      </button>
    </div>
  );
};

export default InvestorPage;
