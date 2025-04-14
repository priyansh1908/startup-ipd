import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell
} from "recharts";

// Dropdown Options
const industriesOptions = [
  { value: "3D Printing", label: "3D Printing" },
  { value: "AI", label: "AI" },
  { value: "E-Commerce", label: "E-Commerce" },
  { value: "FinTech", label: "FinTech" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "EdTech", label: "EdTech" },
  { value: "Blockchain", label: "Blockchain" },
  { value: "Cyber Security", label: "Cyber Security" },
  { value: "Gaming", label: "Gaming" },
  { value: "Logistics", label: "Logistics" },
  { value: "Manufacturing", label: "Manufacturing" },
];

const statesOptions = [
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Delhi", label: "Delhi" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "West Bengal", label: "West Bengal" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Telangana", label: "Telangana" },
];

const growthConfidenceOptions = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

const growthCategoryOptions = [
  { value: "Growing", label: "Growing" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const fundingStatusOptions = [
  { value: "Growing", label: "Growing" },
  { value: "Early Stage Venture", label: "Early Stage Venture" },
  { value: "Seed", label: "Seed" },
  { value: "M&A", label: "M&A" },
];

const revenueOptions = [
  { value: "Less than $1M", label: "Less than $1M" },
  { value: "$1M to $10M", label: "$1M to $10M" },
  { value: "$10M to $50M", label: "$10M to $50M" },
  { value: "$50M to $100M", label: "$50M to $100M" },
  { value: "$100M to $500M", label: "$100M to $500M" },
  { value: "$500M to $1B", label: "$500M to $1B" },
  { value: "$1B to $10B", label: "$1B to $10B" },
  { value: "$10B+", label: "$10B+" },
];

const investmentStageOptions = [
  { value: "Seed", label: "Seed" },
  { value: "Series A", label: "Series A" },
  { value: "Series B", label: "Series B" },
  { value: "Series C", label: "Series C" },
  { value: "IPO", label: "IPO" },
];

const employeeOptions = [
  { value: "1-10", label: "1-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-500", label: "201-500" },
  { value: "501-1000", label: "501-1000" },
  { value: "1001-5000", label: "1001-5000" },
  { value: "5001-10000", label: "5001-10000" },
  { value: "10000+", label: "10000+" },
];

const fundingAmountOptions = [
  { value: "$0 to $1M", label: "$0 to $1M" },
  { value: "$1M to $5M", label: "$1M to $5M" },
  { value: "$5M to $10M", label: "$5M to $10M" },
  { value: "$10M to $50M", label: "$10M to $50M" },
  { value: "$50M to $100M", label: "$50M to $100M" },
  { value: "$100M to $500M", label: "$100M to $500M" },
  { value: "$500M to $1B", label: "$500M to $1B" },
  { value: "$1B+", label: "$1B+" },
];

// React Component
const StartupPage = () => {
  // State
  const [formData, setFormData] = useState({
    Organization_Name: "",
    Industries: [],
    Headquarters_Location: [],
    Estimated_Revenue: "",
    Founded_Date: "",
    Investment_Stage: "",
    Industry_Groups: "",
    Number_of_Founders: "",
    Founders: "",
    Number_of_Employees: "",
    Number_of_Funding_Rounds: "",
    Funding_Status: "",
    Total_Funding_Amount: "",
    Growth_Category: "",
    Growth_Confidence: "",
    Monthly_visit: "",
    Visit_Duration_Growth: "",
    Patents_Granted: "",
    Visit_Duration: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [peerReport, setPeerReport] = useState(null);
  const [comparisonReport, setComparisonReport] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select input changes
  const handleSelectChange = (name, selectedOptions) => {
    setFormData({ ...formData, [name]: selectedOptions });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);
    setPeerReport(null);
    setComparisonReport(null);
    setSelectedStartup(null);
    const formattedData = {
      Organization_Name: formData.Organization_Name || null,
      Industries: formData.Industries.length > 0 ? formData.Industries.map((ind) => ind.value).join(", ") : null,
      Headquarters_Location: formData.Headquarters_Location.length > 0 ? formData.Headquarters_Location.map((loc) => loc.value).join(", ") : null,
      Estimated_Revenue: formData.Estimated_Revenue || null,
      Founded_Date: formData.Founded_Date ? parseInt(formData.Founded_Date) : null,
      Investment_Stage: formData.Investment_Stage || null,
      Industry_Groups: formData.Industry_Groups || null,
      Number_of_Founders: formData.Number_of_Founders ? parseInt(formData.Number_of_Founders) : null,
      Founders: formData.Founders || null,
      Number_of_Employees: formData.Number_of_Employees || null,
      Number_of_Funding_Rounds: formData.Number_of_Funding_Rounds ? parseInt(formData.Number_of_Funding_Rounds) : null,
      Funding_Status: formData.Funding_Status || null,
      Total_Funding_Amount: formData.Total_Funding_Amount || null,
      Growth_Category: formData.Growth_Category || null,
      Growth_Confidence: formData.Growth_Confidence || null,
      Monthly_visit: formData.Monthly_visit ? parseInt(formData.Monthly_visit) : null,
      Visit_Duration_Growth: formData.Visit_Duration_Growth ? parseFloat(formData.Visit_Duration_Growth) : null,
      Patents_Granted: formData.Patents_Granted ? parseInt(formData.Patents_Granted) : null,
      Visit_Duration: formData.Visit_Duration ? parseInt(formData.Visit_Duration) : null,
    };
    Object.keys(formattedData).forEach((key) => {
      if (formattedData[key] === null || formattedData[key] === "") {
        delete formattedData[key];
      }
    });
    try {
      const predResponse = await axios.post("http://127.0.0.1:8000/predict", formattedData);
      setPrediction(predResponse.data);
      const peerResponse = await axios.post("http://127.0.0.1:8000/peer_comparison", formattedData);
      setPeerReport(peerResponse.data);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      setError("Failed to fetch results. Please check the data and try again.");
    }
  };

  // Handle startup selection for comparison
  const handleStartupSelect = async (selectedOption) => {
    setSelectedStartup(selectedOption);
    setComparisonReport(null);
    if (selectedOption) {
      const formattedData = {
        startup_data: {
          Organization_Name: formData.Organization_Name || null,
          Industries: formData.Industries.length > 0 ? formData.Industries.map((ind) => ind.value).join(", ") : null,
          Headquarters_Location: formData.Headquarters_Location.length > 0 ? formData.Headquarters_Location.map((loc) => loc.value).join(", ") : null,
          Estimated_Revenue: formData.Estimated_Revenue || null,
          Founded_Date: formData.Founded_Date ? parseInt(formData.Founded_Date) : null,
          Investment_Stage: formData.Investment_Stage || null,
          Industry_Groups: formData.Industry_Groups || null,
          Number_of_Founders: formData.Number_of_Founders ? parseInt(formData.Number_of_Founders) : null,
          Founders: formData.Founders || null,
          Number_of_Employees: formData.Number_of_Employees || null,
          Number_of_Funding_Rounds: formData.Number_of_Funding_Rounds ? parseInt(formData.Number_of_Funding_Rounds) : null,
          Funding_Status: formData.Funding_Status || null,
          Total_Funding_Amount: formData.Total_Funding_Amount || null,
          Growth_Category: formData.Growth_Category || null,
          Growth_Confidence: formData.Growth_Confidence || null,
          Monthly_visit: formData.Monthly_visit ? parseInt(formData.Monthly_visit) : null,
          Visit_Duration_Growth: formData.Visit_Duration_Growth ? parseFloat(formData.Visit_Duration_Growth) : null,
          Patents_Granted: formData.Patents_Granted ? parseInt(formData.Patents_Granted) : null,
          Visit_Duration: formData.Visit_Duration ? parseInt(formData.Visit_Duration) : null,
        },
        selected_startup_name: selectedOption.value,
      };
      Object.keys(formattedData.startup_data).forEach((key) => {
        if (formattedData.startup_data[key] === null || formattedData.startup_data[key] === "") {
          delete formattedData.startup_data[key];
        }
      });
      try {
        const response = await axios.post("http://127.0.0.1:8000/compare_to_startup", formattedData);
        setComparisonReport(response.data);
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        setError("Failed to fetch comparison report.");
      }
    }
  };

  // Handle table sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Custom Tooltip for Bar Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-600 rounded shadow">
          <p className="text-gray-800 dark:text-gray-200">{`Feature: ${payload[0].payload.feature}`}</p>
          <p className="text-gray-800 dark:text-gray-200">{`Z-Score: ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Radar Chart
  const RadarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-600 rounded shadow">
          <p className="text-gray-800 dark:text-gray-200">{`Feature: ${payload[0].payload.feature}`}</p>
          <p className="text-gray-800 dark:text-gray-200">{`Z-Score Diff: ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Header */}
      <div className="mt-16 mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
          Startup Analysis Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover insights and predictions tailored for your startup.
        </p>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-xl shadow-2xl dark:bg-gray-800 max-w-4xl mx-auto border border-blue-200 dark:border-gray-700"
      >
        <h3 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          Enter Startup Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Organization Name", name: "Organization_Name", type: "text" },
            { label: "Industry Groups", name: "Industry_Groups", type: "text" },
            { label: "Founders", name: "Founders", type: "text" },
          ].map(({ label, name, type }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          {/* Multi-Select Fields */}
          <div>
            <label className="block text-sm font-medium mb-2">Industries</label>
            <Select
              options={industriesOptions}
              isMulti
              value={formData.Industries}
              onChange={(selected) => handleSelectChange("Industries", selected)}
              placeholder="Select industries..."
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Headquarters Location</label>
            <Select
              options={statesOptions}
              isMulti
              value={formData.Headquarters_Location}
              onChange={(selected) => handleSelectChange("Headquarters_Location", selected)}
              placeholder="Select locations..."
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>

          {/* Select Fields */}
          <div>
            <label className="block text-sm font-medium mb-2">Estimated Revenue</label>
            <Select
              options={revenueOptions}
              value={revenueOptions.find((opt) => opt.value === formData.Estimated_Revenue) || null}
              onChange={(selected) =>
                handleChange({ target: { name: "Estimated_Revenue", value: selected ? selected.value : "" } })
              }
              placeholder="Select revenue range..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Founded Date</label>
            <input
              type="number"
              name="Founded_Date"
              value={formData.Founded_Date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="Enter year (e.g., 2020)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Investment Stage</label>
            <Select
              options={investmentStageOptions}
              value={investmentStageOptions.find((opt) => opt.value === formData.Investment_Stage) || null}
              onChange={(selected) =>
                handleChange({ target: { name: "Investment_Stage", value: selected ? selected.value : "" } })
              }
              placeholder="Select stage..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Funding Status</label>
            <Select
              options={fundingStatusOptions}
              value={fundingStatusOptions.find((opt) => opt.value === formData.Funding_Status) || null}
              onChange={(selected) =>
                handleChange({ target: { name: "Funding_Status", value: selected ? selected.value : "" } })
              }
              placeholder="Select status..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Growth Category</label>
            <Select
              options={growthCategoryOptions}
              value={growthCategoryOptions.find((opt) => opt.value === formData.Growth_Category) || null}
              onChange={(selected) =>
                handleChange({ target: { name: "Growth_Category", value: selected ? selected.value : "" } })
              }
              placeholder="Select category..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Growth Confidence</label>
            <Select
              options={growthConfidenceOptions}
              value={growthConfidenceOptions.find((opt) => opt.value === formData.Growth_Confidence) || null}
              onChange={(selected) =>
                handleChange({ target: { name: "Growth_Confidence", value: selected ? selected.value : "" } })
              }
              placeholder="Select confidence..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Number of Employees</label>
            <Select
              options={employeeOptions}
              value={employeeOptions.find((opt) => opt.value === formData.Number_of_Employees) || null}
              onChange={(selected) =>
                handleChange({ target: { name: "Number_of_Employees", value: selected ? selected.value : "" } })
              }
              placeholder="Select number of employees..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Funding Amount</label>
            <Select
              options={fundingAmountOptions}
              value={fundingAmountOptions.find((opt) => opt.value === formData.Total_Funding_Amount) || null}
              onChange={(selected) =>
                handleChange({ target: { name: "Total_Funding_Amount", value: selected ? selected.value : "" } })
              }
              placeholder="Select total funding amount..."
            />
          </div>

          {/* Number Fields */}
          {[
            { label: "Number of Founders", name: "Number_of_Founders" },
            { label: "Number of Funding Rounds", name: "Number_of_Funding_Rounds" },
            { label: "Monthly Visit", name: "Monthly_visit" },
            { label: "Visit Duration Growth (%)", name: "Visit_Duration_Growth" },
            { label: "Patents Granted", name: "Patents_Granted" },
            { label: "Visit Duration (seconds)", name: "Visit_Duration" },
          ].map(({ label, name }, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <input
                type="number"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Analyze Startup
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-200 max-w-4xl mx-auto">
          {error}
        </div>
      )}

      {/* Prediction Results */}
      {prediction && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-2xl dark:bg-gray-800 max-w-4xl mx-auto border border-blue-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Prediction Results</h3>
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-lg">
              <span className="font-semibold">Status:</span> {prediction.prediction}
            </p>
          </div>
        </div>
      )}

      {/* Peer Comparison Report */}
      {peerReport && (
        <div className="mt-8 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center">
            Peer Comparison Report
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Overview</h4>
              <p className="text-lg">
                <span className="font-medium">Startup:</span> {peerReport.Startup_Name}
              </p>
              <p className="text-lg">
                <span className="font-medium">Similar Startups:</span>{" "}
                {peerReport.Similar_Startups.join(", ") || "None identified"}
              </p>
              {peerReport.Similar_Startups.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Compare to a Similar Startup</label>
                  <Select
                    options={peerReport.Similar_Startups.map((name) => ({ value: name, label: name }))}
                    value={selectedStartup}
                    onChange={handleStartupSelect}
                    placeholder="Select a startup..."
                    className="basic-single-select"
                    classNamePrefix="select"
                  />
                </div>
              )}
            </div>

            {/* Strengths Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-green-200 dark:border-green-700">
              <h4 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">Strengths</h4>
              <ul className="list-disc ml-6 space-y-2">
                {peerReport.Pros.map((pro, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">{pro}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-red-200 dark:border-red-700">
              <h4 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Weaknesses</h4>
              <ul className="list-disc ml-6 space-y-2">
                {peerReport.Cons.map((con, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">{con}</li>
                ))}
              </ul>
            </div>

            {/* Raw Comparison Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Feature Comparison (vs. Peers)
              </h4>
              <ul className="space-y-2">
                {peerReport.Raw_Comparison.map((item, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{item.Feature}:</span> Your Startup:{" "}
                    {item.Startup_Value != null ? item.Startup_Value.toFixed(2) : "N/A"}, Industry Avg:{" "}
                    {item.Industry_Avg != null ? item.Industry_Avg.toFixed(2) : "N/A"}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visualizations */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-gray-700 md:col-span-2">
              <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Performance Visualizations
              </h4>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h5 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                    Strengths & Weaknesses
                  </h5>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={peerReport.bar_chart_data} margin={{ top: 20, right: 20, left: 20, bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                      <XAxis
                        dataKey="feature"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={100}
                        tick={{ fill: "#4B5563" }}
                      />
                      <YAxis tick={{ fill: "#4B5563" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="z_score">
                        {peerReport.bar_chart_data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                    Performance vs. Industry
                  </h5>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={peerReport.radar_chart_data}>
                      <PolarGrid stroke="#ccc" />
                      <PolarAngleAxis dataKey="feature" tick={{ fill: "#4B5563" }} />
                      <PolarRadiusAxis tick={{ fill: "#4B5563" }} />
                      <Tooltip content={<RadarTooltip />} />
                      <Radar
                        name={peerReport.Startup_Name}
                        dataKey="startup_z_score"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Industry Avg"
                        dataKey="industry_avg"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.3}
                      />
                      <Legend wrapperStyle={{ color: "#4B5563" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            {peerReport.peer_data && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-blue-200 dark:border-gray-700 md:col-span-2">
                <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Comparison Table
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-blue-100 dark:bg-gray-700">
                        <th
                          className="p-3 cursor-pointer font-semibold text-gray-800 dark:text-gray-200"
                          onClick={() => handleSort("name")}
                        >
                          Startup Name
                          {sortConfig.key === "name" &&
                            (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
                        </th>
                        {peerReport.peer_data.length > 0 &&
                          Object.keys(peerReport.peer_data[0].metrics).map((feature) => (
                            <th
                              key={feature}
                              className="p-3 cursor-pointer font-semibold text-gray-800 dark:text-gray-200"
                              onClick={() => handleSort(feature)}
                            >
                              {feature}
                              {sortConfig.key === feature &&
                                (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {peerReport.peer_data
                        .slice()
                        .sort((a, b) => {
                          if (!sortConfig.key) return 0;
                          const aValue =
                            sortConfig.key === "name"
                              ? a.name
                              : a.metrics[sortConfig.key] || 0;
                          const bValue =
                            sortConfig.key === "name"
                              ? b.name
                              : b.metrics[sortConfig.key] || 0;
                          if (aValue === null || aValue === undefined) return 1;
                          if (bValue === null || bValue === undefined) return -1;
                          if (sortConfig.direction === "ascending") {
                            return aValue > bValue ? 1 : -1;
                          }
                          return aValue < bValue ? 1 : -1;
                        })
                        .map((startup, idx) => (
                          <tr
                            key={idx}
                            className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700"
                          >
                            <td className="p-3 text-gray-700 dark:text-gray-300">{startup.name}</td>
                            {Object.keys(startup.metrics).map((feature) => (
                              <td key={feature} className="p-3 text-gray-700 dark:text-gray-300">
                                {startup.metrics[feature] != null
                                  ? startup.metrics[feature].toFixed(2)
                                  : "N/A"}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Comparison Report */}
          {comparisonReport && (
            <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-200 dark:border-purple-700 max-w-4xl mx-auto">
              <h4 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
                Comparison with {comparisonReport.Selected_Startup}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">
                    Strengths
                  </h5>
                  <ul className="list-disc ml-6 space-y-2">
                    {comparisonReport.Pros.map((pro, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">
                    Weaknesses
                  </h5>
                  <ul className="list-disc ml-6 space-y-2">
                    {comparisonReport.Cons.map((con, idx) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StartupPage;