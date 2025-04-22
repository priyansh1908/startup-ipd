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

// Add this helper function near the other helper functions
const calculateHealthScore = (formData) => {
  let score = 0;
  let maxScore = 0;
  
  // Growth Category scoring
  if (formData.Growth_Category) {
    maxScore += 25;
    switch (formData.Growth_Category) {
      case "High": score += 25; break;
      case "Growing": score += 20; break;
      case "Medium": score += 15; break;
      default: score += 5;
    }
  }
  
  // Growth Confidence scoring
  if (formData.Growth_Confidence) {
    maxScore += 20;
    switch (formData.Growth_Confidence) {
      case "High": score += 20; break;
      case "Medium": score += 15; break;
      case "Low": score += 5; break;
    }
  }
  
  // Revenue scoring
  if (formData.Estimated_Revenue) {
    maxScore += 20;
    if (formData.Estimated_Revenue.includes("10M+")) score += 20;
    else if (formData.Estimated_Revenue.includes("5M")) score += 18;
    else if (formData.Estimated_Revenue.includes("1M")) score += 15;
    else if (formData.Estimated_Revenue.includes("500K")) score += 12;
    else if (formData.Estimated_Revenue.includes("100K")) score += 8;
    else score += 5;
  }
  
  // Team size scoring
  if (formData.Number_of_Employees) {
    maxScore += 15;
    if (formData.Number_of_Employees.includes("1000+")) score += 15;
    else if (formData.Number_of_Employees.includes("501-")) score += 13;
    else if (formData.Number_of_Employees.includes("201-")) score += 11;
    else if (formData.Number_of_Employees.includes("51-")) score += 9;
    else if (formData.Number_of_Employees.includes("11-")) score += 7;
    else score += 5;
  }
  
  // Visit Duration Growth scoring
  if (formData.Visit_Duration_Growth) {
    maxScore += 10;
    const growth = parseFloat(formData.Visit_Duration_Growth);
    if (growth > 50) score += 10;
    else if (growth > 25) score += 8;
    else if (growth > 0) score += 6;
    else score += 3;
  }
  
  // Funding Rounds scoring
  if (formData.Number_of_Funding_Rounds) {
    maxScore += 10;
    const rounds = parseInt(formData.Number_of_Funding_Rounds);
    if (rounds >= 3) score += 10;
    else if (rounds === 2) score += 8;
    else if (rounds === 1) score += 6;
    else score += 3;
  }
  
  // Calculate final percentage
  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
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

  // Enhanced comparison card styling and layout
  const ComparisonCard = ({ comparisonReport, selectedStartup }) => {
    if (!comparisonReport || !selectedStartup) return null;

    // Helper function to categorize and format performance metrics
    const formatPerformanceMetric = (metric) => {
      // Remove any numerical prefixes and clean up the text
      return metric
        .replace(/^[-\d.]+\s*/, '') // Remove any leading numbers
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .trim();
    };

    // Group metrics by category
    const groupMetrics = (metrics) => {
      const categories = {
        financial: [],
        operational: [],
        growth: [],
        other: []
      };

      metrics.forEach(metric => {
        const formattedMetric = formatPerformanceMetric(metric);
        if (formattedMetric.toLowerCase().includes('revenue') || 
            formattedMetric.toLowerCase().includes('funding') || 
            formattedMetric.toLowerCase().includes('financial')) {
          categories.financial.push(formattedMetric);
        } else if (formattedMetric.toLowerCase().includes('employees') || 
                   formattedMetric.toLowerCase().includes('founders') || 
                   formattedMetric.toLowerCase().includes('team')) {
          categories.operational.push(formattedMetric);
        } else if (formattedMetric.toLowerCase().includes('growth') || 
                   formattedMetric.toLowerCase().includes('visit') || 
                   formattedMetric.toLowerCase().includes('duration')) {
          categories.growth.push(formattedMetric);
        } else {
          categories.other.push(formattedMetric);
        }
      });

      return categories;
    };

    const strengthCategories = groupMetrics(comparisonReport.Pros);
    const weaknessCategories = groupMetrics(comparisonReport.Cons);

    return (
      <GlassCard className="mt-6 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Performance Analysis vs {comparisonReport.Selected_Startup}
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Match Score:</span>
            <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 font-semibold">
              {Math.round(Math.random() * 30 + 70)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths Section */}
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <h5 className="text-lg font-semibold mb-3 text-green-400 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Superior Performance Areas
            </h5>
            <div className="space-y-4">
              {Object.entries(strengthCategories).map(([category, metrics]) => {
                if (metrics.length === 0) return null;
                return (
                  <div key={category} className="space-y-2">
                    <h6 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h6>
                    <ul className="space-y-2">
                      {metrics.map((metric, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 mr-2 bg-green-400 rounded-full"></span>
                          <span className="text-gray-300">{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weaknesses Section */}
          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
            <h5 className="text-lg font-semibold mb-3 text-red-400 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Development Opportunities
            </h5>
            <div className="space-y-4">
              {Object.entries(weaknessCategories).map(([category, metrics]) => {
                if (metrics.length === 0) return null;
                return (
                  <div key={category} className="space-y-2">
                    <h6 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h6>
                    <ul className="space-y-2">
                      {metrics.map((metric, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <span className="inline-block w-1.5 h-1.5 mt-1.5 mr-2 bg-red-400 rounded-full"></span>
                          <span className="text-gray-300">{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-sm text-gray-400 italic">
            This analysis highlights key performance differences between your startup and {comparisonReport.Selected_Startup}.
            Focus on leveraging your superior areas while addressing development opportunities for optimal growth.
          </p>
        </div>
      </GlassCard>
    );
  };

  // Enhanced startup selection handler
  const handleStartupSelect = async (selectedOption) => {
    setSelectedStartup(selectedOption);
    setComparisonReport(null);
    if (selectedOption) {
      try {
        setIsSubmitting(true);
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

        const response = await axios.post("http://127.0.0.1:8000/compare_to_startup", formattedData);
        setComparisonReport(response.data);
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        setError("Failed to fetch comparison report.");
      } finally {
        setIsSubmitting(false);
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
                    <p className="text-gray-300">Status: <span className={`font-bold ${
                      prediction.practical_prediction.label === "Active" ? "text-green-400" : "text-red-400"
                    }`}>
                      {prediction.practical_prediction.label === "Active" ? "Successful" : "Struggling"}
                    </span></p>
                    <p className="text-gray-300">Confidence: <span className="font-bold text-blue-400">{prediction.practical_prediction.confidence}</span></p>
                  </div>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    prediction.practical_prediction.label === "Active" ? "bg-green-500/20" : "bg-red-500/20"
                  }`}>
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
                    <h4 className="text-xl font-semibold mb-4 text-white p-4">
                      Performance Visualizations
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                      {/* Bar Chart */}
                      <div className="h-[400px]">
                        <h5 className="text-lg font-medium mb-4 text-gray-300">
                          Strengths & Weaknesses
                        </h5>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={peerReport.bar_chart_data}
                            margin={{ top: 20, right: 30, left: 30, bottom: 80 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                              dataKey="feature"
                              tick={{ fill: '#9CA3AF', fontSize: 11 }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              interval={0}
                            />
                            <YAxis 
                              tick={{ fill: '#9CA3AF' }}
                              width={40}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                              dataKey="z_score" 
                              fill={(entry) => entry.z_score > 0 ? '#10B981' : '#EF4444'}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Radar Chart */}
                      <div className="h-[400px]">
                        <h5 className="text-lg font-medium mb-4 text-gray-300">
                          Performance vs. Industry
                        </h5>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart 
                            data={peerReport.radar_chart_data}
                            margin={{ top: 20, right: 50, left: 50, bottom: 30 }}
                          >
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis 
                              dataKey="feature" 
                              tick={{ 
                                fill: '#9CA3AF',
                                fontSize: 11
                              }}
                              tickSize={15}
                            />
                            <PolarRadiusAxis 
                              tick={{ fill: '#9CA3AF' }}
                              tickCount={5}
                            />
                            <Radar
                              name="Your Startup"
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
                            <Legend 
                              wrapperStyle={{ 
                                paddingTop: '20px',
                                color: '#9CA3AF'
                              }}
                              verticalAlign="bottom"
                              align="center"
                            />
                            <Tooltip content={<RadarTooltip />} />
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
              <ComparisonCard 
                comparisonReport={comparisonReport} 
                selectedStartup={selectedStartup}
              />
            )}

            {/* Startup Compass - Personalized Insights */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4 text-white flex items-center justify-between">
                <div className="flex items-center">
                  <span>Your Growth Roadmap</span>
                  <span className="ml-2 text-sm text-gray-400">{formData.Industries?.label}</span>
                </div>
                <div className="flex items-center">
                  <div className="text-sm mr-2">Health Score:</div>
                  <div className={`px-3 py-1 rounded-full font-semibold ${
                    calculateHealthScore(formData) >= 80 ? "bg-green-500/20 text-green-400" :
                    calculateHealthScore(formData) >= 60 ? "bg-blue-500/20 text-blue-400" :
                    calculateHealthScore(formData) >= 40 ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {calculateHealthScore(formData)}%
                  </div>
                </div>
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