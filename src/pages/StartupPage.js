import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, Label
} from "recharts";
import AnimatedBackground from "../components/AnimatedBackground";
import GlassCard from "../components/GlassCard";
import FuturisticButton from "../components/FuturisticButton";

// Dropdown Options
const industriesOptions = [
  { value: "FinTech", label: "FinTech" }, // Match pipeline.py sample
  { value: "AI", label: "AI" },
  { value: "E-Commerce", label: "E-Commerce" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "EdTech", label: "EdTech" },
  { value: "Blockchain", label: "Blockchain" },
  { value: "Cyber Security", label: "Cyber Security" },
  { value: "Gaming", label: "Gaming" },
  { value: "Logistics", label: "Logistics" },
  { value: "Manufacturing", label: "Manufacturing" },
];

const statesOptions = [
  { value: "Delhi", label: "Delhi" }, // Match pipeline.py sample
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "West Bengal", label: "West Bengal" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Telangana", label: "Telangana" },
];

const growthConfidenceOptions = [
  { value: "Low", label: "Low" }, // Match pipeline.py sample
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const growthCategoryOptions = [
  { value: "Medium", label: "Medium" }, // Match pipeline.py sample
  { value: "Growing", label: "Growing" },
  { value: "High", label: "High" },
];

const fundingStatusOptions = [
  { value: "Seed", label: "Seed" }, // Match pipeline.py sample
  { value: "Growing", label: "Growing" },
  { value: "Early Stage Venture", label: "Early Stage Venture" },
  { value: "M&A", label: "M&A" },
];

const revenueOptions = [
  { value: "Less than $1M", label: "Less than $1M" }, // Match pipeline.py sample
  { value: "$1M to $10M", label: "$1M to $10M" },
  { value: "$10M to $50M", label: "$10M to $50M" },
  { value: "$50M to $100M", label: "$50M to $100M" },
  { value: "$100M to $500M", label: "$100M to $500M" },
  { value: "$500M to $1B", label: "$500M to $1B" },
  { value: "$1B to $10B", label: "$1B to $10B" },
  { value: "$10B+", label: "$10B+" },
];

const investmentStageOptions = [
  { value: "Seed", label: "Seed" }, // Match pipeline.py sample
  { value: "Series A", label: "Series A" },
  { value: "Series B", label: "Series B" },
  { value: "Series C", label: "Series C" },
  { value: "IPO", label: "IPO" },
];

const employeeOptions = [
  { value: "1-10", label: "1-10" }, // Match pipeline.py sample
  { value: "11-50", label: "11-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-500", label: "201-500" },
  { value: "501-1000", label: "501-1000" },
  { value: "1001-5000", label: "1001-5000" },
  { value: "5001-10000", label: "5001-10000" },
  { value: "10000+", label: "10000+" },
];

const fundingAmountOptions = [
  { value: "$0 to $1M", label: "$0 to $1M" }, // Match pipeline.py sample
  { value: "$1M to $5M", label: "$1M to $5M" },
  { value: "$5M to $10M", label: "$5M to $10M" },
  { value: "$10M to $50M", label: "$10M to $50M" },
  { value: "$50M to $100M", label: "$50M to $100M" },
  { value: "$100M to $500M", label: "$100M to $500M" },
  { value: "$500M to $1B", label: "$500M to $1B" },
  { value: "$1B+", label: "$1B+" },
];

// Helper functions for personalized recommendations
const compareRevenue = (current, target) => {
  const revenueRanges = {
    "Less than $1M": 1,
    "$1M to $10M": 2,
    "$10M to $50M": 3,
    "$50M to $100M": 4,
    "$100M to $500M": 5,
    "$500M to $1B": 6,
    "$1B to $10B": 7,
    "$10B+": 8
  };
  
  const currentLevel = revenueRanges[current];
  const targetLevel = revenueRanges[target];
  
  if (currentLevel < targetLevel) {
    return `Need ${target} to reach next stage`;
  }
  return "Revenue target achieved";
};

const compareEmployees = (current, target) => {
  const employeeRanges = {
    "1-10": 1,
    "11-50": 2,
    "51-200": 3,
    "201-500": 4,
    "501-1000": 5,
    "1001-5000": 6,
    "5001-10000": 7,
    "10000+": 8
  };
  
  const currentLevel = employeeRanges[current];
  const targetLevel = employeeRanges[target];
  
  if (currentLevel < targetLevel) {
    return `Need to grow team to ${target}`;
  }
  return "Team size on track";
};

const generateActionItems = (formData, peerReport) => {
  const actionItems = [];
  
  // Revenue-based actions
  const revenueMetric = peerReport.Raw_Comparison.find(item => item.Feature === "Estimated Revenue");
  if (revenueMetric?.Startup_Value < revenueMetric?.Industry_Avg) {
    actionItems.push({
      title: "Revenue Growth Priority",
      description: "Focus on increasing revenue through market expansion and pricing optimization",
      metrics: `Target: ${formatRevenue(revenueMetric.Industry_Avg)}`
    });
  }

  // Growth-based actions
  if (formData.Growth_Confidence === "Low") {
    actionItems.push({
      title: "Growth Acceleration",
      description: "Implement aggressive growth strategies and market penetration tactics",
      metrics: "Target: Achieve Medium to High growth confidence"
    });
  }

  // Monthly visit optimization
  if (formData.Visit_Duration_Growth <= 0) {
    actionItems.push({
      title: "Engagement Enhancement",
      description: "Improve user engagement and retention through product optimization",
      metrics: `Target: Positive visit duration growth`
    });
  }

  // Funding optimization
  if (formData.Number_of_Funding_Rounds === 0) {
    actionItems.push({
      title: "Funding Strategy",
      description: "Prepare for initial funding round with focus on pitch deck and financial projections",
      metrics: "Target: Secure seed funding"
    });
  }

  return actionItems;
};

const generateIndustryInsights = (industry, monthlyVisits, visitGrowth, peerReport) => {
  const insights = [];
  
  // Industry-specific insights
  switch (industry) {
    case "FinTech":
      insights.push({
        opportunity: "Digital Payment Integration",
        action: "Expand payment gateway partnerships and implement blockchain solutions"
      });
      break;
    case "AI":
      insights.push({
        opportunity: "Machine Learning Implementation",
        action: "Develop AI-driven features and automate key processes"
      });
      break;
    case "E-Commerce":
      insights.push({
        opportunity: "Mobile Commerce Optimization",
        action: "Enhance mobile shopping experience and implement social commerce"
      });
      break;
    // Add cases for other industries
  }

  // Traffic-based insights
  if (monthlyVisits < 10000) {
    insights.push({
      opportunity: "Traffic Growth",
      action: "Implement SEO optimization and content marketing strategy"
    });
  }

  // Add competitor analysis insight
  if (peerReport.Similar_Startups.length > 0) {
    insights.push({
      opportunity: "Competitive Advantage",
      action: `Focus on differentiation from ${peerReport.Similar_Startups[0]} in your market segment`
    });
  }

  return insights;
};

const formatRevenue = (value) => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

// React Component
const StartupPage = () => {
  // State
  const [formData, setFormData] = useState({
    Organization_Name: "",
    Industries: null, // Changed to null for single-select
    Headquarters_Location: null, // Changed to null for single-select
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
  const [activeTab, setActiveTab] = useState("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select input changes
  const handleSelectChange = (name, selectedOption) => {
    setFormData({ ...formData, [name]: selectedOption });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);
    setPeerReport(null);
    setComparisonReport(null);
    setSelectedStartup(null);
    setIsSubmitting(true);
    
    // Check if all required fields are filled
    const requiredFields = [
      "Organization_Name",
      "Industries",
      "Headquarters_Location",
      "Estimated_Revenue",
      "Founded_Date",
      "Investment_Stage",
      "Industry_Groups",
      "Number_of_Founders",
      "Founders",
      "Number_of_Employees",
      "Number_of_Funding_Rounds",
      "Funding_Status",
      "Total_Funding_Amount",
      "Growth_Category",
      "Growth_Confidence",
      "Monthly_visit",
      "Visit_Duration_Growth",
      "Patents_Granted",
      "Visit_Duration"
    ];
    
    const missingFields = requiredFields.filter(field => {
      if (field === "Industries" || field === "Headquarters_Location") {
        return !formData[field];
      }
      return !formData[field] && formData[field] !== 0;
    });
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(", ")}`);
      setIsSubmitting(false);
      return;
    }
    
    const formattedData = {
      Organization_Name: formData.Organization_Name,
      Industries: formData.Industries.value,
      Headquarters_Location: formData.Headquarters_Location.value,
      Estimated_Revenue: formData.Estimated_Revenue,
      Founded_Date: parseFloat(formData.Founded_Date),
      Investment_Stage: formData.Investment_Stage,
      Industry_Groups: formData.Industry_Groups,
      Number_of_Founders: parseFloat(formData.Number_of_Founders),
      Founders: formData.Founders,
      Number_of_Employees: formData.Number_of_Employees,
      Number_of_Funding_Rounds: parseFloat(formData.Number_of_Funding_Rounds),
      Funding_Status: formData.Funding_Status,
      Total_Funding_Amount: formData.Total_Funding_Amount,
      Growth_Category: formData.Growth_Category,
      Growth_Confidence: formData.Growth_Confidence,
      Monthly_visit: parseFloat(formData.Monthly_visit),
      Visit_Duration_Growth: parseFloat(formData.Visit_Duration_Growth),
      Patents_Granted: parseFloat(formData.Patents_Granted),
      Visit_Duration: parseFloat(formData.Visit_Duration),
    };
    
    try {
      console.log("Sending data:", formattedData); // Debug log
      const predResponse = await axios.post("http://127.0.0.1:8000/predict", formattedData);
      setPrediction(predResponse.data);
      const peerResponse = await axios.post("http://127.0.0.1:8000/peer_comparison", formattedData);
      setPeerReport(peerResponse.data);
      setActiveTab("results");
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      setError("Failed to fetch results. Please check the data and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle startup selection for comparison
  const handleStartupSelect = async (selectedOption) => {
    setSelectedStartup(selectedOption);
    setComparisonReport(null);
    if (selectedOption) {
      const formattedData = {
        startup_data: {
          Organization_Name: formData.Organization_Name,
          Industries: formData.Industries.value,
          Headquarters_Location: formData.Headquarters_Location.value,
          Estimated_Revenue: formData.Estimated_Revenue,
          Founded_Date: parseFloat(formData.Founded_Date),
          Investment_Stage: formData.Investment_Stage,
          Industry_Groups: formData.Industry_Groups,
          Number_of_Founders: parseFloat(formData.Number_of_Founders),
          Founders: formData.Founders,
          Number_of_Employees: formData.Number_of_Employees,
          Number_of_Funding_Rounds: parseFloat(formData.Number_of_Funding_Rounds),
          Funding_Status: formData.Funding_Status,
          Total_Funding_Amount: formData.Total_Funding_Amount,
          Growth_Category: formData.Growth_Category,
          Growth_Confidence: formData.Growth_Confidence,
          Monthly_visit: parseFloat(formData.Monthly_visit),
          Visit_Duration_Growth: parseFloat(formData.Visit_Duration_Growth),
          Patents_Granted: parseFloat(formData.Patents_Granted),
          Visit_Duration: parseFloat(formData.Visit_Duration),
        },
        selected_startup_name: selectedOption.value,
      };
      try {
        console.log("Sending comparison data:", formattedData); // Debug log
        const response = await axios.post("http://127.0.0.1:8000/compare_to_startup", formattedData);
        setComparisonReport(response.data);
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        setError("Failed to fetch comparison report.");
      }
    }
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

  // Get prediction status color
  const getPredictionColor = (status) => {
    if (status === "Active") return "bg-green-500";
    if (status === "Closed") return "bg-red-500";
    return "bg-gray-500";
  };

  // Add this helper function
  const getStrategyDescription = (focus, stage) => {
    const strategies = {
      "Product Development": "Focus on core features and MVP validation",
      "Market Research": "Identify target market and user needs",
      "Initial User Acquisition": "Build initial user base through targeted marketing",
      "Basic Financial Planning": "Develop financial projections and funding strategy",
      "Market Expansion": "Expand to new market segments and regions",
      "Team Building": "Hire key roles and build core team",
      "Product Refinement": "Enhance features based on user feedback",
      "Sales Process Development": "Create scalable sales framework",
      "Scaling Operations": "Optimize and automate key processes",
      "Market Dominance": "Establish market leadership position",
      "Team Expansion": "Scale teams across functions",
      "Process Optimization": "Implement efficient operational systems",
      "Global Expansion": "Enter international markets",
      "Strategic Acquisitions": "Identify and execute M&A opportunities",
      "Product Portfolio Expansion": "Develop new product lines",
      "Enterprise Sales": "Build enterprise sales capabilities",
      "Market Consolidation": "Strengthen market position through strategic acquisitions and partnerships",
      "Strategic Partnerships": "Form key alliances with industry leaders and complementary businesses",
      "Innovation Pipeline": "Invest in R&D and new product development for long-term growth",
      "Operational Efficiency": "Optimize operations for scale and profitability",
      "IPO Preparation": "Prepare financial systems and documentation for public offering",
      "Institutional Investment": "Build relationships with institutional investors and analysts",
      "Board Development": "Strengthen board composition and corporate governance",
      "Public Relations": "Develop public company communication strategy and investor relations"
    };
    
    return strategies[focus] || "Focus on key metrics and growth";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-100 overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground color="#3B82F6" count={50} />

      <div className="relative">
        {/* Header Section */}
        <div className="text-center mt-16 mb-12 animate-fadeIn">
          <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Startup Analysis Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover insights and predictions tailored for your startup.
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-wrap">
            <FuturisticButton
              onClick={() => setActiveTab("form")}
              variant={activeTab === "form" ? "primary" : "outline"}
              size="small"
              className="mr-4"
            >
              Enter Startup Data
            </FuturisticButton>
            <FuturisticButton
              onClick={() => setActiveTab("results")}
              variant={activeTab === "results" ? "primary" : "outline"}
              size="small"
              disabled={!prediction}
            >
              Analysis Results
            </FuturisticButton>
          </div>
        </div>

        {/* Form Section */}
        {activeTab === "form" && (
          <GlassCard className="p-8 max-w-4xl mx-auto animate-fadeIn">
            <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Enter Startup Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Organization Name", name: "Organization_Name", type: "text" },
                  { label: "Industry Groups", name: "Industry_Groups", type: "text" },
                  { label: "Founders", name: "Founders", type: "text" },
                ].map(({ label, name, type }, index) => (
                  <div key={index} className="form-group">
                    <label className="block text-sm font-medium mb-2">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                    />
                  </div>
                ))}

                {/* Single-Select Fields */}
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <Select
                    options={industriesOptions}
                    value={formData.Industries}
                    onChange={(selected) => handleSelectChange("Industries", selected)}
                    placeholder="Select industry..."
                    className="basic-single-select"
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          borderColor: '#3B82F6'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        background: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(8px)'
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: 'white'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'white'
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white'
                      })
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2">Headquarters Location</label>
                  <Select
                    options={statesOptions}
                    value={formData.Headquarters_Location}
                    onChange={(selected) => handleSelectChange("Headquarters_Location", selected)}
                    placeholder="Select location..."
                    className="basic-single-select"
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          borderColor: '#3B82F6'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        background: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(8px)'
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: 'white'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'white'
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white'
                      })
                    }}
                  />
                </div>

                {/* Select Fields */}
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2">Estimated Revenue</label>
                  <Select
                    options={revenueOptions}
                    value={revenueOptions.find((opt) => opt.value === formData.Estimated_Revenue) || null}
                    onChange={(selected) =>
                      handleChange({ target: { name: "Estimated_Revenue", value: selected ? selected.value : "" } })
                    }
                    placeholder="Select revenue range..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          borderColor: '#3B82F6'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        background: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(8px)'
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: 'white'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'white'
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white'
                      })
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2">Founded Date</label>
                  <input
                    type="number"
                    name="Founded_Date"
                    value={formData.Founded_Date}
                    onChange={handleChange}
                    placeholder="Enter founded date"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2">Investment Stage</label>
                  <Select
                    options={investmentStageOptions}
                    value={investmentStageOptions.find((opt) => opt.value === formData.Investment_Stage) || null}
                    onChange={(selected) =>
                      handleChange({ target: { name: "Investment_Stage", value: selected ? selected.value : "" } })
                    }
                    placeholder="Select stage..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          borderColor: '#3B82F6'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        background: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(8px)'
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: 'white'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'white'
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white'
                      })
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2">Funding Status</label>
                  <Select
                    options={fundingStatusOptions}
                    value={fundingStatusOptions.find((opt) => opt.value === formData.Funding_Status) || null}
                    onChange={(selected) =>
                      handleChange({ target: { name: "Funding_Status", value: selected ? selected.value : "" } })
                    }
                    placeholder="Select status..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          borderColor: '#3B82F6'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        background: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(8px)'
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: 'white'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'white'
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white'
                      })
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2">Growth Category</label>
                  <Select
                    options={growthCategoryOptions}
                    value={growthCategoryOptions.find((opt) => opt.value === formData.Growth_Category) || null}
                    onChange={(selected) =>
                      handleChange({ target: { name: "Growth_Category", value: selected ? selected.value : "" } })
                    }
                    placeholder="Select category..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          borderColor: '#3B82F6'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        background: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(8px)'
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: 'white'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'white'
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white'
                      })
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2">Growth Confidence</label>
                  <Select
                    options={growthConfidenceOptions}
                    value={growthConfidenceOptions.find((opt) => opt.value === formData.Growth_Confidence) || null}
                    onChange={(selected) =>
                      handleChange({ target: { name: "Growth_Confidence", value: selected ? selected.value : "" } })
                    }
                    placeholder="Select confidence..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          borderColor: '#3B82F6'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        background: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(8px)'
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: 'white'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'white'
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white'
                      })
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2">Number of Employees</label>
                  <Select
                    options={employeeOptions}
                    value={employeeOptions.find((opt) => opt.value === formData.Number_of_Employees) || null}
                    onChange={(selected) =>
                      handleChange({ target: { name: "Number_of_Employees", value: selected ? selected.value : "" } })
                    }
                    placeholder="Select number of employees..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          borderColor: '#3B82F6'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        background: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(8px)'
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: 'white'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'white'
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white'
                      })
                    }}
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium mb-2">Total Funding Amount</label>
                  <Select
                    options={fundingAmountOptions}
                    value={fundingAmountOptions.find((opt) => opt.value === formData.Total_Funding_Amount) || null}
                    onChange={(selected) =>
                      handleChange({ target: { name: "Total_Funding_Amount", value: selected ? selected.value : "" } })
                    }
                    placeholder="Select total funding amount..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          borderColor: '#3B82F6'
                        }
                      }),
                      menu: (base) => ({
                        ...base,
                        background: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(8px)'
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        color: 'white'
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: 'white'
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white'
                      })
                    }}
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
                  <div key={index} className="form-group">
                    <label className="block text-sm font-medium mb-2">{label}</label>
                    <input
                      type="number"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>

              <FuturisticButton
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Startup"
                )}
              </FuturisticButton>
            </form>
          </GlassCard>
        )}

        {/* Error Message */}
        {error && (
          <GlassCard className="mt-8 p-4 border-red-500/50 max-w-4xl mx-auto animate-fadeIn">
            <div className="flex items-center text-red-400">
              <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </GlassCard>
        )}

        {/* Results Section */}
        {activeTab === "results" && prediction && (
          <div className="max-w-6xl mx-auto animate-fadeIn">
            {/* Prediction Results */}
            <div>
              <GlassCard className="p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-400">Prediction Results</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300">Status: <span className={`font-bold ${prediction.practical_prediction.label === "Active" ? "text-green-400" : "text-red-400"}`}>{prediction.practical_prediction.label}</span></p>
                    <p className="text-gray-300">Confidence: <span className="font-bold text-blue-400">{prediction.practical_prediction.confidence}</span></p>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${prediction.practical_prediction.label === "Active" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                    {prediction.practical_prediction.label === "Active" ? (
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Probability Comparison Graph */}
            <div className="mt-6 flex justify-center">
              <div className="p-6 w-full max-w-2xl bg-white rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-black text-center">Prediction Probabilities</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "With Hardwork Factor",
                          probability: prediction.no_hardwork_adjustment.probability * 100,
                          label: prediction.no_hardwork_adjustment.label,
                          fill: "#22c55e"  // green color
                        },
                        {
                          name: "Without Hardwork Factor",
                          probability: prediction.practical_prediction.probability * 100,
                          label: prediction.practical_prediction.label,
                          fill: "#ef4444"  // red color
                        }
                      ]}
                      margin={{ top: 30, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.2)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="black"
                        tick={{ fill: 'black' }}
                      />
                      <YAxis 
                        stroke="black"
                        tick={{ fill: 'black' }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 rounded-lg border border-gray-300 shadow-lg">
                                <p className="text-black font-medium">{payload[0].payload.name}</p>
                                <p className="text-black">Probability: {payload[0].value.toFixed(2)}%</p>
                                <p className="text-gray-600">Prediction: {payload[0].payload.label}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        formatter={(value) => <span style={{ color: 'black' }}>{value}</span>}
                      />
                      <Bar 
                        dataKey="probability" 
                        name="Probability (%)" 
                        fill="#333333"
                        radius={[4, 4, 0, 0]}
                        label={{
                          position: 'top',
                          fill: 'black',
                          fontSize: 14,
                          fontWeight: 'bold',
                          formatter: (value) => `${value.toFixed(1)}%`
                        }}
                      >
                        {/* Color the bars individually */}
                        {(entry, index) => (
                          <Cell fill={entry.fill} />
                        )}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Peer Comparison Report */}
            {peerReport && (
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Peer Comparison Report
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Overview Card */}
                  <GlassCard className="p-6">
                    <h4 className="text-xl font-semibold mb-4 text-white">Overview</h4>
                    <p className="text-lg text-gray-300">
                      <span className="font-medium">Startup:</span> {peerReport.Startup_Name}
                    </p>
                    <p className="text-lg text-gray-300">
                      <span className="font-medium">Similar Start-ups:</span>{" "}
                      {peerReport.Similar_Startups.join(", ") || "None identified"}
                    </p>
                    {peerReport.Similar_Startups.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Compare to a Similar Startup
                        </label>
                        <Select
                          options={peerReport.Similar_Startups.map((name) => ({ value: name, label: name }))}
                          value={selectedStartup}
                          onChange={handleStartupSelect}
                          placeholder="Select a startup..."
                          className="react-select-container"
                          classNamePrefix="react-select"
                          menuPortalTarget={document.body}
                          styles={{
                            control: (base) => ({
                              ...base,
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                borderColor: '#3B82F6'
                              }
                            }),
                            menu: (base) => ({
                              ...base,
                              background: 'rgba(17, 24, 39, 0.95)',
                              backdropFilter: 'blur(8px)',
                              zIndex: 9999
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999
                            }),
                            option: (base, state) => ({
                              ...base,
                              background: state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                              color: 'white'
                            }),
                            singleValue: (base) => ({
                              ...base,
                              color: 'white'
                            }),
                            input: (base) => ({
                              ...base,
                              color: 'white'
                            })
                          }}
                        />
                      </div>
                    )}
                  </GlassCard>

                  {/* Strengths Card */}
                  <GlassCard className="p-6 border-green-500/20">
                    <h4 className="text-xl font-semibold mb-4 text-green-400">Strengths</h4>
                    <ul className="list-disc ml-6 space-y-2 text-gray-300">
                      {peerReport.Pros.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </GlassCard>

                  {/* Weaknesses Card */}
                  <GlassCard className="p-6 border-red-500/20">
                    <h4 className="text-xl font-semibold mb-4 text-red-400">Weaknesses</h4>
                    <ul className="list-disc ml-6 space-y-2 text-gray-300">
                      {peerReport.Cons.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </GlassCard>

                  {/* Raw Comparison Card */}
                  <GlassCard className="p-6">
                    <h4 className="text-xl font-semibold mb-4 text-white">
                      Feature Comparison (vs. Peers)
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      {peerReport.Raw_Comparison.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{item.Feature}:</span> Your Startup:{" "}
                          {item.Startup_Value != null ? item.Startup_Value.toFixed(2) : "N/A"}, Industry Avg:{" "}
                          {item.Industry_Avg != null ? item.Industry_Avg.toFixed(2) : "N/A"}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>

                  {/* Visualizations */}
                  <GlassCard className="md:col-span-2">
                    <h4 className="text-xl font-semibold mb-4 text-white">
                      Performance Visualizations
                    </h4>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <h5 className="text-lg font-medium mb-2 text-gray-300">
                          Strengths & Weaknesses
                        </h5>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={peerReport.bar_chart_data} margin={{ top: 20, right: 20, left: 20, bottom: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                            <XAxis
                              dataKey="feature"
                              angle={-45}
                              textAnchor="end"
                              interval={0}
                              height={100}
                              tick={{ fill: "#9CA3AF" }}
                            />
                            <YAxis tick={{ fill: "#9CA3AF" }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(76, 90, 120, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.5rem',
                                color: '#fff'
                              }}
                            />
                            <Bar dataKey="z_score">
                              {peerReport.bar_chart_data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-medium mb-2 text-gray-300">
                          Performance vs. Industry
                        </h5>
                        <ResponsiveContainer width="100%" height={400}>
                          <RadarChart data={peerReport.radar_chart_data}>
                            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                            <PolarAngleAxis dataKey="feature" tick={{ fill: "#9CA3AF" }} />
                            <PolarRadiusAxis tick={{ fill: "#9CA3AF" }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.5rem',
                                color: '#fff'
                              }}
                            />
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
                            <Legend wrapperStyle={{ color: "#9CA3AF" }} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            )}

            {/* Comparison Report */}
            {comparisonReport && (
              <GlassCard className="mt-6 max-w-4xl mx-auto">
                <h4 className="text-xl font-semibold mb-4 text-purple-400">
                  Comparison with {comparisonReport.Selected_Startup}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-lg font-semibold mb-2 text-green-400">
                      Strengths
                    </h5>
                    <ul className="list-disc ml-6 space-y-2 text-gray-300">
                      {comparisonReport.Pros.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-lg font-semibold mb-2 text-red-400">
                      Weaknesses
                    </h5>
                    <ul className="list-disc ml-6 space-y-2 text-gray-300">
                      {comparisonReport.Cons.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Startup Compass - Personalized Insights */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4 text-white flex items-center">
                <span>Your Growth Roadmap</span>
                <span className="ml-2 text-sm text-gray-400">{formData.Industries?.label}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Status */}
                <div className="bg-white/5 rounded-lg p-6">
                  <h5 className="text-lg font-medium text-blue-400 mb-4">Current Position</h5>
                  
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{formData.Investment_Stage}</div>
                          <div className="text-sm text-gray-400 mt-1">Current Stage</div>
                        </div>
                        <div className={`text-sm px-3 py-1 rounded ${
                          formData.Growth_Category === "High" ? "bg-green-400/10 text-green-400" : 
                          formData.Growth_Category === "Medium" ? "bg-blue-400/10 text-blue-400" : 
                          "bg-yellow-400/10 text-yellow-400"
                        }`}>
                          {formData.Growth_Category} Growth
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded p-3">
                        <div className="text-white">{formData.Estimated_Revenue}</div>
                        <div className="text-sm text-gray-400 mt-1">Revenue</div>
                      </div>
                      <div className="bg-white/10 rounded p-3">
                        <div className="text-white">{formData.Number_of_Employees}</div>
                        <div className="text-sm text-gray-400 mt-1">Team Size</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Recommendations */}
                <div className="bg-white/5 rounded-lg p-6">
                  <h5 className="text-lg font-medium text-blue-400 mb-4">Priority Actions</h5>
                  
                  <div className="space-y-3">
                    {(() => {
                      const recommendations = [];

                      // Revenue-based recommendations
                      if (formData.Estimated_Revenue === "Less than $1M") {
                        recommendations.push({
                          title: "Revenue Growth Required",
                          action: "Implement monetization strategy and focus on paying customers",
                          priority: "Critical",
                          metric: "Target: $1M+ annual revenue"
                        });
                      }

                      // Growth-based recommendations
                      if (formData.Growth_Category === "Low") {
                        recommendations.push({
                          title: "Accelerate Growth",
                          action: `Expand ${formData.Industries?.label} market presence and increase customer acquisition`,
                          priority: "High",
                          metric: "Target: 20%+ monthly growth"
                        });
                      }

                      // Stage-specific recommendations
                      const stageRecommendations = {
                        "Pre-Seed": {
                          title: "Validate Product-Market Fit",
                          action: "Focus on user feedback and product iterations",
                          metric: "Target: 100+ active users"
                        },
                        "Seed": {
                          title: "Scale Core Operations",
                          action: "Build repeatable sales process and strengthen unit economics",
                          metric: "Target: 1000+ customers"
                        },
                        "Series A": {
                          title: "Accelerate Market Growth",
                          action: "Expand market reach and strengthen competitive position",
                          metric: "Target: Market leadership in core segment"
                        }
                      };

                      const stageRec = stageRecommendations[formData.Investment_Stage];
                      if (stageRec) {
                        recommendations.push({
                          ...stageRec,
                          priority: "High"
                        });
                      }

                      // Team size recommendations
                      if (formData.Number_of_Employees < 10 && formData.Investment_Stage !== "Pre-Seed") {
                        recommendations.push({
                          title: "Team Expansion Needed",
                          action: "Hire key roles in sales, product, and engineering",
                          priority: "Medium",
                          metric: "Target: 10+ team members"
                        });
                      }

                      return recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="bg-white/10 rounded p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{rec.title}</span>
                            <span className={`text-sm px-2 py-1 rounded ${
                              rec.priority === "Critical" ? "bg-red-400/10 text-red-400" :
                              rec.priority === "High" ? "bg-yellow-400/10 text-yellow-400" :
                              "bg-blue-400/10 text-blue-400"
                            }`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{rec.action}</p>
                          <p className="text-xs text-blue-400 mt-2">{rec.metric}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Next Milestone */}
              <div className="mt-6 bg-white/5 rounded-lg p-6">
                <h5 className="text-lg font-medium text-blue-400 mb-4">Next Milestone</h5>
                
                {(() => {
                  const nextStageRequirements = {
                    "Pre-Seed": {
                      next: "Seed",
                      requirements: [
                        { metric: "Revenue", target: "$100K+ ARR" },
                        { metric: "Product", target: "MVP with active users" },
                        { metric: "Team", target: "Core team of 5+" }
                      ]
                    },
                    "Seed": {
                      next: "Series A",
                      requirements: [
                        { metric: "Revenue", target: "$1M+ ARR" },
                        { metric: "Growth", target: "20%+ monthly growth" },
                        { metric: "Market", target: "Product-market fit" }
                      ]
                    },
                    "Series A": {
                      next: "Series B",
                      requirements: [
                        { metric: "Revenue", target: "$10M+ ARR" },
                        { metric: "Growth", target: "Strong unit economics" },
                        { metric: "Team", target: "Scaling operations" }
                      ]
                    }
                  };

                  const currentRequirements = nextStageRequirements[formData.Investment_Stage];
                  
                  if (!currentRequirements) {
                    return null;
                  }

                  return (
                    <div className="bg-white/10 rounded p-4">
                      <div className="text-white mb-3">Path to {currentRequirements.next}</div>
                      <div className="grid grid-cols-3 gap-4">
                        {currentRequirements.requirements.map((req, index) => (
                          <div key={index} className="text-sm">
                            <div className="text-gray-400">{req.metric}</div>
                            <div className="text-white mt-1">{req.target}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupPage;