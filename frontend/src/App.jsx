import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';



import Donation from './pages/donation/Donation';
import Emergency from './pages/emergency/Emergency';
import SignInPage from './auth/sign-in';

import UserDashboard from './pages/user/UserDashboard';
import Home from './pages/home/Home';

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignInPage />} />

        <Route
  path="/dashboard/user/:userId?"
  element={
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  }
/>
        <Route
          path="/donation"
          element={
            <ProtectedRoute>
              <Donation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency"
          element={
            <ProtectedRoute>
              <Emergency />
            </ProtectedRoute>
          }
        />
       

         {/* <Route path="/register" element={<CommonRegistrationForm />} />
  <Route path="/police/admin" element={<PoliceAdminDashboard />} />
  <Route path="/hospital/admin" element={<HospitalAdminDashboard />} /> */}

        {/* Catch-all route to redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" />} />

        

      </Routes>
    </div>
  );
}
