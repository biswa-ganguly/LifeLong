import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser, UserButton, SignInButton } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import logo from '/logo.svg';
import Header from './Header';

function Navbar() {
  const { isSignedIn, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <Header />
      <nav className="sticky top-0 bg-[#0052CC] text-white px-12 py-4 z-50">

        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <img src={logo} alt="logo" className="h-10 w-auto" />
            LifeLong
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/emergency" className="hover:underline">Emergency</Link>
            <Link to="/donation" className="hover:underline">Donation</Link>
            <Link to="/volunteer/register" className="hover:underline">Become a Volunteer</Link>
            <Link to={isSignedIn ? `/dashboard/user/${user?.id}` : "/dashboard/user"} className="hover:underline">Dashboard</Link>
            <button onClick={scrollToFooter} className="hover:underline bg-transparent border-none text-white cursor-pointer">Contacts</button>
            
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <span className="font-medium">
                  {user?.firstName || user?.fullName || 'User'}
                </span>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-white text-[#0052CC] px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>

          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* Side Drawer for Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={24} className="text-gray-800" />
            </button>
          </div>

          <div className="flex flex-col p-4 gap-4">
            <Link to="/emergency" className="text-gray-800 hover:bg-gray-100 p-2 rounded" onClick={() => setIsMenuOpen(false)}>Emergency</Link>
            <Link to="/donation" className="text-gray-800 hover:bg-gray-100 p-2 rounded" onClick={() => setIsMenuOpen(false)}>Donation</Link>
            <Link to="/volunteer/register" className="text-gray-800 hover:bg-gray-100 p-2 rounded" onClick={() => setIsMenuOpen(false)}>Become a Volunteer</Link>
            <Link to={isSignedIn ? `/dashboard/user/${user?.id}` : "/dashboard/user"} className="text-gray-800 hover:bg-gray-100 p-2 rounded" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <button onClick={scrollToFooter} className="text-left text-gray-800 hover:bg-gray-100 p-2 rounded bg-transparent border-none cursor-pointer">Contacts</button>
            
            {isSignedIn ? (
              <div className="mt-4 flex items-center gap-3 border-t pt-4">
                <div className="h-8 w-8">
                  <UserButton afterSignOutUrl="/" />                           
                </div>
                <span className="text-gray-800 font-medium">
                  {user?.firstName || user?.fullName || 'User'}
                </span>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="mt-4 w-full text-center bg-[#0052CC] text-white px-4 py-2 rounded-md font-medium hover:bg-[#0047B3] transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {/* Backdrop */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </nav>
    </>
  );
}

export default Navbar;