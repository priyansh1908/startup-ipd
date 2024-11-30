import React, { useState } from 'react';

const InvestorPage = () => {
  const [startups] = useState([
    {
      name: 'Techify',
      industry: 'Technology',
      location: 'India',
      roi: '120%',
      logo: 'https://via.placeholder.com/80?text=Techify',
    },
    {
      name: 'GreenWorld',
      industry: 'Environment',
      location: 'India',
      roi: '150%',
      logo: 'https://via.placeholder.com/80?text=GreenWorld',
    },
    {
      name: 'HealthWave',
      industry: 'Healthcare',
      location: 'India',
      roi: '90%',
      logo: 'https://via.placeholder.com/80?text=HealthWave',
    },
    {
      name: 'EduSpark',
      industry: 'Education',
      location: 'India',
      roi: '110%',
      logo: 'https://via.placeholder.com/80?text=EduSpark',
    },
    {
      name: 'AgriTech Solutions',
      industry: 'Agriculture',
      location: 'India',
      roi: '140%',
      logo: 'https://via.placeholder.com/80?text=AgriTech',
    },
    {
      name: 'RetailBoost',
      industry: 'Retail',
      location: 'India',
      roi: '105%',
      logo: 'https://via.placeholder.com/80?text=RetailBoost',
    },
    {
        name: 'Zomato',
        industry: 'FMCG',
        location: 'India',
        roi: '65%',
        logo: 'https://via.placeholder.com/80?text=RetailBoost',
      },
      {
        name: 'Ispat impex',
        industry: 'Steel',
        location: 'India',
        roi: '50%',
        logo: 'https://via.placeholder.com/80?text=RetailBoost',
      },
      {
        name: 'Image technology',
        industry: 'IT',
        location: 'India',
        roi: '80%',
        logo: 'https://via.placeholder.com/80?text=RetailBoost',
      },
      {
        name: 'Mehta&sons',
        industry: 'Finance',
        location: 'India',
        roi: '100%',
        logo: 'https://via.placeholder.com/80?text=RetailBoost',
      },
  ]);

  const [filter, setFilter] = useState('');

  // Filter startups by name (search) and location (India)
  const filteredStartups = startups.filter(
    (startup) =>
      startup.name.toLowerCase().includes(filter.toLowerCase()) &&
      startup.location.toLowerCase() === 'india'
  );

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Add margin or padding to push content down */}
      <div className="mt-20">
        <h1 className="text-4xl font-bold mb-6">Welcome to Your Investor Dashboard!</h1>
      </div>

      {/* Search and Filter */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Discover Startups</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-lg p-2"
        />
      </section>

      {/* List of Startups */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Startup List (India)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStartups.map((startup, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 flex items-center space-x-4"
            >
              {/* Startup Logo */}
              <img
                src={startup.logo}
                alt={`${startup.name} Logo`}
                className="w-16 h-16 object-cover rounded-full"
              />
              {/* Startup Details */}
              <div>
                <h3 className="text-lg font-bold">{startup.name}</h3>
                <p>Industry: {startup.industry}</p>
                <p>Location: {startup.location}</p>
                <p>Expected ROI: {startup.roi}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message for No Results */}
        {filteredStartups.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
            No startups match your search criteria.
          </p>
        )}
      </section>
    </div>
  );
};

export default InvestorPage;
