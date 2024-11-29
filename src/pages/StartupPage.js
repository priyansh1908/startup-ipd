import React from 'react';

const StartupPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-6">Welcome, Startup!</h1>
      <p className="text-xl mb-4">Here you can evaluate and improve your startup's success chances.</p>
      <button
        className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition"
        onClick={() => alert('Startup functionality coming soon!')}
      >
        Explore
      </button>
    </div>
  );
};

export default StartupPage;
