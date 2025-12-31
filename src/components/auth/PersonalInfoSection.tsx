// components/profile/PersonalInfoSection.tsx
import React, { useState, useEffect } from 'react';
import { Camera, Edit2, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

// Types for backend integration
interface UserProfile {
  profile_id: string;
  full_name: string;
  date_of_birth: string | null;
  known_allergies: string[] | null;
  city: string | null;
  gender: 'male' | 'female' | 'other' | null;
  emergency_contact_phone: string | null;
  profile_picture: string | null;
  age: number | null;
  genotype: 'AA' | 'AS' | 'SS' | 'AC' | 'SC' | 'CC' | null;
  blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null;
  height_cm: number | null;
  weight_kg: number | null;
  height_display: string | null;
  weight_display: string | null;
  bmi: number | null;
}

interface ValidationErrors {
  [key: string]: string;
}

const PersonalInfoSection: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // State management
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    city: '',
    emergency_contact_phone: '',
    known_allergies: [] as string[],
    genotype: '' as 'AA' | 'AS' | 'SS' | 'AC' | 'SC' | 'CC' | '',
    blood_group: '' as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '',
    height_cm: '',
    weight_kg: ''
  });

  // Configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  const getAuthToken = () => {
    return localStorage.getItem('access_token');
  };

  // Validation helper functions
  const validateFormData = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validate full name
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters long';
    }

    // Validate date of birth
    if (formData.date_of_birth) {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (birthDate > today) {
        errors.date_of_birth = 'Date of birth cannot be in the future';
      } else if (age < 0 || age > 150) {
        errors.date_of_birth = 'Please enter a valid date of birth';
      }
    }

    // Validate height
    if (formData.height_cm) {
      const height = parseFloat(formData.height_cm);
      if (isNaN(height) || height < 30 || height > 300) {
        errors.height_cm = 'Height must be between 30 and 300 cm';
      }
    }

    // Validate weight
    if (formData.weight_kg) {
      const weight = parseFloat(formData.weight_kg);
      if (isNaN(weight) || weight < 1 || weight > 500) {
        errors.weight_kg = 'Weight must be between 1 and 500 kg';
      }
    }

    // Validate phone number format (basic validation)
    if (formData.emergency_contact_phone) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
      if (!phoneRegex.test(formData.emergency_contact_phone.trim())) {
        errors.emergency_contact_phone = 'Please enter a valid phone number';
      }
    }

    // Validate city
    if (formData.city && formData.city.trim().length < 2) {
      errors.city = 'City name must be at least 2 characters long';
    }

    return errors;
  };

  // Check if form data is valid
  const isFormValid = (): boolean => {
    const errors = validateFormData();
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper function to safely convert string to number or null
  const safeParseFloat = (value: string): number | null => {
    if (!value || value.trim() === '') return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profileData: UserProfile = await response.json();
      setProfile(profileData);
      
      // Update form data with backend data
      setFormData({
        full_name: profileData.full_name || '',
        date_of_birth: profileData.date_of_birth || '',
        gender: profileData.gender || '',
        city: profileData.city || '',
        emergency_contact_phone: profileData.emergency_contact_phone || '',
        known_allergies: profileData.known_allergies || [],
        genotype: profileData.genotype || '',
        blood_group: profileData.blood_group || '',
        height_cm: profileData.height_cm ? String(profileData.height_cm) : '',
        weight_kg: profileData.weight_kg ? String(profileData.weight_kg) : ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile data
  const updateProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      setValidationErrors({});

      // Validate form data before sending
      if (!isFormValid()) {
        setSaving(false);
        return;
      }

      const token = getAuthToken();

      // Prepare the payload with proper data types
      const payload = {
        full_name: formData.full_name.trim(),
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        city: formData.city.trim() || null,
        emergency_contact_phone: formData.emergency_contact_phone.trim() || null,
        known_allergies: formData.known_allergies.length > 0 ? formData.known_allergies : null,
        genotype: formData.genotype || null,
        blood_group: formData.blood_group || null,
        height_cm: safeParseFloat(formData.height_cm),
        weight_kg: safeParseFloat(formData.weight_kg)
      };

      console.log('Sending profile update payload:', payload);

      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile update error:', errorData);
        
        // Handle field-specific errors from backend
        if (errorData.errors || errorData.detail) {
          const backendErrors = errorData.errors || { general: errorData.detail };
          setValidationErrors(backendErrors);
        }
        
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedProfile: UserProfile = await response.json();
      setProfile(updatedProfile);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setValidationErrors({});
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Delete account functionality
  const deleteAccount = async () => {
    try {
      setDeleting(true);
      setError(null);
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/auth/delete-account/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }

      dispatch(logout());
      navigate('/');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (file: File) => {
    try {
      setUploadingImage(true);
      setError(null);
      const token = getAuthToken();

      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await fetch(`${API_BASE_URL}/profile/picture/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload profile picture');
      }

      const responseData = await response.json();
      setProfile(responseData.profile);
      setSuccessMessage('Profile picture updated successfully!');
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle file input change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      uploadProfilePicture(file);
    }
  };

  // Handle form input changes with real-time validation
  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Clear general error when user starts typing
    if (error) {
      setError(null);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing && profile) {
      // Reset form data to profile data when canceling
      setFormData({
        full_name: profile.full_name || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        city: profile.city || '',
        emergency_contact_phone: profile.emergency_contact_phone || '',
        known_allergies: profile.known_allergies || [],
        genotype: profile.genotype || '',
        blood_group: profile.blood_group || '',
        height_cm: profile.height_cm ? String(profile.height_cm) : '',
        weight_kg: profile.weight_kg ? String(profile.weight_kg) : ''
      });
    }
    setIsEditing(!isEditing);
    setError(null);
    setValidationErrors({});
  };

  // Format date for input field
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  // Get field error message
  const getFieldError = (fieldName: string): string | null => {
    return validationErrors[fieldName] || null;
  };

  // Load profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 flex justify-center items-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      {/* Header */}
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
            Personal Info
          </h3>
          <p 
            className="text-sm text-gray-500"
            style={{
              fontFamily: 'Inter',
              fontSize: '14px'
            }}
          >
            Update your profile, contact details to personalize your experience.
          </p>
        </div>
        <button
          onClick={toggleEditMode}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#D4AF37] transition-colors"
          style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '14px'
          }}
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? 'Cancel' : 'Edit profile'}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium mb-2">Please correct the following errors:</p>
          <ul className="text-red-600 text-sm list-disc list-inside space-y-1">
            {Object.entries(validationErrors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div 
            className="rounded-full overflow-hidden border-4 border-gray-200"
            style={{ width: '165px', height: '165px' }}
          >
            <img
              src={profile?.profile_picture || '/api/placeholder/165/165'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label className="absolute bottom-2 right-2 w-10 h-10 bg-black bg-opacity-60 rounded-full flex items-center justify-center text-white hover:bg-opacity-80 transition-all cursor-pointer">
            {uploadingImage ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Camera className="w-5 h-5" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {!isEditing ? (
          /* Read-only View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">First Name</label>
              <p className="text-gray-800">{formData.full_name.split(' ')[0] || 'Not provided'}</p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Last Name</label>
              <p className="text-gray-800">{formData.full_name.split(' ').slice(1).join(' ') || 'Not provided'}</p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Date of birth</label>
              <p className="text-gray-800">{formData.date_of_birth || 'Not provided'}</p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Gender</label>
              <p className="text-gray-800 capitalize">{formData.gender || 'Not provided'}</p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Genotype</label>
              <p className="text-gray-800">{formData.genotype || 'Not provided'}</p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Blood Group</label>
              <p className="text-gray-800">{formData.blood_group || 'Not provided'}</p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Height (cm)</label>
              <p className="text-gray-800">{formData.height_cm || 'Not provided'}</p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">Weight (kg)</span>
              </label>
              <p className="text-gray-800">{formData.weight_kg || 'Not provided'}</p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Home Address</label>
              <p className="text-gray-800">{formData.city || 'Not provided'}</p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Email Address</label>
              <p className="text-gray-800">{user?.email || 'Not provided'}</p>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent ${
                  getFieldError('full_name') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {getFieldError('full_name') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('full_name')}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Date of birth</label>
              <input
                type="date"
                value={formatDateForInput(formData.date_of_birth)}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent ${
                  getFieldError('date_of_birth') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {getFieldError('date_of_birth') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('date_of_birth')}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter your city"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent ${
                  getFieldError('city') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {getFieldError('city') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('city')}</p>
              )}
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Emergency Contact Phone</label>
              <input
                type="tel"
                value={formData.emergency_contact_phone}
                onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                placeholder="Enter emergency contact number"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent ${
                  getFieldError('emergency_contact_phone') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {getFieldError('emergency_contact_phone') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('emergency_contact_phone')}</p>
              )}
            </div>

            {/* Genotype */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Genotype</label>
              <select
                value={formData.genotype}
                onChange={(e) => handleInputChange('genotype', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="">Select Genotype</option>
                <option value="AA">AA</option>
                <option value="AS">AS</option>
                <option value="SS">SS</option>
                <option value="AC">AC</option>
                <option value="SC">SC</option>
                <option value="CC">CC</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Blood Group</label>
              <select
                value={formData.blood_group}
                onChange={(e) => handleInputChange('blood_group', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Height */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                value={formData.height_cm}
                onChange={(e) => handleInputChange('height_cm', e.target.value)}
                placeholder="Enter height in cm"
                min="30"
                max="300"
                step="0.1"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent ${
                  getFieldError('height_cm') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {getFieldError('height_cm') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('height_cm')}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight_kg}
                onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                placeholder="Enter weight in kg"
                min="1"
                max="500"
                step="0.1"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent ${
                  getFieldError('weight_kg') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {getFieldError('weight_kg') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('weight_kg')}</p>
              )}
            </div>

            {/* BMI Display */}
            {profile?.bmi && (
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">BMI (Body Mass Index)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={`${profile.bmi} kg/m²`}
                    disabled
                    className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <span className="text-sm text-gray-500">
                    {profile.bmi < 18.5 ? 'Underweight' : 
                     profile.bmi < 25 ? 'Normal weight' : 
                     profile.bmi < 30 ? 'Overweight' : 'Obese'}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button
                onClick={updateProfile}
                disabled={saving}
                className="px-6 py-2 rounded-lg text-white transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: saving ? '#9CA3AF' : '#D4AF37',
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: '14px'
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={toggleEditMode}
                disabled={saving}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Delete Account Section */}
        <div className="border-t pt-8 mt-8">
          <div className="bg-red-50 rounded-lg p-6">
            <h4 
              className="text-lg font-medium text-red-800 mb-2"
              style={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '16px'
              }}
            >
              Delete Account
            </h4>
            <p 
              className="text-red-600 text-sm mb-4"
              style={{
                fontFamily: 'Inter',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
            >
              Deleting your HealthX account will erase all personal data, medical history, 
              prescriptions, and consultation records linked to your profile. This action is 
              permanent and cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              style={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '14px'
              }}
            >
              {deleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="border-t pt-6 mt-6">
          <h4 className="text-lg font-medium mb-4 text-gray-700">Account Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                style={{ fontFamily: 'Inter', fontSize: '14px' }}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-600">Phone Number</label>
              <input
                type="tel"
                value={user?.phone_number || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                style={{ fontFamily: 'Inter', fontSize: '14px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Confirm Account Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={deleteAccount}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;