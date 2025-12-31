// hooks/orderServiceApi.ts - FIXED TO PROPERLY HANDLE CHECKOUT SUMMARY
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/api';
import { 
  Order, 
  Address, 
  DeliveryOption,
  Cart
} from '../types/api';

// Add interface for paginated response
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// FIXED: Checkout Summary Interface - matches backend exactly
interface CheckoutSummary {
  cart: Cart;
  addresses: Address[]; // Direct array, not paginated
  delivery_options: DeliveryOption[]; // Direct array, not paginated
  prescription_required: boolean;
}

// Order Creation Interface
interface OrderCreateData {
  address_id: string;
  delivery_option_id: string;
  special_instructions?: string;
}

// Order Hooks
export const useOrders = () => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  
  return useQuery({
    queryKey: ['orders'],
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useOrder = (orderId: string) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async (): Promise<Order> => {
      const response = await api.get(`/orders/${orderId}/`);
      return response.data;
    },
    enabled: !!orderId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: OrderCreateData): Promise<Order> => {
      const response = await api.post('/create/order/', orderData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['checkout-summary'] });
      
      console.log('✅ Order created successfully:', data.order_id);
    },
    onError: (error: any) => {
      console.error('❌ Order creation failed:', error);
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderId: string): Promise<{ message: string }> => {
      const response = await api.post(`/orders/${orderId}/cancel/`);
      return response.data;
    },
    onSuccess: (data, orderId) => {
      // Update the specific order in cache
      queryClient.setQueryData(['order', orderId], (oldData: Order | undefined) => {
        if (oldData) {
          return { ...oldData, status: 'cancelled' };
        }
        return oldData;
      });
      
      // Update orders list
      queryClient.setQueryData(['orders'], (oldData: Order[] | undefined) => {
        if (oldData) {
          return oldData.map(order => 
            order.order_id === orderId 
              ? { ...order, status: 'cancelled' as const }
              : order
          );
        }
        return oldData;
      });
      
      console.log('✅ Order cancelled successfully:', orderId);
    },
    onError: (error: any) => {
      console.error('❌ Order cancellation failed:', error);
    },
  });
};

