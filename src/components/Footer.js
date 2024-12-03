import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Branding and Copy */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">StartupSuccess</h2>
          <p className="mt-2 text-sm">&copy; 2024 StartupSuccess. All Rights Reserved.</p>
        </div>

        {/* Links Section */}
        <div className="flex flex-wrap justify-center space-x-8 text-sm">
          <a
            href="#"
            role="button"
            tabIndex={0}
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            role="button"
            tabIndex={0}
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            Terms of Service
          </a>
          <a
            href="#"
            role="button"
            tabIndex={0}
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            Contact Us
          </a>
          <a
            href="#"
            role="button"
            tabIndex={0}
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            Careers
          </a>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center mt-6 space-x-6">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 4.01c-0.806.36-1.675.605-2.586.713a4.48 4.48 0 0 0 1.97-2.475 9.054 9.054 0 0 1-2.867 1.106A4.515 4.515 0 0 0 11.998 8a12.79 12.79 0 0 1-9.31-4.735 4.48 4.48 0 0 0-.612 2.27c0 1.57 0.8 2.95 2.017 3.75A4.495 4.495 0 0 1 2.01 9v0.05c0 2.19 1.564 4.02 3.644 4.43-0.38.1-0.78.17-1.192.17-0.29 0-0.56-0.028-0.83-0.082a4.527 4.527 0 0 0 4.22 3.13A9.066 9.066 0 0 1 1.5 20.365a12.83 12.83 0 0 0 6.994 2.03c8.394 0 12.986-7.054 12.986-13.182 0-0.2-0.004-0.4-0.01-0.6a9.288 9.288 0 0 0 2.268-2.36l0.004-0.004z"
              />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 2h-3.6a4.4 4.4 0 0 0-4.4 4.4v2.2H7.2v3.6h2.8v9.6h4.4v-9.6h3.2l0.4-3.6h-3.6V6.4c0-0.2 0.06-0.4 0.16-0.52A0.72 0.72 0 0 1 15.6 6h2.4V2z"
              />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-300 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v6h-4v-6a6 6 0 0 1 6-6zm-12 9v-9h4v9H4zm2-11a2 2 0 1 1 0-4h0a2 2 0 0 1 0 4z"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
