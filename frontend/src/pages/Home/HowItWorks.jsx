import React from 'react';
import { Link } from 'react-router-dom';

function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            How It <span className="text-[#0052CC]">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our comprehensive emergency response system connects you with the help you need in critical moments. 
            Follow these simple steps to get immediate assistance.
          </p>
        </div>

        {/* Main Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 text-center h-full shadow-lg">
              <div className="w-20 h-20 bg-[#0052CC] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">01</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Register & Connect</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Sign up as a user, hospital, or police station to join our verified emergency response network.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 text-center h-full shadow-lg">
              <div className="w-20 h-20 bg-[#DC2625] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">02</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Report Emergency</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Use our intuitive emergency reporting system to quickly alert nearby hospitals and police stations.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 text-center h-full shadow-lg">
              <div className="w-20 h-20 bg-[#059669] text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold">03</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Instant Response</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Receive immediate assistance from verified emergency services in your area.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-[#0052CC] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">24/7 Availability</h4>
            <p className="text-gray-600">Round-the-clock emergency assistance whenever you need it</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-[#059669] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Verified Partners</h4>
            <p className="text-gray-600">Trusted hospitals and police stations with verified credentials</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-[#DC2625] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Instant Response</h4>
            <p className="text-gray-600">Lightning-fast emergency service dispatch and coordination</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Secure Platform</h4>
            <p className="text-gray-600">Your personal data and emergency information are fully protected</p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-[#0052CC] to-[#0047B3] rounded-3xl p-12 text-white mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Verified Hospitals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-lg opacity-90">Police Stations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-lg opacity-90">Lives Saved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
