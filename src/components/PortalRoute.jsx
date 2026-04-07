import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps portal pages: redirects to login if not authenticated, or wrong role
export default function PortalRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) {
    // Redirect to the correct role home
    const homes = {
      gramdoot: '/portal/dashboard',
      ada: '/portal/ada/dashboard',
      dda: '/portal/dda/dashboard',
      sno: '/portal/sno/dashboard',
      bank: '/portal/bank/dashboard',
    };
    return <Navigate to={homes[user.role] || '/'} replace />;
  }

  return children;
}
