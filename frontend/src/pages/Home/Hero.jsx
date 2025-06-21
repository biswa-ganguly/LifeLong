import { Link } from 'react-router-dom';
import heroImage from '../../assets/hero.svg';

function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#E3F2FD] via-[#E3F2FD] to-white lg:h-[80vh] flex items-center">
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
      to="/donation"
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
            <div className="relative w-full max-w-2xl">
              <img
                src={heroImage}
                alt="LifeLong Hero"
                className="w-full h-full rounded-xl "
              />


              
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
