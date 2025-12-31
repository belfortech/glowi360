// components/profile/ProfileManagement.tsx
import React, { useState, useEffect } from 'react';
import { Settings, User, FileText, Shield, LogOut, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import PersonalInfoSection from './PersonalInfoSection';

const ProfileManagement: React.FC = () => {
  const [activeSection, setActiveSection] = useState('personal-info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // Configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  // Check if user profile exists and create if necessary
  const checkOrCreateProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        navigate('/');
        return;
      }

      // Try to fetch the profile first
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // Profile doesn't exist, the signal should have created it
        // Try a second time after a brief delay
        setTimeout(async () => {
          try {
            const retryResponse = await fetch(`${API_BASE_URL}/profile/`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (!retryResponse.ok && retryResponse.status !== 404) {
              throw new Error('Failed to access profile');
            }
          } catch (err) {
            console.error('Profile retry fetch error:', err);
            setError('Unable to access your profile. Please try refreshing the page.');
          }
        }, 1000);
      } else if (!response.ok) {
        throw new Error('Failed to access profile');
      }

      setLoading(false);
    } catch (err) {
      console.error('Profile check error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const renderActiveSection = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-8 flex justify-center items-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-medium text-red-800">Profile Error</h3>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={checkOrCreateProfile}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C9A24D] transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeSection) {
      case 'personal-info':
        return <PersonalInfoSection />;
      case 'legal-account':
        return <LegalAccountSection />;
      case 'security':
        return <SecuritySection />;
      default:
        return <PersonalInfoSection />;
    }
  };

  // Check profile on component mount
  useEffect(() => {
    checkOrCreateProfile();
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <div className="w-80 bg-white rounded-lg shadow-sm border">
          {/* Profile Management Section */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-[#D4AF37]" />
              <h2 
                className="text-lg font-medium"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#D4AF37'
                }}
              >
                Profile Management
              </h2>
            </div>

            {/* User Info Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-medium">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900" style={{ fontFamily: 'Inter' }}>
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter' }}>
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveSection('personal-info')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'personal-info'
                    ? 'bg-[#D4AF37] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '16px'
                }}
              >
                <User className="w-5 h-5" />
                Personal Information
              </button>

              <button
                onClick={() => setActiveSection('legal-account')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'legal-account'
                    ? 'bg-[#D4AF37] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '16px'
                }}
              >
                <FileText className="w-5 h-5" />
                Legal & Account
              </button>

              <button
                onClick={() => setActiveSection('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'security'
                    ? 'bg-[#D4AF37] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '16px'
                }}
              >
                <Shield className="w-5 h-5" />
                Security
              </button>
            </div>
          </div>

          {/* Separator Line */}
          <div className="h-px bg-[#E7E7E7] mx-6"></div>

          {/* Logout Button */}
          <div className="p-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-[#D4AF37] hover:text-[#C9A24D] transition-colors"
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '16px'
              }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

// Enhanced placeholder components for other sections
const LegalAccountSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 
            className="text-xl font-medium mb-1"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '20px',
              color: '#000000'
            }}
          >
            Legal & Account
          </h3>
          <p 
            className="text-sm text-gray-500"
            style={{
              fontFamily: 'Inter',
              fontSize: '14px'
            }}
          >
            Manage your account settings, privacy preferences, and legal documents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Privacy Settings</h4>
          <p className="text-sm text-gray-600 mb-4">Control how your data is used and shared.</p>
          <button className="text-[#D4AF37] hover:text-[#C9A24D] text-sm font-medium">
            Manage Privacy →
          </button>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Terms of Service</h4>
          <p className="text-sm text-gray-600 mb-4">Review our terms and conditions.</p>
          <button className="text-[#D4AF37] hover:text-[#C9A24D] text-sm font-medium">
            View Terms →
          </button>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Data Export</h4>
          <p className="text-sm text-gray-600 mb-4">Download a copy of your data.</p>
          <button className="text-[#D4AF37] hover:text-[#C9A24D] text-sm font-medium">
            Request Export →
          </button>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Account Status</h4>
          <p className="text-sm text-gray-600 mb-4">View your account verification status.</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Verified
          </span>
        </div>
      </div>
    </div>
  );
};

const SecuritySection: React.FC = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 
            className="text-xl font-medium mb-1"
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '20px',
              color: '#000000'
            }}
          >
            Security
          </h3>
          <p 
            className="text-sm text-gray-500"
            style={{
              fontFamily: 'Inter',
              fontSize: '14px'
            }}
          >
            Manage your password, two-factor authentication, and security preferences.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Password Section */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-gray-900">Password</h4>
              <p className="text-sm text-gray-600">Change your account password</p>
            </div>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="px-4 py-2 text-[#D4AF37] hover:text-[#C9A24D] border border-[#D4AF37] hover:border-[#C9A24D] rounded-lg transition-colors"
            >
              Change Password
            </button>
          </div>

          {showChangePassword && (
            <div className="mt-4 space-y-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C9A24D] transition-colors">
                  Update Password
                </button>
                <button 
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Not Enabled
            </span>
          </div>
          <button className="mt-4 text-[#D4AF37] hover:text-[#C9A24D] text-sm font-medium">
            Enable 2FA →
          </button>
        </div>

        {/* Login Sessions */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Active Sessions</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Current Session</p>
                <p className="text-xs text-gray-600">Chrome on Windows • Kenya</p>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;