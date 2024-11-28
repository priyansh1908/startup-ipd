import React from 'react';
import startupImage from '../assets/startup.jpg';
import investorImage from '../assets/investor.jpg';

const HomePage = () => {
  return (
    <main className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      {/* Startup and Investor Sections */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Startup Section */}
          <div
            className="p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition dark:bg-gray-800"
            data-aos="fade-up"
          >
            <img
              src={startupImage}
              alt="Startup"
              className="w-full h-60 object-cover rounded-md mb-6"
            />
            <h3 className="text-4xl font-semibold text-gray-800 dark:text-gray-100">Startup</h3>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Log in to evaluate your startup and improve its chances of success.
            </p>
            <button
              className="mt-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition"
              onClick={() => alert('Startup Login Clicked')}
            >
              Startup Login
            </button>
          </div>

          {/* Investor Section */}
          <div
            className="p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition dark:bg-gray-800"
            data-aos="fade-up"
          >
            <img
              src={investorImage}
              alt="Investor"
              className="w-full h-60 object-cover rounded-md mb-6"
            />
            <h3 className="text-4xl font-semibold text-gray-800 dark:text-gray-100">Investor</h3>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Log in to explore startups and find your next big investment opportunity.
            </p>
            <button
              className="mt-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition"
              onClick={() => alert('Investor Login Clicked')}
            >
              Investor Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-6 bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100" data-aos="fade-up">
            Our Features
          </h2>
          <div
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-12"
            data-aos="zoom-in-up"
          >
            <div className="p-8 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-xl hover:shadow-2xl dark:bg-gray-700">
              <h3 className="text-3xl font-semibold text-blue-600 dark:text-blue-400">Success Prediction</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Predict the success potential of your startup using data-driven models.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-xl hover:shadow-2xl dark:bg-gray-700">
              <h3 className="text-3xl font-semibold text-blue-600 dark:text-blue-400">Peer Comparison</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                See how your startup stacks up against others in the industry.
              </p>
            </div>
            <div className="p-8 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-xl hover:shadow-2xl dark:bg-gray-700">
              <h3 className="text-3xl font-semibold text-blue-600 dark:text-blue-400">Investor Matchmaking</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Get connected with investors who align with your vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 px-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100" data-aos="fade-up">
            What Our Users Say
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-12" data-aos="fade-up">
            <div className="p-8 bg-white rounded-lg shadow-xl dark:bg-gray-700">
              <img
                src="https://via.placeholder.com/80"
                alt="User 1"
                className="w-20 h-20 mx-auto rounded-full"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Jane Doe</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                "StartupSuccess helped me secure funding and improve my business plan."
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-xl dark:bg-gray-700">
              <img
                src="https://via.placeholder.com/80"
                alt="User 2"
                className="w-20 h-20 mx-auto rounded-full"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-100">John Smith</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                "I discovered promising startups that align with my investment goals."
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg shadow-xl dark:bg-gray-700">
              <img
                src="https://via.placeholder.com/80"
                alt="User 3"
                className="w-20 h-20 mx-auto rounded-full"
              />
              <h3 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Emily Clark</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                "The insights and recommendations transformed our business."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Statistics Section */}
      <section id="stats" className="py-12 px-6 bg-white dark:bg-gray-800">
        <div
          className="max-w-7xl mx-auto text-center grid grid-cols-1 md:grid-cols-3 gap-12"
          data-aos="zoom-in"
        >
          <div className="p-8">
            <h3 className="text-6xl font-bold text-blue-600 dark:text-blue-400">200+</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Startups Evaluated</p>
          </div>
          <div className="p-8">
            <h3 className="text-6xl font-bold text-blue-600 dark:text-blue-400">150+</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Investors Connected</p>
          </div>
          <div className="p-8">
            <h3 className="text-6xl font-bold text-blue-600 dark:text-blue-400">95%</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Success Rate</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
