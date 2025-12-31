// components/auth/LoginModal.tsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { useLogin } from '../../hooks/api';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const dispatch = useDispatch();
  const loginMutation = useLogin();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await loginMutation.mutateAsync(formData);

      dispatch(loginSuccess(response.user));
      setToast({
        show: true,
        message: 'Login successful!',
        type: 'success'
      });

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.detail || 'Login failed. Please try again.',
        type: 'error'
      });
    }
  };

  const handleModalClose = () => {
    setFormData({ email: '', password: '' });
    setErrors({});
    setToast({ show: false, message: '', type: 'success' });
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleModalClose} size="md">
        <div className="w-full max-w-[560px] h-[550px] flex flex-col mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-8 mb-6">
              <button
                onClick={onSwitchToRegister}
                className="text-[#898E93] text-[23px] font-medium leading-none"
                style={{ fontFamily: 'Inter' }}
              >
                Register
              </button>
              <button
                className="text-[#0C0C0C] text-[23px] font-medium leading-none border-b-2 border-[#D4AF37] pb-1"
                style={{ fontFamily: 'Inter' }}
              >
                Login
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 w-full">
            <div className="space-y-6 flex-1">
              {/* Email Field */}
              <div className="w-full">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  style={{
                    height: '74px',
                    padding: '27px 14px',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    color: '#898E93',
                    lineHeight: '140%',
                    letterSpacing: '-0.01em'
                  }}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="w-full">
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent pr-12"
                    style={{
                      height: '74px',
                      padding: '27px 14px',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      color: '#898E93',
                      lineHeight: '140%',
                      letterSpacing: '-0.01em'
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between w-full">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-[#898E93]" style={{ fontFamily: 'Inter' }}>
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-[#D4AF37] hover:text-[#D4AF37]/80"
                  style={{ fontFamily: 'Inter' }}
                >
                  Forgot Password ?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 w-full">
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full text-white font-medium text-lg rounded-[20px] hover:bg-[#D4AF37]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{
                  height: '85px',
                  backgroundColor: '#D4AF37',
                  fontFamily: 'Inter'
                }}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Login'}
              </button>
            </div>

            {/* Switch to Register */}
            <div className="text-center mt-6">
              <span className="text-[#898E93] text-sm" style={{ fontFamily: 'Inter' }}>
                Don't have an account?{' '}
              </span>
              <button
                type="button"
                onClick={onSwitchToRegister}
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

export default LoginModal;