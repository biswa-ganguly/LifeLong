import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

<<<<<<< HEAD
import Home from './pages/Home/Home';
import Dashboard from './pages/user/UserDashboard';
=======


>>>>>>> dfc13b7b59b82e6cae8d7d607ee736361cfb843b
import Donation from './pages/donation/Donation';
import Emergency from './pages/emergency/Emergency';
import SignInPage from './auth/sign-in';

<<<<<<< HEAD
import HospitalAdminDashboard from './pages/Hospital/AdminDashboard';
import PoliceAdminDashboard from './pages/Police/PoliceAdminDashboard';
import CommonRegistrationForm from './components/CommonRegistrationForm';
=======
import UserDashboard from './pages/user/UserDashboard';
import Home from './pages/home/Home';
>>>>>>> dfc13b7b59b82e6cae8d7d607ee736361cfb843b

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
<<<<<<< HEAD
      <Dashboard />
=======
      <UserDashboard />
>>>>>>> dfc13b7b59b82e6cae8d7d607ee736361cfb843b
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
<<<<<<< HEAD
        

         <Route path="/register" element={<CommonRegistrationForm />} />
  <Route path="/police/admin" element={<PoliceAdminDashboard />} />
  <Route path="/hospital/admin" element={<HospitalAdminDashboard />} />
=======
       

         {/* <Route path="/register" element={<CommonRegistrationForm />} />
  <Route path="/police/admin" element={<PoliceAdminDashboard />} />
  <Route path="/hospital/admin" element={<HospitalAdminDashboard />} /> */}
>>>>>>> dfc13b7b59b82e6cae8d7d607ee736361cfb843b

        {/* Catch-all route to redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" />} />

        

      </Routes>
    </div>
  );
}
