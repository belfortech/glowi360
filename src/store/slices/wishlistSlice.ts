// src/store/slices/wishlistSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import { Product } from '../../types/api';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/wishlist/add/', { product_id: productId });
      return { productId, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/wishlist/remove/${productId}/`);
      return { productId, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove from wishlist');
    }
  }
);

interface WishlistState {
  wishlist: {
    wishlist_id: string;
    products: Product[];
  } | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist cases
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to wishlist cases
      .addCase(addToWishlist.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Remove from wishlist cases
      .addCase(removeFromWishlist.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlist, clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;