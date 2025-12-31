// src/store/slices/addressSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../config/api';
import { Address } from '../../types/api';

export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/addresses/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch addresses');
    }
  }
);

export const createAddress = createAsyncThunk(
  'addresses/createAddress',
  async (addressData: Omit<Address, 'address_id'>, { rejectWithValue }) => {
    try {
      const response = await api.post('/addresses/', addressData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create address');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async ({ addressId, data }: { addressId: string; data: Partial<Address> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/addresses/${addressId}/`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/addresses/${addressId}/`);
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete address');
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'addresses/setDefaultAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/addresses/${addressId}/set-default/`);
      return { addressId, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to set default address');
    }
  }
);

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  isLoading: false,
  isUpdating: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch addresses cases
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create address cases
      .addCase(createAddress.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Update address cases
      .addCase(updateAddress.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(addr => addr.address_id === action.payload.address_id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Delete address cases
      .addCase(deleteAddress.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(addr => addr.address_id !== action.payload);
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Set default address cases
      .addCase(setDefaultAddress.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        // Update all addresses to not be default
        state.addresses.forEach(addr => {
          addr.is_default = addr.address_id === action.payload.addressId;
        });
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;