// src/components/ProtectedRoute.js
import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null; // or a loading spinner

  return isSignedIn ? children : <Navigate to="/sign-in" />;
}

export default ProtectedRoute;
