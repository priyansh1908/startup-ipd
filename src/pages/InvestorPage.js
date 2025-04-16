import React, { useState, useEffect } from "react";
import axios from "axios";

const InvestorPage = () => {
  const [startups, setStartups] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/startups")
      .then((response) => {
        console.log("Raw API response:", response.data); // Debug raw data
        const mappedStartups = response.data.map((startup) => {
          const location = startup.Headquarters_Location || "N/A";
          return {
            name: startup.Organization_Name || "Unknown",
            industry: startup.Industries || "N/A",
            location: location,
            roi: "N/A",
            logo: "https://via.placeholder.com/80?text=" + (startup.Organization_Name || "Startup"),
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

  const filteredStartups = startups.filter(
    (startup) =>
      startup.name.toLowerCase().includes(filter.toLowerCase()) &&
      (startup.location.toLowerCase().includes("") || startup.location === "N/A")
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
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8 col-span-full">
            Loading startups...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 dark:text-red-400 mt-8 col-span-full">
            {error}
          </p>
        ) : (
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
        )}
      </section>
    </div>
  );
};

export default InvestorPage;