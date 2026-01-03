// hooks/api.ts - UPDATED WITH LOCAL STORAGE SUPPORT
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { api } from '../config/api';
import { useAppSelector } from '../store';
import {
  User,
  Product,
  ProductListItem,
  Category,
  Brand,
  Cart,
  CartItem,
  Address,
  DeliveryOption,
  Order
} from '../types/api';
import {
  getLocalCart,
  getLocalWishlist,
  addToLocalCart,
  addToLocalWishlist,
  removeFromLocalCart,
  removeFromLocalWishlist,
  updateLocalCartItem,
  getLocalCartCount,
  getLocalWishlistCount,
  isInLocalWishlist,
  syncLocalCartToBackend,
  syncLocalWishlistToBackend
} from '../utils/localStorage';

// Add interface for paginated response
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Auth API calls
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post('/login/', credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      // Sync local cart and wishlist to backend WITHOUT clearing local storage
      try {
        // Sync cart
        const localCart = getLocalCart();
        if (localCart.length > 0) {
          console.log('🔄 Syncing local cart to backend...');
          await syncLocalCartToBackend(async (item) => {
            const response = await api.post('/cart/add/', item);
            return response.data;
          });
        }

        // Sync wishlist
        const localWishlist = getLocalWishlist();
        if (localWishlist.length > 0) {
          console.log('🔄 Syncing local wishlist to backend...');
          await syncLocalWishlistToBackend(async (productId) => {
            const response = await api.post('/wishlist/add/', { product_id: productId });
            return response.data;
          });
        }

        // Invalidate cart and wishlist queries to refetch from backend
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        queryClient.invalidateQueries({ queryKey: ['wishlist'] });

        console.log('✅ Login successful and local data synced to backend');
      } catch (error) {
        console.error('❌ Error syncing local data to backend:', error);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: {
      email: string;
      name: string;
      phone_number?: string;
      password: string;
    }) => {
      const response = await api.post('/register/', userData);
      return response.data;
    },
  });
};
// Replace your useCategories hook in api.ts with this debug version:

// Replace your useCategories hook in api.ts with this version:

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      console.log('🔍 API CALL: Starting /categories/ request');
      const response = await api.get('/categories/');

      console.log('🔍 API RESPONSE: Full response object:', response);
      console.log('🔍 API RESPONSE: response.data:', response.data);
      console.log('🔍 API RESPONSE: typeof response.data:', typeof response.data);
      console.log('🔍 API RESPONSE: Array.isArray(response.data):', Array.isArray(response.data));

      if (response.data && typeof response.data === 'object') {
        console.log('🔍 API RESPONSE: Object keys:', Object.keys(response.data));
        console.log('🔍 API RESPONSE: Has "results" property:', 'results' in response.data);
        console.log('🔍 API RESPONSE: Has "count" property:', 'count' in response.data);
        console.log('🔍 API RESPONSE: Has "next" property:', 'next' in response.data);
      }

      // Check if response is paginated
      if (response.data && typeof response.data === 'object' && 'results' in response.data) {
        console.log('🔍 API RESPONSE: PAGINATED - Processing results');
        const paginatedData = response.data as PaginatedResponse<Category>;
        console.log('🔍 API RESPONSE: paginatedData.results:', paginatedData.results);
        console.log('🔍 API RESPONSE: paginatedData.results length:', paginatedData.results?.length);
        return Array.isArray(paginatedData.results) ? paginatedData.results : [];
      }

      // Handle direct array response
      console.log('🔍 API RESPONSE: DIRECT ARRAY - Processing as array');
      console.log('🔍 API RESPONSE: Final return value:', Array.isArray(response.data) ? response.data : []);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: true,           // Force enable
    retry: 1,               // Allow retry
    refetchOnMount: true,   // Force refetch when component mounts
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 0,           // No cache - always fresh
    gcTime: 5 * 60 * 1000,  // 5 minutes garbage collection
  });
};

