import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import startupImage from "../assets/startup.jpg";
import investorImage from "../assets/investor.jpg";
import AnimatedBackground from "../components/AnimatedBackground";
import GlassCard from "../components/GlassCard";
import FuturisticButton from "../components/FuturisticButton";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    beforeChange: (current, next) => setActiveSlide(next),
    customPaging: (i) => (
      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeSlide ? 'bg-blue-400 w-6' : 'bg-gray-400'}`} />
    ),
  };

  return (
    <main className="relative min-h-screen text-gray-100 overflow-hidden font-light">
      {/* Animated Background */}
      <AnimatedBackground color="#3B82F6" count={80} />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        {/* Futuristic Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wider">
              AI-POWERED STARTUP ANALYSIS
            </div>
            <h1 className="text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 tracking-tight">
              Startup Success Predictor
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Leverage AI-powered insights to predict startup success and make data-driven investment decisions.
            </p>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="h-full">
              <GlassCard className="h-full p-8 flex flex-col hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border border-blue-500/10">
                <div className="mb-8 overflow-hidden rounded-lg h-48 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent z-10"></div>
            <img
              src={startupImage}
              alt="Startup"
              loading="lazy"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
            />
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 backdrop-blur-sm text-white tracking-wider">
                      FOR STARTUPS
                    </span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-blue-400 mb-4 tracking-tight">For Startups</h3>
                <p className="text-gray-300 mb-8 flex-grow leading-relaxed">
                  Evaluate your startup's potential and get actionable insights to improve your chances of success.
            </p>
                <FuturisticButton 
              onClick={() => navigate("/startup")}
                  variant="primary"
                  size="large"
                  fullWidth
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20"
                >
                  <span className="flex items-center justify-center tracking-wide">
                    Analyze Your Startup
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </FuturisticButton>
              </GlassCard>
          </div>

            <div className="h-full">
              <GlassCard className="h-full p-8 flex flex-col hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 border border-purple-500/10">
                <div className="mb-8 overflow-hidden rounded-lg h-48 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent z-10"></div>
            <img
              src={investorImage}
              alt="Investor"
              loading="lazy"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
            />
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/30 backdrop-blur-sm text-white tracking-wider">
                      FOR INVESTORS
                    </span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-purple-400 mb-4 tracking-tight">For Investors</h3>
                <p className="text-gray-300 mb-8 flex-grow leading-relaxed">
                  Discover promising startups and make informed investment decisions with our AI-powered platform.
                </p>
                <FuturisticButton 
              onClick={() => navigate("/investor")}
                  variant="secondary"
                  size="large"
                  fullWidth
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/20"
                >
                  <span className="flex items-center justify-center tracking-wide">
                    Explore Startups
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </FuturisticButton>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6 px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium tracking-wider">
              OUR FEATURES
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 tracking-tight">
              Powerful Features
          </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our platform offers cutting-edge tools to help you make informed decisions.
          </p>
        </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <GlassCard className="p-8 transform group-hover:scale-105 transition-transform duration-300 relative border border-blue-500/10">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white tracking-tight">Success Prediction</h3>
                <p className="text-gray-300 leading-relaxed">
                  Our AI model analyzes your startup data to predict success probability with high accuracy.
              </p>
              </GlassCard>
            </div>
            
            <div className="group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <GlassCard className="p-8 transform group-hover:scale-105 transition-transform duration-300 relative border border-purple-500/10">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white tracking-tight">Peer Comparison</h3>
                <p className="text-gray-300 leading-relaxed">
                  Compare your startup with industry peers to identify strengths and areas for improvement.
              </p>
              </GlassCard>
            </div>
            
            <div className="group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <GlassCard className="p-8 transform group-hover:scale-105 transition-transform duration-300 relative border border-cyan-500/10">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white tracking-tight">Growth Insights</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get actionable recommendations to accelerate your startup's growth and success.
              </p>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium tracking-wider">
              TESTIMONIALS
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
            What Our Users Say
          </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Hear from startups and investors who have transformed their journey with our platform.
            </p>
          </div>
          
          <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Slider {...sliderSettings}>
            {[
                { 
                  name: "Jane Doe", 
                  role: "Startup Founder",
                  feedback: "This platform provided invaluable insights that helped us pivot our business model. The predictions were spot-on!" 
                },
                { 
                  name: "John Smith", 
                  role: "Angel Investor",
                  feedback: "As an investor, this tool has been a game-changer. I've discovered promising startups that I would have otherwise missed." 
                },
                { 
                  name: "Emily Clark", 
                  role: "VC Partner",
                  feedback: "The peer comparison feature is excellent. It gives startups a clear picture of where they stand in the market." 
                },
            ].map((testimonial, index) => (
                <div key={index} className="px-4">
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 w-8 h-8 text-4xl text-cyan-400/30">"</div>
                    <GlassCard className="p-10 border border-cyan-500/10">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-6">
                          {testimonial.name.charAt(0)}
                        </div>
                        <p className="text-gray-300 italic mb-8 text-lg leading-relaxed">"{testimonial.feedback}"</p>
                        <h4 className="text-xl font-semibold text-white mb-1">{testimonial.name}</h4>
                        <p className="text-cyan-400 tracking-wide">{testimonial.role}</p>
                      </div>
                    </GlassCard>
                    <div className="absolute -bottom-4 -right-4 w-8 h-8 text-4xl text-cyan-400/30">"</div>
                  </div>
              </div>
            ))}
          </Slider>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className={`relative transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
            <GlassCard className="p-12 relative border border-blue-500/10">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
                Ready to Transform Your Startup Journey?
          </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Join thousands of startups and investors who are already using our platform to make data-driven decisions.
          </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <FuturisticButton 
                  onClick={() => navigate("/startup")}
                  variant="primary"
                  size="large"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20"
                >
                  <span className="flex items-center justify-center tracking-wide">
                    For Startups
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </FuturisticButton>
                <FuturisticButton 
                  onClick={() => navigate("/investor")}
                  variant="outline"
                  size="large"
                  className="border-2 border-purple-500/30 hover:bg-purple-500/10"
                >
                  <span className="flex items-center justify-center tracking-wide">
                    For Investors
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </FuturisticButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;