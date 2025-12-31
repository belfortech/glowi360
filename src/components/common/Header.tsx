// components/common/Header.tsx - UPDATED WITH PROFILE MANAGEMENT NAVIGATION
import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useCartCount, useWishlistCount, useCategories } from '../../hooks/api';
import AuthModalManager from '../auth/AuthModalManager';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  // Get cart and wishlist counts (works for both authenticated and guest users)
  const cartItemCount = useCartCount();
  const wishlistItemCount = useWishlistCount();
  
  // Get categories from backend /categories/ endpoint
  const { data: categoriesData = [] } = useCategories();
  
  // Transform categories
  const categories = useMemo(() => {
    console.log('🔍 HEADER CATEGORIES DEBUG: categoriesData:', categoriesData);
    console.log('🔍 HEADER CATEGORIES DEBUG: categoriesData length:', categoriesData.length);
    
    return categoriesData.map(category => {
      console.log('🔍 HEADER CATEGORIES DEBUG: Processing category:', category);
      return {
        name: category.name,
        slug: category.slug,
        category_id: category.category_id
      };
    });
  }, [categoriesData]);

  // Helper function to check if current path matches nav item
  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsDropdownOpen(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile-management');
    } else {
      setIsLoginModalOpen(true);
    }
    setIsDropdownOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegisterClick = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseRegister = () => {
    setIsRegisterModalOpen(false);
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setIsRegisterModalOpen(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50 mb-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center ml-4" onClick={handleLinkClick}>
              <img 
                src="/Healthx-Logo.png" 
                alt="HealthX Logo"
                className="h-14 w-auto max-w-[140px]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/140/56';
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="transition-colors"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: isActiveRoute('/') ? 500 : 400,
                  fontSize: '18px',
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  textDecoration: isActiveRoute('/') ? 'underline' : 'none',
                  color: isActiveRoute('/') ? '#D4AF37' : '#6B7280'
                }}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/')) {
                    e.currentTarget.style.color = '#D4AF37';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/')) {
                    e.currentTarget.style.color = '#6B7280';
                  }
                }}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="transition-colors"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: isActiveRoute('/products') ? 500 : 400,
                  fontSize: '18px',
                  lineHeight: '150%',
                  letterSpacing: '0%',
                  textDecoration: isActiveRoute('/products') ? 'underline' : 'none',
                  color: isActiveRoute('/products') ? '#D4AF37' : '#6B7280'
                }}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/products')) {
                    e.currentTarget.style.color = '#D4AF37';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/products')) {
                    e.currentTarget.style.color = '#6B7280';
                  }
                }}
              >
                Shop
              </Link>
              <div className="relative group">
                <button 
                  className="flex items-center transition-colors"
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '18px',
                    lineHeight: '150%',
                    letterSpacing: '0%',
                    color: '#6B7280'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#D4AF37';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6B7280';
                  }}
                >
                  Categories
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {/* Categories Dropdown */}
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-20 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category.category_id || category.slug}
                        to={`/products?category=${category.slug}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#D4AF37]"
                      >
                        {category.name}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400 italic">
                      No categories available
                    </div>
                  )}
                </div>
              </div>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-gray-600 hover:text-[#D4AF37] transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>

              {/* Login/Register - CHANGED TO USE MODALS */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-[#D4AF37] transition-colors"
                  >
                    <User className="w-6 h-6" />
                    <span className="hidden lg:inline font-medium max-w-[120px] truncate">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#D4AF37]"
                      >
                        Profile
                      </button>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#D4AF37]"
                        onClick={handleLinkClick}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#D4AF37]"
                        onClick={handleLinkClick}
                      >
                        <span>Wishlist</span>
                        {wishlistItemCount > 0 && (
                          <span className="bg-[#D4AF37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                            {wishlistItemCount}
                          </span>
                        )}
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#D4AF37]"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center">
                  <button
                    onClick={handleLoginClick}
                    className="transition-colors"
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 400,
                      fontSize: '18px',
                      lineHeight: '150%',
                      letterSpacing: '0%',
                      color: '#6B7280'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#D4AF37';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6B7280';
                    }}
                  >
                    Login
                  </button>
                  <span className="text-gray-400 mx-1">/</span>
                  <button
                    onClick={handleRegisterClick}
                    className="transition-colors px-3 py-1 rounded"
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      fontSize: '18px',
                      lineHeight: '27px',
                      letterSpacing: '0px',
                      backgroundColor: '#D4AF37',
                      color: '#FFFFFF'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#C9A24D';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#D4AF37';
                    }}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-[#D4AF37] transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-white absolute left-0 right-0 shadow-lg">
              <nav className="py-4 space-y-1">
                <Link 
                  to="/" 
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: isActiveRoute('/') ? 500 : 400,
                    fontSize: '18px',
                    lineHeight: '150%',
                    letterSpacing: '0%',
                    textDecoration: isActiveRoute('/') ? 'underline' : 'none',
                    color: isActiveRoute('/') ? '#D4AF37' : '#6B7280'
                  }}
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: isActiveRoute('/products') ? 500 : 400,
                    fontSize: '18px',
                    lineHeight: '150%',
                    letterSpacing: '0%',
                    textDecoration: isActiveRoute('/products') ? 'underline' : 'none',
                    color: isActiveRoute('/products') ? '#D4AF37' : '#6B7280'
                  }}
                  onClick={handleLinkClick}
                >
                  Shop
                </Link>
                
                {/* Mobile Categories */}
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categories</p>
                </div>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.category_id || category.slug}
                      to={`/products?category=${category.slug}`}
                      className="block px-6 py-2 text-sm text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 transition-colors"
                      onClick={handleLinkClick}
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-2 text-sm text-gray-400 italic">
                    No categories available
                  </div>
                )}
                
                {/* Mobile Cart and Wishlist */}
                <div className="border-t pt-2 mt-2">
                  <button
                    onClick={() => {
                      handleWishlistClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium">Wishlist</span>
                    {wishlistItemCount > 0 && (
                      <span className="bg-[#D4AF37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {wishlistItemCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleCartClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium">Cart</span>
                    {cartItemCount > 0 && (
                      <span className="bg-[#D4AF37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                </div>
                
                {/* Mobile Auth - CHANGED TO USE MODALS */}
                {isAuthenticated ? (
                  <div className="border-t pt-2 mt-2">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-600">Hello, {user?.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleProfileClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 transition-colors"
                    >
                      Profile
                    </button>
                    <Link
                      to="/orders"
                      className="block px-4 py-3 text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 transition-colors"
                      onClick={handleLinkClick}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="border-t pt-2 mt-2">
                    <button
                      onClick={() => {
                        handleLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '150%',
                        letterSpacing: '0%',
                        color: '#6B7280'
                      }}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        handleRegisterClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: '27px',
                        letterSpacing: '0px',
                        backgroundColor: '#D4AF37',
                        color: '#FFFFFF',
                        borderRadius: '4px',
                        margin: '8px 16px'
                      }}
                    >
                      Register
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
        
        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Overlay for dropdown */}
        {isDropdownOpen && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </header>

      {/* Auth Modal Manager */}
      <AuthModalManager
        isLoginOpen={isLoginModalOpen}
        isRegisterOpen={isRegisterModalOpen}
        onCloseLogin={handleCloseLogin}
        onCloseRegister={handleCloseRegister}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
      />
    </>
  );
};

export default Header;