// Brands - Public data, always available
export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async (): Promise<Brand[]> => {
      console.log('🔍 API CALL: Starting /brands/ request');
      const response = await api.get('/brands/');

      console.log('🔍 API RESPONSE: Full response object:', response);
      console.log('🔍 API RESPONSE: response.data:', response.data);
      console.log('🔍 API RESPONSE: typeof response.data:', typeof response.data);
      console.log('🔍 API RESPONSE: Array.isArray(response.data):', Array.isArray(response.data));

      if (response.data && typeof response.data === 'object') {
        console.log('🔍 API RESPONSE: Object keys:', Object.keys(response.data));
        console.log('🔍 API RESPONSE: Has "results" property:', 'results' in response.data);
        console.log('🔍 API RESPONSE: Has "count" property:', 'count' in response.data);
        console.log('🔍 API RESPONSE: Has "next" property:', 'next' in response.data);
      }

      // Check if response is paginated
      if (response.data && typeof response.data === 'object' && 'results' in response.data) {
        console.log('🔍 API RESPONSE: PAGINATED - Processing results');
        const paginatedData = response.data as PaginatedResponse<Brand>;
        console.log('🔍 API RESPONSE: paginatedData.results:', paginatedData.results);
        console.log('🔍 API RESPONSE: paginatedData.results length:', paginatedData.results?.length);
        return Array.isArray(paginatedData.results) ? paginatedData.results : [];
      }

      // Handle direct array response
      console.log('🔍 API RESPONSE: DIRECT ARRAY - Processing as array');
      console.log('🔍 API RESPONSE: Final return value:', Array.isArray(response.data) ? response.data : []);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: true,           // Force enable
    retry: 1,               // Allow retry
    refetchOnMount: true,   // Force refetch when component mounts
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 0,           // No cache - always fresh
    gcTime: 5 * 60 * 1000,  // 5 minutes garbage collection
  });
};

