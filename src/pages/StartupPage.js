import React, { useState } from 'react';

const StartupPage = () => {
  const [formData, setFormData] = useState({
    industry: '',
    foundedDate: '',
    investments: '',
    employees: '',
    revenue: '',
    fundingStatus: '',
    ebitda: '',
    yoyGrowth: '',
  });

  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 min-h-screen animate-fadeIn">
      {/* Welcome Section */}
      <div className="mt-20 mb-12 text-center animate-slideIn">
        <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
          Welcome to Your Startup Dashboard!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Enter your details below to get personalized insights and predictions for your startup.
        </p>
      </div>

      {/* Business Insights Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-500 dark:text-blue-300 animate-slideIn">
          Business Insights
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 animate-fadeIn">
          Provide accurate information to unlock meaningful insights for your startup's growth.
        </p>
      </section>

      {/* Startup Details Form */}
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800 max-w-4xl mx-auto animate-fadeIn"
      >
        <h3 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          Enter Your Startup Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., Technology"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Founded Date</label>
            <input
              type="date"
              name="foundedDate"
              value={formData.foundedDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Number of Investments</label>
            <input
              type="number"
              name="investments"
              value={formData.investments}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Number of Employees</label>
            <input
              type="number"
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., 50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Revenue ($)</label>
            <input
              type="number"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., 500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Funding Status</label>
            <select
              name="fundingStatus"
              value={formData.fundingStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Status</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Bootstrapped">Bootstrapped</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">EBITDA ($)</label>
            <input
              type="number"
              name="ebitda"
              value={formData.ebitda}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., 200000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Year-on-Year Growth (%)</label>
            <input
              type="number"
              name="yoyGrowth"
              value={formData.yoyGrowth}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., 20"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-8 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition animate-slideIn"
        >
          Submit
        </button>
      </form>

      {/* Display Submitted Data */}
      {submittedData && (
        <section className="mt-12 animate-fadeIn">
          <h3 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
            Submitted Details
          </h3>
          <div className="p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 max-w-3xl mx-auto">
            {Object.entries(submittedData).map(([key, value]) => (
              <p className="mb-2" key={key}>
                <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
                {key === 'revenue' || key === 'ebitda' ? `$${value}` : value}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StartupPage;
