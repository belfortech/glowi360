// src/store/slices/orderSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import { Order, Address, DeliveryOption } from '../../types/api';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${orderId}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: {
    address_id: string;
    delivery_option_id: string;
    special_instructions?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/create/order/', orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create order');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/orders/${orderId}/cancel/`);
      return { orderId, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel order');
    }
  }
);

export const fetchCheckoutSummary = createAsyncThunk(
  'orders/fetchCheckoutSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/checkout/summary/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch checkout summary');
    }
  }
);

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  checkoutSummary: {
    cart: any;
    addresses: Address[];
    delivery_options: DeliveryOption[];
    prescription_required: boolean;
  } | null;
  isLoading: boolean;
  isLoadingOrder: boolean;
  isLoadingCheckout: boolean;
  isCreating: boolean;
  isCancelling: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  checkoutSummary: null,
  isLoading: false,
  isLoadingOrder: false,
  isLoadingCheckout: false,
  isCreating: false,
  isCancelling: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearCheckoutSummary: (state) => {
      state.checkoutSummary = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders cases
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch order by ID cases
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoadingOrder = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.isLoadingOrder = false;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoadingOrder = false;
        state.error = action.payload as string;
      })
      // Create order cases
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.isCreating = false;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      // Cancel order cases
      .addCase(cancelOrder.pending, (state) => {
        state.isCancelling = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const orderIndex = state.orders.findIndex(order => order.order_id === action.payload.orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = 'cancelled';
        }
        state.isCancelling = false;
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isCancelling = false;
        state.error = action.payload as string;
      })
      // Fetch checkout summary cases
      .addCase(fetchCheckoutSummary.pending, (state) => {
        state.isLoadingCheckout = true;
        state.error = null;
      })
      .addCase(fetchCheckoutSummary.fulfilled, (state, action) => {
        state.checkoutSummary = action.payload;
        state.isLoadingCheckout = false;
        state.error = null;
      })
      .addCase(fetchCheckoutSummary.rejected, (state, action) => {
        state.isLoadingCheckout = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearCheckoutSummary, clearError } = orderSlice.actions;
export default orderSlice.reducer;