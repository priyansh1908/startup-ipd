import React, { useState } from 'react';

const InvestorPage = () => {
  const [startups] = useState([
    { name: 'Techify', industry: 'Technology', location: 'India', roi: '120%', logo: 'https://via.placeholder.com/80?text=Techify' },
    { name: 'GreenWorld', industry: 'Environment', location: 'India', roi: '150%', logo: 'https://via.placeholder.com/80?text=GreenWorld' },
    { name: 'HealthWave', industry: 'Healthcare', location: 'India', roi: '90%', logo: 'https://via.placeholder.com/80?text=HealthWave' },
    { name: 'EduSpark', industry: 'Education', location: 'India', roi: '110%', logo: 'https://via.placeholder.com/80?text=EduSpark' },
    { name: 'AgriTech Solutions', industry: 'Agriculture', location: 'India', roi: '140%', logo: 'https://via.placeholder.com/80?text=AgriTech' },
    { name: 'RetailBoost', industry: 'Retail', location: 'India', roi: '105%', logo: 'https://via.placeholder.com/80?text=RetailBoost' },
    { name: 'Zomato', industry: 'FMCG', location: 'India', roi: '65%', logo: 'https://via.placeholder.com/80?text=Zomato' },
    { name: 'Ispat Impex', industry: 'Steel', location: 'India', roi: '50%', logo: 'https://via.placeholder.com/80?text=Ispat' },
    { name: 'Image Technology', industry: 'IT', location: 'India', roi: '80%', logo: 'https://via.placeholder.com/80?text=ImageTech' },
    { name: 'Mehta & Sons', industry: 'Finance', location: 'India', roi: '100%', logo: 'https://via.placeholder.com/80?text=Mehta&Sons' },
  ]);

  const [filter, setFilter] = useState('');

  const filteredStartups = startups.filter(
    (startup) =>
      startup.name.toLowerCase().includes(filter.toLowerCase()) &&
      startup.location.toLowerCase() === 'india'
  );

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 min-h-screen animate-fadeIn">
      <div className="text-center mt-16">
        <h1 className="text-5xl font-extrabold text-blue-800 dark:text-blue-400 animate-slideIn">
          Welcome to Your Investor Dashboard!
        </h1>
        <p className="text-lg mt-4 text-gray-600 dark:text-gray-300">
          Explore high-potential startups and maximize your investments.
        </p>
      </div>

      <section className="my-12 text-center">
        <h2 className="text-3xl font-semibold text-blue-700 dark:text-blue-300 mb-6 animate-slideIn">
          Discover Startups
        </h2>
        <input
          type="text"
          placeholder="Search by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
        />
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-blue-700 dark:text-blue-300 mb-6 text-center animate-slideIn">
          Startup List (India)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-12">
          {filteredStartups.map((startup, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition duration-300 dark:bg-gray-800 flex items-center space-x-6 animate-fadeIn"
            >
              <img
                src={startup.logo}
                alt={`${startup.name} Logo`}
                className="w-20 h-20 object-cover rounded-full border-2 border-blue-400"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{startup.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Industry: {startup.industry}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Location: {startup.location}</p>
                <p className="text-sm text-blue-600 dark:text-blue-300 font-semibold">Expected ROI: {startup.roi}</p>
              </div>
            </div>
          ))}
          {filteredStartups.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400 mt-8 col-span-full">
              No startups match your search criteria.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default InvestorPage;
