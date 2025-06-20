import { Link } from 'react-router-dom';
import { SignUpButton } from '@clerk/clerk-react';
import heroImage from '../assets/hero.svg';

function Hero() {
  return (
    <section className="bg-[#E3F2FD] min-h-screen flex items-center">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-7">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Get Help Instantly During Any Emergency
            </h1>
            
            <h3 className="text-xl text-gray-700 leading-relaxed">
            Find hospitals, register patients, or report critical cases in seconds.
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <SignUpButton mode="modal">
                <button className="bg-transparent text-[#0052CC] border-2 border-[#0052CC] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0052CC] hover:text-white transition-colors duration-300 text-center shadow-lg">
                  Get Started
                </button>
              </SignUpButton>
              
              <Link
                to="/register"
                className="bg-[#0052CC] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0047B3] transition-colors duration-300 text-center shadow-lg"
              >
                Hospitals & Police
              </Link>
              
              <Link
                to="/emergency"
                className="bg-[#DC2625] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#B91C1C] transition-colors duration-300 text-center shadow-lg"
              >
                Report Emergency
              </Link>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>24/7 Emergency Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Verified Hospitals</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Police Assistance</span>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src={heroImage}
                alt="LifeLong Hero"
                className="w-full max-w-lg h-auto drop-shadow-2xl"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#0052CC] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#DC2625] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero; 