// src/config/api.ts - CENTRALIZED API CONFIGURATION
import axios from 'axios';

// ============================================
// CENTRALIZED API CONFIGURATION
// ============================================
// All API URLs should be imported from this file
// Do NOT define API_BASE_URL anywhere else in the project

// Main API base URL for user/auth endpoints
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://api.glowcare360.com/user/';

// Media/static files base URL (for images, etc.)
export const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL || 'http://api.glowcare360.com';

// Helper function to get full image URL
export const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) return '/api/placeholder/400/400';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${MEDIA_BASE_URL}${imageUrl}`;
};

console.log('🔵 API Config - Base URL:', API_BASE_URL);
console.log('🔵 API Config - Media URL:', MEDIA_BASE_URL);
console.log('🔵 API Config - Environment:', process.env.NODE_ENV);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor with detailed logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    console.log('🔵 API Request Starting:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params,
      data: config.data,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔵 API Request - Token added to headers');
    } else {
      console.log('🟡 API Request - No token found in localStorage');
    }

    return config;
  },
  (error) => {
    console.error('🔴 API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with detailed logging
api.interceptors.response.use(
  (response) => {
    console.log('🟢 API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      dataType: typeof response.data,
      dataKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : 'Not an object',
      dataLength: Array.isArray(response.data) ? response.data.length : 'Not an array',
      data: response.data,
    });

    return response;
  },
  async (error) => {
    console.error('🔴 API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      errorMessage: error.message,
      responseData: error.response?.data,
      isNetworkError: error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK',
      isTimeoutError: error.code === 'ECONNABORTED',
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🟡 API Response - 401 detected, attempting token refresh');
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        console.log('🟡 API Response - Refresh token found, attempting refresh');
        try {
          const response = await axios.post(`${API_BASE_URL}/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          console.log('🟢 API Response - Token refreshed successfully');

          return api(originalRequest);
        } catch (refreshError: any) {
          console.error('🔴 API Response - Token refresh failed:', refreshError);
          // If refresh fails, clear tokens and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          console.log('🔴 API Response - Redirecting to login due to refresh failure');
          window.location.href = '/login';
        }
      } else {
        console.log('🔴 API Response - No refresh token found, redirecting to login');
        // No refresh token, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

console.log('🟢 API Config - Axios instance created successfully');

export default api;
