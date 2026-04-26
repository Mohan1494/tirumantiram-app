import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isGuestMode } from '../utils/authUtils';

function ProtectedRoute({ children }) {
  if (!isAuthenticated() && !isGuestMode()) {
    // Redirect to login if not authenticated and not guest
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
}

export default ProtectedRoute;
