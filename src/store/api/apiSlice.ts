// store/api/apiSlice.ts (Fixed)
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return `products/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Product'],
    }),
    getProductById: builder.query({
      query: (id) => `products/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Orders
    getOrders: builder.query({
      query: () => 'orders/',
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: 'orders/',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),

    // Auth
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: 'auth/register/',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useLoginMutation,
  useRegisterMutation,
} = apiSlice;

export default apiSlice;
