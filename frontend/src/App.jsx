import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home/Home';
import Dashboard from './pages/user/UserDashboard';
import Donation from './pages/donation/Donation';
import Emergency from './pages/emergency/Emergency';
import SignInPage from './auth/sign-in';

import HospitalAdminDashboard from './pages/Hospital/AdminDashboard';
import PoliceAdminDashboard from './pages/Police/PoliceAdminDashboard';
import CommonRegistrationForm from './components/CommonRegistrationForm';
import HospitalPoliceLogin from './components/HospitalPoliceLogin';

export default function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-grow'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignInPage />} />

          <Route
    path="/dashboard/user/:userId?"
    element={
      <ProtectedRoute>
        <Dashboard />
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
          

           <Route path="/register" element={<CommonRegistrationForm />} />
            <Route path="/hospital-police-login" element={<HospitalPoliceLogin />} />
            <Route path="/police/admin/:policeId" element={<PoliceAdminDashboard />} />
            <Route path="/hospital/admin/:hospitalId" element={<HospitalAdminDashboard />} />


          {/* Catch-all route to redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" />} />

          

        </Routes>
      </main>
      <Footer />
    </div>
  );
}
