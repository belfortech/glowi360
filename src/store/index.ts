// src/store/index.ts - COMPLETE STORE CONFIGURATION WITH PRESCRIPTION SLICE
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import all reducers
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';
import addressReducer from './slices/addressSlice';
import uiReducer from './slices/uiSlice';
import prescriptionReducer from './slices/prescriptionSlice';

// Typed hooks for use throughout the app
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // Only persist auth and ui state
  blacklist: ['products', 'cart', 'wishlist', 'orders', 'addresses', 'prescription'], // Don't persist these (fetch fresh)
};

// Auth persist config (separate config for sensitive data)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated'], // Only persist authentication status
  blacklist: ['isLoading', 'error'], // Don't persist temporary states
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  products: productReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  orders: orderReducer,
  addresses: addressReducer,
  ui: uiReducer,
  prescription: prescriptionReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with all middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['_persist'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Action creators for easier importing
export { loginUser, registerUser, logout } from './slices/authSlice';
export { fetchProducts, fetchFeaturedProducts, fetchProductById, fetchCategories } from './slices/productSlice';
export { fetchCart, addToCart, updateCartItem, removeFromCart } from './slices/cartSlice';
export { fetchWishlist, addToWishlist, removeFromWishlist } from './slices/wishlistSlice';
export { fetchOrders, fetchOrderById, createOrder, cancelOrder, fetchCheckoutSummary } from './slices/orderSlice';
export { fetchAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from './slices/addressSlice';
export { showToast, hideToast, openModal, closeModal } from './slices/uiSlice';

// Prescription action creators
export {
  setLoading as setPrescriptionLoading,
  setUploading as setPrescriptionUploading,
  setError as setPrescriptionError,
  setSuccessMessage as setPrescriptionSuccess,
  clearMessages as clearPrescriptionMessages,
  setPrescriptions,
  setActivePrescriptions,
  setExpiredPrescriptions,
  addPrescription,
  removePrescription,
  updatePrescription,
} from './slices/prescriptionSlice';

export default store;