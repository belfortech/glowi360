// utils/api.ts
import { API_BASE_URL } from '../config/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

export const apiCall = async (endpoint: string, options: ApiOptions = {}) => {
  const { method = 'GET', headers = {}, body, token } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
// API helper functions
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiCall('/auth/login/', { method: 'POST', body: credentials }),

  register: (userData: { name: string; email: string; password: string; phone: string }) =>
    apiCall('/auth/register/', { method: 'POST', body: userData }),

  logout: (token: string) =>
    apiCall('/auth/logout/', { method: 'POST', token }),
};

export const productsAPI = {
  getAll: (params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiCall(`/products/${queryString}`);
  },

  getById: (id: string) =>
    apiCall(`/products/${id}/`),

  search: (query: string) =>
    apiCall(`/products/search/?q=${encodeURIComponent(query)}`),
};

export const ordersAPI = {
  create: (orderData: any, token: string) =>
    apiCall('/orders/', { method: 'POST', body: orderData, token }),

  getAll: (token: string) =>
    apiCall('/orders/', { token }),

  getById: (id: string, token: string) =>
    apiCall(`/orders/${id}/`, { token }),
};