// FIXED: Checkout Summary Hook - proper error handling and data structure
export const useCheckoutSummary = () => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  
  return useQuery({
    queryKey: ['checkout-summary'],
    queryFn: async (): Promise<CheckoutSummary> => {
      console.log('🔵 Fetching checkout summary...');
      const response = await api.get('/checkout/summary/');
      
      console.log('🟢 Checkout summary response:', response.data);
      
      // Validate the response structure
      const data = response.data;
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid checkout summary response');
      }
      
      // Ensure we have the expected structure
      const checkoutSummary: CheckoutSummary = {
        cart: data.cart || { cart_id: '', items: [], total_items: 0, total_price: 0 },
        addresses: Array.isArray(data.addresses) ? data.addresses : [],
        delivery_options: Array.isArray(data.delivery_options) ? data.delivery_options : [],
        prescription_required: Boolean(data.prescription_required)
      };
      
      console.log('✅ Processed checkout summary:', {
        cartItems: checkoutSummary.cart.items?.length || 0,
        addressesCount: checkoutSummary.addresses.length,
        deliveryOptionsCount: checkoutSummary.delivery_options.length,
        prescriptionRequired: checkoutSummary.prescription_required
      });
      
      return checkoutSummary;
    },
    enabled: isAuthenticated,
    retry: 2,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// SEPARATE hooks for addresses (for standalone address management)
export const useAddresses = () => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  
  return useQuery({
    queryKey: ['addresses'],
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (addressData: Omit<Address, 'address_id'>): Promise<Address> => {
      const response = await api.post('/addresses/', addressData);
      return response.data;
    },
    onSuccess: (newAddress) => {
      // Add new address to addresses cache
      queryClient.setQueryData(['addresses'], (oldData: Address[] | undefined) => {
        if (oldData) {
          return [...oldData, newAddress];
        }
        return [newAddress];
      });
      
      // Update checkout summary cache to include new address
      queryClient.setQueryData(['checkout-summary'], (oldData: CheckoutSummary | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            addresses: [...oldData.addresses, newAddress]
          };
        }
        return oldData;
      });
      
      console.log('✅ Address created successfully:', newAddress.address_id);
    },
    onError: (error: any) => {
      console.error('❌ Address creation failed:', error);
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ addressId, data }: { addressId: string; data: Partial<Address> }): Promise<Address> => {
      const response = await api.put(`/addresses/${addressId}/`, data);
      return response.data;
    },
    onSuccess: (updatedAddress) => {
      // Update address in addresses cache
      queryClient.setQueryData(['addresses'], (oldData: Address[] | undefined) => {
        if (oldData) {
          return oldData.map(addr => 
            addr.address_id === updatedAddress.address_id ? updatedAddress : addr
          );
        }
        return [updatedAddress];
      });
      
      // Update checkout summary cache
      queryClient.setQueryData(['checkout-summary'], (oldData: CheckoutSummary | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            addresses: oldData.addresses.map(addr => 
              addr.address_id === updatedAddress.address_id ? updatedAddress : addr
            )
          };
        }
        return oldData;
      });
      
      console.log('✅ Address updated successfully:', updatedAddress.address_id);
    },
    onError: (error: any) => {
      console.error('❌ Address update failed:', error);
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (addressId: string): Promise<void> => {
      await api.delete(`/addresses/${addressId}/`);
    },
    onSuccess: (_, addressId) => {
      // Remove address from addresses cache
      queryClient.setQueryData(['addresses'], (oldData: Address[] | undefined) => {
        if (oldData) {
          return oldData.filter(addr => addr.address_id !== addressId);
        }
        return [];
      });
      
      // Update checkout summary cache
      queryClient.setQueryData(['checkout-summary'], (oldData: CheckoutSummary | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            addresses: oldData.addresses.filter(addr => addr.address_id !== addressId)
          };
        }
        return oldData;
      });
      
      console.log('✅ Address deleted successfully:', addressId);
    },
    onError: (error: any) => {
      console.error('❌ Address deletion failed:', error);
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (addressId: string): Promise<{ message: string }> => {
      const response = await api.post(`/addresses/${addressId}/set-default/`);
      return response.data;
    },
    onSuccess: (_, addressId) => {
      // Update addresses in cache
      queryClient.setQueryData(['addresses'], (oldData: Address[] | undefined) => {
        if (oldData) {
          return oldData.map(addr => ({
            ...addr,
            is_default: addr.address_id === addressId
          }));
        }
        return [];
      });
      
      // Update checkout summary cache
      queryClient.setQueryData(['checkout-summary'], (oldData: CheckoutSummary | undefined) => {
        if (oldData) {
          return {
            ...oldData,
            addresses: oldData.addresses.map(addr => ({
              ...addr,
              is_default: addr.address_id === addressId
            }))
          };
        }
        return oldData;
      });
      
      console.log('✅ Default address set successfully:', addressId);
    },
    onError: (error: any) => {
      console.error('❌ Set default address failed:', error);
    },
  });
};

// SEPARATE Delivery Options Hook (for standalone delivery management)
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
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

// Order Status Validation Helper
export const useCanCancelOrder = (order: Order | undefined) => {
  return order?.status === 'pending' || order?.status === 'processing';
};

// Order Summary Calculator
export const useOrderSummary = (cart: Cart, deliveryOption: DeliveryOption | null) => {
  const subtotal = cart?.total_price || 0;
  const deliveryFee = deliveryOption?.price || 0;
  const totalAmount = subtotal + deliveryFee;
  
  return {
    subtotal,
    deliveryFee,
    totalAmount,
    itemCount: cart?.total_items || 0
  };
};

// Prescription Validation Helper
export const useOrderValidation = (cart: Cart | null, selectedAddress: string, selectedDeliveryOption: string) => {
  const hasItems = cart && cart.items && cart.items.length > 0;
  const hasRequiredFields = selectedAddress && selectedDeliveryOption;
  const canPlaceOrder = hasItems && hasRequiredFields;
  
  return {
    hasItems: !!hasItems,
    hasRequiredFields: !!hasRequiredFields,
    canPlaceOrder,
    validationErrors: {
      noItems: !hasItems,
      missingAddress: !selectedAddress,
      missingDeliveryOption: !selectedDeliveryOption
    }
  };
};