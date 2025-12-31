// src/store/slices/productSlice.ts - FIXED VERSION
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import { Product, Category } from '../../types/api';

// Fixed the parameter order - optional parameters must come after required ones
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { category?: string; search?: string; featured?: boolean } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch products');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/featured/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch featured products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch categories');
    }
  }
);

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  categories: Category[];
  isLoading: boolean;
  isLoadingFeatured: boolean;
  isLoadingProduct: boolean;
  isLoadingCategories: boolean;
  error: string | null;
  filters: {
    category?: string;
    search?: string;
    brand?: string;
    inStock?: boolean;
  };
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  isLoading: false,
  isLoadingFeatured: false,
  isLoadingProduct: false,
  isLoadingCategories: false,
  error: null,
  filters: {},
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products cases
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch featured products cases
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.isLoadingFeatured = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
        state.isLoadingFeatured = false;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.isLoadingFeatured = false;
        state.error = action.payload as string;
      })
      // Fetch product by ID cases
      .addCase(fetchProductById.pending, (state) => {
        state.isLoadingProduct = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.isLoadingProduct = false;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoadingProduct = false;
        state.error = action.payload as string;
      })
      // Fetch categories cases
      .addCase(fetchCategories.pending, (state) => {
        state.isLoadingCategories = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoadingCategories = false;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoadingCategories = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;