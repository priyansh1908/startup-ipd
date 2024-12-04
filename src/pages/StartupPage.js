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

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  // Field Validation
  const validateField = (name, value) => {
    let error = '';
    if (!value) {
      error = 'This field is required';
    } else {
      switch (name) {
        case 'investments':
        case 'employees':
        case 'revenue':
        case 'ebitda':
        case 'yoyGrowth':
          if (isNaN(value) || value < 0) {
            error = 'Must be a positive number';
          }
          break;
        case 'foundedDate':
          if (new Date(value) > new Date()) {
            error = 'Date cannot be in the future';
          }
          break;
        default:
          break;
      }
    }
    return error;
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  // Check for Overall Form Validation
  const isFormValid = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setSubmittedData(formData);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Welcome Section */}
      <div className="mt-16 mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
          Welcome to Your Startup Dashboard!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Enter your details below to get personalized insights and predictions for your startup.
        </p>
      </div>

      {/* Startup Details Form */}
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-xl shadow-2xl dark:bg-gray-800 max-w-4xl mx-auto border border-blue-200 dark:border-gray-700"
      >
        <h3 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          Enter Your Startup Details
        </h3>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Industry', name: 'industry', type: 'text', placeholder: 'e.g., Technology' },
            { label: 'Founded Date', name: 'foundedDate', type: 'date' },
            { label: 'Number of Investments', name: 'investments', type: 'number', placeholder: 'e.g., 5' },
            { label: 'Number of Employees', name: 'employees', type: 'number', placeholder: 'e.g., 50' },
            { label: 'Revenue ($)', name: 'revenue', type: 'number', placeholder: 'e.g., 500000' },
            {
              label: 'Funding Status',
              name: 'fundingStatus',
              type: 'select',
              options: ['Seed', 'Series A', 'Series B', 'Bootstrapped'],
            },
            { label: 'EBITDA ($)', name: 'ebitda', type: 'number', placeholder: 'e.g., 200000' },
            { label: 'Year-on-Year Growth (%)', name: 'yoyGrowth', type: 'number', placeholder: 'e.g., 20' },
          ].map(({ label, name, type, placeholder, options }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              {type === 'select' ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select {label}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                  placeholder={placeholder}
                />
              )}
              {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`mt-8 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl transition ${
            Object.keys(errors).some((key) => errors[key]) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={Object.keys(errors).some((key) => errors[key])}
        >
          Submit
        </button>
      </form>

      {/* Display Submitted Data */}
      {submittedData && (
        <section className="mt-12">
          <h3 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
            Submitted Details
          </h3>
          <div className="p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800 max-w-3xl mx-auto">
            <table className="w-full text-left">
              <tbody>
                {Object.entries(submittedData).map(([key, value]) => (
                  <tr key={key}>
                    <th className="capitalize text-gray-700 dark:text-gray-300 py-2">{key.replace(/([A-Z])/g, ' $1')}</th>
                    <td className="text-gray-800 dark:text-gray-100">
                      {key === 'revenue' || key === 'ebitda' ? `$${value}` : value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default StartupPage;