// Products - ALL PRODUCTS API - SEPARATE QUERY KEY
export const useProducts = (params?: {
  category?: string;
  search?: string;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ['all-products'],
    queryFn: async (): Promise<ProductListItem[]> => {
      try {
        const response = await api.get('/products/');

        console.log('🌐 API Response:', response.data);

        // Check if response is paginated
        if (response.data && typeof response.data === 'object' && 'results' in response.data) {
          const paginatedData = response.data as PaginatedResponse<ProductListItem>;
          console.log('📄 Paginated response, products count:', paginatedData.results?.length);
          return Array.isArray(paginatedData.results) ? paginatedData.results : [];
        }

        // Handle direct array response
        console.log('📄 Direct array response, products count:', response.data?.length);
        return Array.isArray(response.data) ? response.data : [];

      } catch (error: any) {
        console.error('🔴 useProducts - API Error:', error);
        throw error;
      }
    },
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

// Featured Products - FEATURED PRODUCTS API - COMPLETELY SEPARATE QUERY KEY
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products-only'],
    queryFn: async (): Promise<ProductListItem[]> => {
      try {
        const response = await api.get('/products/featured/');

        // Check if response is paginated
        if (response.data && typeof response.data === 'object' && 'results' in response.data) {
          const paginatedData = response.data as PaginatedResponse<ProductListItem>;
          return Array.isArray(paginatedData.results) ? paginatedData.results : [];
        }

        // Handle direct array response
        return Array.isArray(response.data) ? response.data : [];

      } catch (error: any) {
        console.error('🔴 useFeaturedProducts - API Error:', error);
        throw error;
      }
    },
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

// Product Detail - SINGLE PRODUCT API - SEPARATE QUERY KEY
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['single-product', productId],
    queryFn: async (): Promise<Product> => {
      const response = await api.get(`/products/${productId}/`);
      return response.data;
    },
    enabled: !!productId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

// Cart - Works for both authenticated and guest users
export const useCart = () => {
  // Use reactive auth state from Redux store
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ['cart', isAuthenticated], // Include auth state in key for proper cache separation
    queryFn: async (): Promise<Cart> => {
      if (isAuthenticated) {
        const response = await api.get('/cart/');
        return response.data;
      } else {
        // Return local cart data for guest users
        const localCart = getLocalCart();
        const localCartCount = getLocalCartCount();

        return {
          cart_id: 'local-cart',
          items: [], // We'll populate this with product details in the UI
          total_items: localCartCount,
          total_price: 0, // Will be calculated in the UI
        };
      }
    },
    enabled: true,
    retry: 1,
    refetchOnMount: true, // Refetch when component mounts to get fresh data
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useMutation({
    mutationFn: async (data: { product_id: string; quantity: number }) => {
      if (isAuthenticated) {
        const response = await api.post('/cart/add/', data);
        return response.data;
      } else {
        // Add to local storage for guest users
        addToLocalCart(data.product_id, data.quantity);
        return { success: true, message: 'Added to local cart' };
      }
    },
    onSuccess: () => {
      // Invalidate both possible cache keys
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Add to cart error:', error);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (isAuthenticated) {
        const response = await api.put(`/cart/update/${itemId}/`, { quantity });
        return response.data;
      } else {
        // For local cart, itemId is actually the product_id
        updateLocalCartItem(itemId, quantity);
        return { success: true, message: 'Updated local cart' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useMutation({
    mutationFn: async (itemId: string) => {
      if (isAuthenticated) {
        const response = await api.delete(`/cart/remove/${itemId}/`);
        return response.data;
      } else {
        // For local cart, itemId is actually the product_id
        removeFromLocalCart(itemId);
        return { success: true, message: 'Removed from local cart' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Wishlist - Works for both authenticated and guest users
export const useWishlist = () => {
  // Use reactive auth state from Redux store
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ['wishlist', isAuthenticated], // Include auth state in key for proper cache separation
    queryFn: async () => {
      if (isAuthenticated) {
        const response = await api.get('/wishlist/');
        return response.data;
      } else {
        // Return local wishlist data for guest users
        const localWishlist = getLocalWishlist();
        const localWishlistCount = getLocalWishlistCount();

        return {
          wishlist_id: 'local-wishlist',
          products: [], // We'll populate this with product details in the UI
          count: localWishlistCount,
        };
      }
    },
    enabled: true,
    retry: 1,
    refetchOnMount: true, // Refetch when component mounts to get fresh data
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        const response = await api.post('/wishlist/add/', { product_id: productId });
        return response.data;
      } else {
        // Add to local storage for guest users
        addToLocalWishlist(productId);
        return { success: true, message: 'Added to local wishlist' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        const response = await api.delete(`/wishlist/remove/${productId}/`);
        return response.data;
      } else {
        // Remove from local storage for guest users
        removeFromLocalWishlist(productId);
        return { success: true, message: 'Removed from local wishlist' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

// Helper hook to get wishlist status for a product
export const useIsWishlisted = (productId: string) => {
  const { data: wishlist } = useWishlist();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useMemo(() => {
    if (isAuthenticated) {
      return wishlist?.products?.some((p: any) => p.product_id === productId) || false;
    } else {
      return isInLocalWishlist(productId);
    }
  }, [wishlist, productId, isAuthenticated]);
};

// Helper hook to get cart count
export const useCartCount = () => {
  const { data: cart } = useCart();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useMemo(() => {
    if (isAuthenticated) {
      return cart?.total_items || 0;
    } else {
      return getLocalCartCount();
    }
  }, [cart, isAuthenticated]);
};

// Helper hook to get wishlist count
export const useWishlistCount = () => {
  const { data: wishlist } = useWishlist();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useMemo(() => {
    if (isAuthenticated) {
      return wishlist?.products?.length || 0;
    } else {
      return getLocalWishlistCount();
    }
  }, [wishlist, isAuthenticated]);
};

// Rest of the existing hooks remain the same...
// Addresses - Only fetch if user is authenticated
export const useAddresses = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ['addresses', isAuthenticated],
    queryFn: async (): Promise<Address[]> => {
      const response = await api.get('/addresses/');

      // Check if response is paginated
      if (response.data && typeof response.data === 'object' && 'results' in response.data) {
        const paginatedData = response.data as PaginatedResponse<Address>;
        return Array.isArray(paginatedData.results) ? paginatedData.results : [];
      }

      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: isAuthenticated,
    initialData: [],
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressData: Omit<Address, 'address_id'>) => {
      const response = await api.post('/addresses/', addressData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ addressId, data }: { addressId: string; data: Partial<Address> }) => {
      const response = await api.put(`/addresses/${addressId}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      const response = await api.delete(`/addresses/${addressId}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressId: string) => {
      const response = await api.post(`/addresses/${addressId}/set-default/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

// Delivery Options - Public data, always available
export const useDeliveryOptions = () => {
  return useQuery({
    queryKey: ['delivery-options'],
    queryFn: async (): Promise<DeliveryOption[]> => {
      const response = await api.get('/delivery-options/');

      // Check if response is paginated
      if (response.data && typeof response.data === 'object' && 'results' in response.data) {
        const paginatedData = response.data as PaginatedResponse<DeliveryOption>;
        return Array.isArray(paginatedData.results) ? paginatedData.results : [];
      }

      return Array.isArray(response.data) ? response.data : [];
    },
    initialData: [],
    staleTime: 15 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// Orders - Only fetch if user is authenticated
export const useOrders = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ['orders', isAuthenticated],
    queryFn: async (): Promise<Order[]> => {
      const response = await api.get('/orders/');

      // Check if response is paginated
      if (response.data && typeof response.data === 'object' && 'results' in response.data) {
        const paginatedData = response.data as PaginatedResponse<Order>;
        return Array.isArray(paginatedData.results) ? paginatedData.results : [];
      }

      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: isAuthenticated,
    initialData: [],
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useOrder = (orderId: string) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ['order', orderId, isAuthenticated],
    queryFn: async (): Promise<Order> => {
      const response = await api.get(`/orders/${orderId}/`);
      return response.data;
    },
    enabled: !!orderId && isAuthenticated,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      address_id: string;
      delivery_option_id: string;
      special_instructions?: string;
    }) => {
      const response = await api.post('/create/order/', orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Checkout Summary - Only fetch if user is authenticated
export const useCheckoutSummary = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ['checkout-summary', isAuthenticated],
    queryFn: async () => {
      const response = await api.get('/checkout/summary/');
      return response.data;
    },
    enabled: isAuthenticated,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.post(`/orders/${orderId}/cancel/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
