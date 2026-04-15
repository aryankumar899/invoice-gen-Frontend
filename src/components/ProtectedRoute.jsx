import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // If no token is found, redirect to the login page immediately.
    // We pass the intended location in state so we could theoretically redirect them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If token exists, allow them to view the protected component
  return children;
};

export default ProtectedRoute;
