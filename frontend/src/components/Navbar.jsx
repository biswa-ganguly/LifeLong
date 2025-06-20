import { Link } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';

function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="px-8 py-4 bg-gray-200">
      <div className="flex justify-between items-center gap-4">
        <Link to="/">
          <img src="" alt="logo" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/donation">Donation</Link>

          {isSignedIn ? (
            <Link to={`/dashboard/user/${user?.id}`}>Dashboard</Link>
          ) : (
            <Link to="/dashboard">Dashboard</Link>
          )}

          <Link to="/emergency">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow">
              Emergency
            </button>
          </Link>

          {isSignedIn && <UserButton afterSignOutUrl="/" />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
