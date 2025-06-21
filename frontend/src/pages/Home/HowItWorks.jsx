import React from 'react';
import { Link } from 'react-router-dom';

function HowItWorks() {
  return (
    <section className=" bg-gradient-to-t from-[#E3F2FD] via-[#E3F2FD] to-white">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-snug">
            How It <span className="text-[#0052CC]">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive emergency response system connects you with the help you need in critical moments. 
            Follow these simple steps to get immediate assistance.
          </p>
        </div>

        {/* Main Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {[
            {
              num: '01',
              title: 'Register & Connect',
              color: '#0052CC',
              text: 'Sign up as a user, hospital, or police station to join our verified emergency response network.',
            },
            {
              num: '02',
              title: 'Report Emergency',
              color: '#DC2625',
              text: 'Use our intuitive emergency reporting system to quickly alert nearby hospitals and police stations.',
            },
            {
              num: '03',
              title: 'Get Instant Response',
              color: '#059669',
              text: 'Receive immediate assistance from verified emergency services in your area.',
            },
          ].map(({ num, title, text, color }) => (
            <div key={num} className="relative transition-transform hover:-translate-y-1 duration-300">
              <div className="bg-white rounded-3xl p-8 text-center h-full shadow-xl">
                <div
                  className="w-20 h-20 text-white rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-3xl font-bold">{num}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-700 text-base leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            {
              title: '24/7 Availability',
              desc: 'Round-the-clock emergency assistance whenever you need it',
              iconBg: '#0052CC',
              icon: (
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              ),
            },
            {
              title: 'Verified Partners',
              desc: 'Trusted hospitals and police stations with verified credentials',
              iconBg: '#059669',
              icon: (
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ),
            },
            {
              title: 'Instant Response',
              desc: 'Lightning-fast emergency service dispatch and coordination',
              iconBg: '#DC2625',
              icon: (
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              ),
            },
            {
              title: 'Secure Platform',
              desc: 'Your personal data and emergency information are fully protected',
              iconBg: '#7C3AED',
              icon: (
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              ),
            },
          ].map(({ title, desc, iconBg, icon }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:shadow-2xl transition-shadow duration-300"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: iconBg }}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  {icon}
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">{title}</h4>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-[#0052CC] to-[#0047B3] rounded-3xl p-12 text-white mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            {[
              { stat: '500+', label: 'Verified Hospitals' },
              { stat: '1000+', label: 'Police Stations' },
              { stat: '50K+', label: 'Lives Saved' },
            ].map(({ stat, label }) => (
              <div key={label}>
                <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat}</div>
                <div className="text-lg md:text-xl opacity-90">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
