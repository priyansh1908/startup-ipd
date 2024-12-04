import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import startupImage from '../assets/startup.jpg';
import investorImage from '../assets/investor.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <main className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      {/* Startup and Investor Sections */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 mt-20">
          {/* Startup Section */}
          <div
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform dark:bg-gray-800"
            data-aos="fade-up"
          >
            <img
              src={startupImage}
              alt="Startup"
              loading="lazy"
              className="w-full h-100  rounded-md mb-4"
            />
            <h3 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Startup</h3>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Log in to evaluate your startup and improve its chances of success.
            </p>
            <button
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition"
              onClick={() => navigate('/startup')}
            >
              Startup Login
            </button>
          </div>

          {/* Investor Section */}
          <div
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform dark:bg-gray-800"
            data-aos="fade-up"
          >
            <img
              src={investorImage}
              alt="Investor"
              loading="lazy"
              className="w-full h-100 object-cover rounded-md mb-4"
            />
            <h3 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Investor</h3>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Log in to explore startups and find your next big investment opportunity.
            </p>
            <button
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition"
              onClick={() => navigate('/investor')}
            >
              Investor Login
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-12 px-6 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100" data-aos="fade-up">
            About Us
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400" data-aos="fade-up">
            At StartupSuccess, we empower startups and investors by bridging the gap with data-driven insights, tools,
            and personalized matchmaking services.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-6 bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-100" data-aos="fade-up">
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
      <section id="testimonials" className="py-12 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100" data-aos="fade-up">
            What Our Users Say
          </h2>
          <Slider {...sliderSettings} className="mt-8">
            {[
              { name: 'Jane Doe', feedback: 'StartupSuccess helped me secure funding and improve my business plan.' },
              { name: 'John Smith', feedback: 'I discovered promising startups that align with my investment goals.' },
              { name: 'Emily Clark', feedback: 'The insights and recommendations transformed our business.' },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800 text-center"
              >
                <p className="text-lg text-gray-600 dark:text-gray-300">{testimonial.feedback}</p>
                <h4 className="text-xl font-semibold mt-4 text-blue-600 dark:text-blue-400">
                  {testimonial.name}
                </h4>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Call-to-Action Section (Get Started Feature) */}
      <section id="get-started" className="py-16 px-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Future?</h2>
          <p className="text-lg font-light mb-8">
            Take the next step towards startup success or your next big investment.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="py-3 px-8 bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition font-semibold"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-12 px-6 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100" data-aos="fade-up">
            Stay Updated
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400" data-aos="fade-up">
            Subscribe to our newsletter for the latest updates and announcements.
          </p>
          <form className="mt-6 flex flex-col md:flex-row justify-center gap-4" data-aos="fade-up">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full md:w-1/2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
