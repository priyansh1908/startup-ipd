import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import AnimatedBackground from "../components/AnimatedBackground";
import GlassCard from "../components/GlassCard";
import FuturisticButton from "../components/FuturisticButton";
import Card3D from "../components/Card3D";

// Dropdown Options
const industriesOptions = [
  { value: "FinTech", label: "FinTech" },
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

const investmentStageOptions = [
  { value: "Seed", label: "Seed" },
  { value: "Series A", label: "Series A" },
  { value: "Series B", label: "Series B" },
  { value: "Series C", label: "Series C" },
  { value: "IPO", label: "IPO" },
];

const InvestorPage = () => {
  const [startups, setStartups] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({
    industries: null,
    investmentStage: null
  });
  const [expandedStartup, setExpandedStartup] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "recommended"

  useEffect(() => {
    setLoading(true);
    // Use the debug endpoint to get all startup data
    axios
      .get("http://localhost:8000/debug_startups")
      .then((response) => {
        console.log("Raw API response:", response.data); // Debug raw data
        const mappedStartups = response.data.startups.map((startup) => {
          return {
            name: startup.Organization_Name || "Unknown",
            industry: startup.Industries || "N/A",
            location: startup.Headquarters_Location || "N/A",
            investmentStage: startup.Investment_Stage || "N/A",
            // Store the complete startup data for the dropdown
            fullData: startup
          };
        });
        console.log("Mapped startups:", mappedStartups); // Debug mapped data
        setStartups(mappedStartups);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching startups:", err);
        setError("Failed to load startups. Please try again.");
        setLoading(false);
      });
  }, []);

  const handlePreferenceChange = (name, selectedOption) => {
    setPreferences({
      ...preferences,
      [name]: selectedOption
    });
  };

  const isRecommended = (startup) => {
    if (!preferences.industries && !preferences.investmentStage) {
      return false;
    }
    
    const industryMatch = !preferences.industries || 
      startup.industry === preferences.industries.value;
    
    const stageMatch = !preferences.investmentStage || 
      startup.investmentStage === preferences.investmentStage.value;
    
    return industryMatch && stageMatch;
  };

  const toggleStartupDetails = (startupName) => {
    if (expandedStartup === startupName) {
      setExpandedStartup(null);
    } else {
      setExpandedStartup(startupName);
    }
  };

  // Function to format the key for display
  const formatKey = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Filter startups based on search and active tab
  const filteredStartups = startups.filter((startup) => {
    const matchesSearch = startup.name.toLowerCase().includes(filter.toLowerCase());
    
    if (activeTab === "all") {
      return matchesSearch;
    } else if (activeTab === "recommended") {
      return matchesSearch && isRecommended(startup);
    }
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-gray-100 overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground color="#3B82F6" count={50} />

      <div className="relative">
        {/* Header Section */}
        <div className="text-center mt-16 mb-12 animate-fadeIn">
          <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome to Your Investor Dashboard
        </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore high-potential startups and maximize your investments with AI-powered insights.
        </p>
      </div>

        {/* Investor Preferences Form */}
        <section className="my-8 max-w-2xl mx-auto">
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Your Investment Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Industries</label>
                <Select
                  options={industriesOptions}
                  value={preferences.industries}
                  onChange={(selected) => handlePreferenceChange("industries", selected)}
                  placeholder="Select industry..."
                  className="basic-single-select"
                  classNamePrefix="select"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Investment Stage</label>
                <Select
                  options={investmentStageOptions}
                  value={preferences.investmentStage}
                  onChange={(selected) => handlePreferenceChange("investmentStage", selected)}
                  placeholder="Select stage..."
                  className="basic-single-select"
                  classNamePrefix="select"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
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
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Startups matching your preferences will be tagged as "Recommended".
            </p>
          </GlassCard>
        </section>

        {/* Startups Section */}
        <section className="my-12 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold mb-6 md:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Discover Startups
        </h2>
            <div className="relative w-full md:w-1/2">
        <input
          type="text"
          placeholder="Search by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg bg-white/5 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-300"
        />
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap mb-8">
            <FuturisticButton
              onClick={() => setActiveTab("all")}
              variant={activeTab === "all" ? "primary" : "outline"}
              size="small"
              className="mr-4"
            >
              All Startups
            </FuturisticButton>
            <FuturisticButton
              onClick={() => setActiveTab("recommended")}
              variant={activeTab === "recommended" ? "primary" : "outline"}
              size="small"
            >
              Recommended
            </FuturisticButton>
          </div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        ) : error ? (
            <GlassCard className="p-6 border-red-500/50">
              <div className="flex items-center text-red-400">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </GlassCard>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup, index) => (
                <div key={index}>
                  <GlassCard className="h-full">
                    <div className="p-6">
                      {isRecommended(startup) && (
                        <div className="absolute top-2 right-2">
                          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg">
                            Recommended
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-white">{startup.name}</h3>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-300">
                          <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{startup.industry}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{startup.location}</span>
                        </div>
                        <div className="flex items-center text-gray-300">
                          <svg className="h-5 w-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span>{startup.investmentStage}</span>
                        </div>
                      </div>
                      
                      <FuturisticButton
                        onClick={() => toggleStartupDetails(startup.name)}
                        variant="outline"
                        fullWidth
                      >
                        <span className="flex items-center justify-center">
                          {expandedStartup === startup.name ? "Hide Details" : "View Details"}
                          <svg 
                            className={`ml-2 w-4 h-4 transition-transform duration-300 ${expandedStartup === startup.name ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </FuturisticButton>
                      
                      {expandedStartup === startup.name && (
                        <div className="mt-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                          <h4 className="font-semibold mb-2 text-blue-400">Startup Details</h4>
                          <div className="space-y-2">
                            {Object.entries(startup.fullData)
                              .filter(([key]) => !['_id', 'prediction', 'confidence_level'].includes(key))
                              .map(([key, value]) => (
                                <div key={key} className="flex text-sm">
                                  <span className="font-medium w-1/2 text-gray-400">{formatKey(key)}:</span>
                                  <span className="w-1/2 text-gray-300">{value !== null && value !== undefined ? value.toString() : 'N/A'}</span>
                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
              </div>
            ))}
            {filteredStartups.length === 0 && (
                <div className="col-span-full">
                  <GlassCard className="p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-medium text-gray-100">No startups found</h3>
                    <p className="mt-2 text-gray-400">
                      Try adjusting your search criteria or preferences.
              </p>
                  </GlassCard>
                </div>
            )}
          </div>
        )}
      </section>
      </div>
    </div>
  );
};

export default InvestorPage;