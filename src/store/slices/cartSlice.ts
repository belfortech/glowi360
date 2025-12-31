// src/store/slices/cartSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import { Cart, CartItem } from '../../types/api';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: { product_id: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/add/', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/update/${itemId}/`, { quantity });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/cart/remove/${itemId}/`);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove from cart');
    }
  }
);

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart cases
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to cart cases
      .addCase(addToCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Update cart item cases
      .addCase(updateCartItem.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Remove from cart cases
      .addCase(removeFromCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;