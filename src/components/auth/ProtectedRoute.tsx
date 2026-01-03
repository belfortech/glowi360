// components/auth/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_BASE_URL } from '../../config/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean; // Optional flag to require profile completion
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireProfile = false
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(requireProfile);
  const [profileExists, setProfileExists] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  // Check if profile exists (only if requireProfile is true)
  const checkProfile = async () => {
    if (!requireProfile || !isAuthenticated) {
      setIsChecking(false);
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setProfileExists(true);
      } else if (response.status === 404) {
        // Profile doesn't exist, but that's okay for most routes
        setProfileExists(false);
      }
    } catch (error) {
      console.error('Profile check error:', error);
      setProfileExists(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && requireProfile) {
      checkProfile();
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, requireProfile]);

  // Show loading while checking profile
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#C9A24D] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Verifying access...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If profile is required but doesn't exist, we still allow access
  // The ProfileManagement component will handle profile creation
  return <>{children}</>;
};

export default ProtectedRoute;
