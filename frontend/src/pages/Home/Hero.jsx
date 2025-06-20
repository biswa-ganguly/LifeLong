import { Link } from 'react-router-dom';
import heroImage from '../../assets/hero.svg';

function Hero() {
  return (
    <section className="bg-[#E3F2FD] lg:h-[80vh] flex items-center">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Get Help Instantly During Any Emergency
            </h1>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl">
              Find hospitals, register patients, or report critical cases in just a few seconds.
            </p>

            {/* CTA Buttons - Two Rows */}
           <div className="space-y-4">
  {/* Row 1 - Two Full Width Buttons Side by Side on Larger Screens */}
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
    <Link
      to="/register"
      className="w-full bg-[#0052CC] text-white px-8 py-3 rounded-full text-base font-semibold hover:bg-[#0047B3] transition-all duration-300 shadow-md text-center"
    >
      Donation Portal
    </Link>

    <Link
      to="/emergency"
      className="w-full bg-[#DC2625] text-white px-8 py-3 rounded-full text-base font-semibold hover:bg-[#B91C1C] transition-all duration-300 shadow-md text-center"
    >
      Report Emergency
    </Link>
  </div>

  {/* Row 2 - Full Width Button */}
  <div className="flex">
    <Link
      to="/register"
      className="w-full bg-transparent text-[#0052CC] px-8 py-3 rounded-full border text-base font-semibold  transition-all duration-300 shadow-md text-center"
    >
      Register New Hospital or Police Station
    </Link>
  </div>
</div>


            {/* Info Badges */}
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                24/7 Emergency Support
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Verified Hospitals
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                Police Assistance
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <img
                src={heroImage}
                alt="LifeLong Hero"
                className="w-full h-auto rounded-xl shadow-2xl"
              />

              {/* Floating Icons */}
              <div className="absolute -top-5 -right-5 w-14 h-14 bg-[#0052CC] rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>

              <div className="absolute -bottom-5 -left-5 w-12 h-12 bg-[#DC2625] rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
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
