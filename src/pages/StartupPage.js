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
    <div className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="mt-20">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your Startup Dashboard!</h1>
        </div>
      {/* Business Insights */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Business Insights</h2>
        <p>Provide your startup's details to get personalized insights and predictions.</p>
      </section>

      {/* Startup Details Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
      >
        <h3 className="text-xl font-semibold mb-4">Enter Your Startup Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="e.g., Technology"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Founded Date</label>
            <input
              type="date"
              name="foundedDate"
              value={formData.foundedDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Investments</label>
            <input
              type="number"
              name="investments"
              value={formData.investments}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="e.g., 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Employees</label>
            <input
              type="number"
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="e.g., 50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Revenue ($)</label>
            <input
              type="number"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="e.g., 500000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Funding Status</label>
            <select
              name="fundingStatus"
              value={formData.fundingStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="">Select Status</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Series B">Series B</option>
              <option value="Bootstrapped">Bootstrapped</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">EBITDA ($)</label>
            <input
              type="number"
              name="ebitda"
              value={formData.ebitda}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="e.g., 200000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year-on-Year Growth (%)</label>
            <input
              type="number"
              name="yoyGrowth"
              value={formData.yoyGrowth}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="e.g., 20"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition"
        >
          Submit
        </button>
      </form>

      {/* Display Submitted Data */}
      {submittedData && (
        <section className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">Submitted Details</h3>
          <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <p><strong>Industry:</strong> {submittedData.industry}</p>
            <p><strong>Founded Date:</strong> {submittedData.foundedDate}</p>
            <p><strong>Number of Investments:</strong> {submittedData.investments}</p>
            <p><strong>Number of Employees:</strong> {submittedData.employees}</p>
            <p><strong>Revenue:</strong> ${submittedData.revenue}</p>
            <p><strong>Funding Status:</strong> {submittedData.fundingStatus}</p>
            <p><strong>EBITDA:</strong> ${submittedData.ebitda}</p>
            <p><strong>Year-on-Year Growth:</strong> {submittedData.yoyGrowth}%</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default StartupPage;
