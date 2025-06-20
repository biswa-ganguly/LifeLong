import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import logo from '/logo.svg';
import Header from './Header';

function Navbar() {
  const { isSignedIn, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Header/>
      <nav className="bg-gray-200 px-12 py-4 relative z-50">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <img src={logo} alt="logo" className="h-10 w-auto" />
            LifeLong
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/donation">Donation</Link>
            
            {isSignedIn ? (
              <Link to={`/dashboard/user/${user?.id}`}>Dashboard</Link>
            ) : (
              <Link to="/dashboard">Dashboard</Link>
            )}
            
            <Link to="/emergency">
              <button className="bg-[#E53935] hover:bg-red-700 text-white px-4 py-2 rounded-md shadow">
                Emergency
              </button>
            </Link>
            
            {isSignedIn && (
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <span className="text-gray-800 font-medium">
                  {user?.firstName || user?.fullName || 'User'}
                </span>
              </div>
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
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col p-4 gap-4">
            <Link to="/donation" onClick={() => setIsMenuOpen(false)}>Donation</Link>
            
            {isSignedIn ? (
              <Link to={`/dashboard/user/${user?.id}`} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            ) : (
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            )}
            
            <Link to="/emergency" onClick={() => setIsMenuOpen(false)}>
              <button className="bg-[#E53935] hover:bg-red-700 text-white px-4 py-2 rounded-md w-full text-left">
                Emergency
              </button>
            </Link>
            
            {isSignedIn && (
              <div className="mt-4 flex items-center gap-3">
                
                <div className="h-8 w-8">
                  <UserButton afterSignOutUrl="/" />                           
                </div>
                <span className="text-gray-800 font-medium">
                  {user?.firstName || user?.fullName || 'User'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Backdrop */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-transparent bg-opacity-40 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </nav>
    </>
  );
}

export default Navbar;