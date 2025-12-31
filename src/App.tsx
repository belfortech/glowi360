// src/App.tsx - UPDATED WITH PROFILE MANAGEMENT ROUTE
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, useAppDispatch, useAppSelector } from './store';
import { setUser } from './store/slices/authSlice';

// Import pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';

// Import components
import Navbar from './components/layout/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Loading from './components/common/Loading';
import ProfileManagement from './components/auth/ProfileManagement';

// Create React Query client with updated configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Auth checker component with Redux integration
const AuthChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData && !isAuthenticated) {
      try {
        const user = JSON.parse(userData);
        dispatch(setUser(user));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Clear invalid data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }
    }
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};

// Main app content component
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.ui);

  // Show global loading if needed
  if (loading.global) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            
            {/* Auth routes - redirect if already authenticated */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} 
            />
            
            {/* Cart and Wishlist - Allow access even when not authenticated */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/order-success" element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            } />
            
            {/* ADD THIS ROUTE FOR PROFILE MANAGEMENT */}
            <Route path="/profile-management" element={
              <ProtectedRoute>
                <ProfileManagement />
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

// Root App component with all providers
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="min-h-screen flex items-center justify-center">
            <Loading size="lg" />
          </div>
        } 
        persistor={persistor}
      >
        <QueryClientProvider client={queryClient}>
          <AuthChecker>
            <AppContent />
          </AuthChecker>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;