// components/auth/RegisterModal.tsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { useRegister } from '../../hooks/api';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const dispatch = useDispatch();
  const registerMutation = useRegister();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+254|254|0)?[1-9]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone_number && !validatePhone(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid Kenyan phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number || undefined,
        password: formData.password,
      };
      
      const response = await registerMutation.mutateAsync(registerData);
      
      setToast({
        show: true,
        message: 'Registration successful! Please log in.',
        type: 'success'
      });
      
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.email?.[0] || 
                          error.response?.data?.phone_number?.[0] || 
                          'Registration failed. Please try again.';
      
      setToast({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    }
  };

  const handleModalClose = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    });
    setErrors({});
    setToast({ show: false, message: '', type: 'success' });
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} size="lg">
        <div style={{ width: '560px', minHeight: '550px' }} className="flex flex-col px-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center space-x-8 mb-6">
              <button
                className="text-[#0C0C0C] text-[23px] font-medium leading-none border-b-2 border-[#D4AF37] pb-1"
                style={{ fontFamily: 'Inter' }}
              >
                Register
              </button>
              <button
                onClick={onSwitchToLogin}
                className="text-[#898E93] text-[23px] font-medium leading-none"
                style={{ fontFamily: 'Inter' }}
              >
                Login
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="space-y-3 flex-1">
              {/* Full Name */}
              <div>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-[14px] leading-[140%] tracking-[-0.01em]"
                  style={{
                    width: '100%',
                    height: '50px',
                    padding: '15px 14px',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    color: '#898E93'
                  }}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-[14px] leading-[140%] tracking-[-0.01em]"
                  style={{
                    width: '100%',
                    height: '50px',
                    padding: '15px 14px',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    color: '#898E93'
                  }}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <input
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="Choose your city or region"
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-[14px] leading-[140%] tracking-[-0.01em]"
                  style={{
                    width: '100%',
                    height: '50px',
                    padding: '15px 14px',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    color: '#898E93'
                  }}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-[14px] leading-[140%] tracking-[-0.01em] pr-12"
                    style={{
                      width: '100%',
                      height: '50px',
                      padding: '15px 14px',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      color: '#898E93'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#898E93]" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#898E93]" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-[14px] leading-[140%] tracking-[-0.01em] pr-12"
                    style={{
                      width: '100%',
                      height: '50px',
                      padding: '15px 14px',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      color: '#898E93'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-[#898E93]" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#898E93]" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="mt-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded mt-1"
                  />
                  <span className="ml-2 text-sm text-[#898E93]" style={{ fontFamily: 'Inter' }}>
                    By creating an account, you agree to the{' '}
                    <button type="button" className="text-[#D4AF37] hover:text-[#D4AF37]/80">
                      HealthX.com Free Membership Agreement
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-[#D4AF37] hover:text-[#D4AF37]/80">
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full text-white font-medium text-lg rounded-[20px] hover:bg-[#D4AF37]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                  width: '100%',
                  height: '60px',
                  backgroundColor: '#D4AF37',
                  fontFamily: 'Inter'
                }}
              >
                {registerMutation.isPending ? 'Creating account...' : 'Create account'}
              </button>
            </div>

            {/* Switch to Login */}
            <div className="text-center mt-4">
              <span className="text-[#898E93] text-sm" style={{ fontFamily: 'Inter' }}>
                Don't have an account?{' '}
              </span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-[#D4AF37] hover:text-[#D4AF37]/80 font-medium text-sm"
                style={{ fontFamily: 'Inter' }}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
};

export default RegisterModal;