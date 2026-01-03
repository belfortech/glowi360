// components/layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Package,
  LogOut,
  MapPin,
  Phone,
  Upload,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useCartCount, useWishlistCount } from '../../hooks/api';
import Button from '../common/Button';
import AuthModalManager from '../auth/AuthModalManager';
import PrescriptionUploadModal from '../prescription/PrescriptionUploadModal';

// Brand colors
const colors = {
  black: '#0B0B0B',
  gold: '#C9A24D',
  goldLight: '#D4AF37',
  offWhite: '#F5F5F5',
  ivory: '#FAF7F2',
  charcoal: '#2B2B2B',
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const cartItemsCount = useCartCount();
  const wishlistCount = useWishlistCount();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  // Typing animation for promo text
  const promoText = "Free Delivery For orders above ";
  const [displayedText, setDisplayedText] = useState('');
  const [showPrice, setShowPrice] = useState(false);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < promoText.length) {
        setDisplayedText(promoText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setShowPrice(true);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleRegisterClick = () => setIsRegisterModalOpen(true);
  const handlePrescriptionClick = () => setIsPrescriptionModalOpen(true);

  return (
    <>
      <nav className="sticky top-0 z-50">
        {/* Top Bar */}
        <div style={{ backgroundColor: colors.black }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 text-sm">
              {/* Left - Promo */}
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Sparkles className="w-4 h-4" style={{ color: colors.gold }} />
                <span
                  style={{ color: colors.offWhite }}
                  className="text-xs sm:text-sm"
                >
                  {displayedText}
                  {showPrice && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ color: colors.gold }}
                      className="font-semibold"
                    >
                      KSh 2,500
                    </motion.span>
                  )}
                  {!showPrice && (
                    <span
                      className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
                      style={{ backgroundColor: colors.gold }}
                    />
                  )}
                </span>
              </motion.div>

              {/* Right - Secondary Links */}
              <div className="hidden lg:flex items-center gap-1 text-xs">
                {['About Us', 'Health Conditions', 'Blog', 'FAQ', 'Contact'].map((item, i) => (
                  <React.Fragment key={item}>
                    {i > 0 && (
                      <span style={{ color: colors.charcoal }} className="mx-2">|</span>
                    )}
                    <Link
                      to={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="transition-colors duration-200 hover:opacity-80"
                      style={{ color: '#9CA3AF' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = colors.gold)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                    >
                      {item}
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div style={{ backgroundColor: colors.ivory }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 gap-4">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <img
                  src="/GC360 Marginless.png"
                  alt="Glowcare360 Logo"
                  className="w-[200px] h-auto transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                <div className="flex flex-col hidden">
                  <span className="text-2xl font-bold" style={{ color: colors.charcoal }}>
                    <span className="font-serif italic">Glowcare</span>
                    <span style={{ color: colors.gold }}>360</span>
                  </span>
                  <span className="text-xs" style={{ color: '#6B7280' }}>
                    Your Trusted Beauty Partner
                  </span>
                </div>
              </Link>

              {/* Search Bar - Desktop */}
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-6">
                <div className="flex w-full relative">
                  <input
                    type="text"
                    placeholder="Search for products, brands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-5 py-3 rounded-l-full focus:outline-none transition-all duration-300"
                    style={{
                      backgroundColor: colors.offWhite,
                      border: `2px solid ${colors.gold}30`,
                      color: colors.charcoal,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = colors.gold)}
                    onBlur={(e) => (e.target.style.borderColor = `${colors.gold}30`)}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-r-full font-semibold transition-all duration-300 hover:opacity-90"
                    style={{
                      backgroundColor: colors.gold,
                      color: colors.black,
                    }}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Upload Prescription Button */}
              <button
                onClick={handlePrescriptionClick}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: colors.black,
                  color: colors.offWhite,
                  boxShadow: `0 4px 15px ${colors.black}30`,
                }}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Prescription</span>
              </button>

              {/* Right Actions */}
              <div className="flex items-center gap-3 lg:gap-4">
                {/* WhatsApp - Desktop */}
                <a
                  href="tel:+254714016010"
                  className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: `${colors.gold}10`,
                    border: `1px solid ${colors.gold}30`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span style={{ color: '#25D366', fontSize: '10px' }}>
                      WhatsApp Us
                    </span>
                    <span className="text-xs font-bold" style={{ color: colors.charcoal }}>
                      +254 714 016010
                    </span>
                  </div>
                </a>

                {/* Account & Cart */}
                {isAuthenticated ? (
                  <>
                    {/* User Menu */}
                    <div className="relative hidden md:block">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-300"
                        style={{
                          backgroundColor: isUserMenuOpen ? `${colors.gold}15` : 'transparent',
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${colors.gold}20`,
                            border: `2px solid ${colors.gold}`,
                          }}
                        >
                          <User className="w-4 h-4" style={{ color: colors.gold }} />
                        </div>
                        <div className="hidden lg:flex flex-col items-start">
                          <span style={{ color: '#6B7280', fontSize: '10px' }}>
                            Hello, {user?.name?.split(' ')[0]}
                          </span>
                          <span className="text-xs font-semibold" style={{ color: colors.charcoal }}>
                            Account
                          </span>
                        </div>
                      </button>

                      {isUserMenuOpen && (
                        <div
                          className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                          style={{
                            backgroundColor: colors.offWhite,
                            border: `1px solid ${colors.gold}20`,
                          }}
                        >
                          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${colors.gold}20` }}>
                            <p className="font-semibold" style={{ color: colors.charcoal }}>
                              {user?.name}
                            </p>
                            <p className="text-xs" style={{ color: '#6B7280' }}>
                              {user?.email}
                            </p>
                          </div>
                          {[
                            { icon: User, label: 'Profile', path: '/profile' },
                            { icon: Package, label: 'Orders', path: '/orders' },
                            { icon: Heart, label: 'Wishlist', path: '/wishlist', badge: wishlistCount },
                          ].map((item) => (
                            <Link
                              key={item.label}
                              to={item.path}
                              className="flex items-center justify-between px-4 py-3 transition-colors"
                              style={{ color: colors.charcoal }}
                              onClick={() => setIsUserMenuOpen(false)}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${colors.gold}10`)}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <span className="flex items-center gap-3">
                                <item.icon className="w-4 h-4" style={{ color: colors.gold }} />
                                {item.label}
                              </span>
                              {item.badge ? (
                                <span
                                  className="text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                  style={{ backgroundColor: colors.gold, color: colors.black }}
                                >
                                  {item.badge}
                                </span>
                              ) : null}
                            </Link>
                          ))}
                          <div style={{ borderTop: `1px solid ${colors.gold}20` }}>
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-3 transition-colors"
                              style={{ color: '#EF4444' }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cart */}
                    <Link
                      to="/cart"
                      className="relative flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-all duration-300"
                      style={{ backgroundColor: `${colors.gold}10` }}
                    >
                      <div className="relative">
                        <ShoppingCart className="w-5 h-5" style={{ color: colors.charcoal }} />
                        {cartItemsCount > 0 && (
                          <span
                            className="absolute -top-1.5 -right-1.5 font-bold rounded-full w-4 h-4 flex items-center justify-center"
                            style={{ backgroundColor: colors.gold, color: colors.black, fontSize: '10px' }}
                          >
                            {cartItemsCount}
                          </span>
                        )}
                      </div>
                      <span className="hidden lg:block text-xs font-semibold" style={{ color: colors.charcoal }}>
                        Cart
                      </span>
                    </Link>
                  </>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <button
                      onClick={handleLoginClick}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300"
                      style={{
                        backgroundColor: 'transparent',
                        color: colors.charcoal,
                        border: `2px solid ${colors.charcoal}`,
                      }}
                    >
                      <User className="w-4 h-4" />
                      Login
                    </button>
                    <Link
                      to="/cart"
                      className="relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: colors.gold,
                        color: colors.black,
                      }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="font-semibold text-sm">Cart</span>
                      {cartItemsCount > 0 && (
                        <span
                          className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                          style={{ backgroundColor: colors.black, color: colors.offWhite }}
                        >
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: isMenuOpen ? colors.gold : `${colors.gold}10`,
                    color: isMenuOpen ? colors.black : colors.charcoal,
                  }}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="md:hidden pb-4">
              <div className="flex w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-l-full focus:outline-none"
                  style={{
                    backgroundColor: colors.offWhite,
                    border: `2px solid ${colors.gold}30`,
                    color: colors.charcoal,
                  }}
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-r-full"
                  style={{ backgroundColor: colors.gold, color: colors.black }}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Navigation - Desktop */}
        <div
          className="hidden md:block shadow-sm"
          style={{ backgroundColor: colors.offWhite, borderTop: `1px solid ${colors.gold}15` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center gap-6">
                {[
                  { label: 'Shop By Category', path: '/products', highlight: true },
                  { label: 'Shop By Brand', path: '/products?filter=brand' },
                  { label: 'Sale & Offers', path: '/products?sale=true' },
                  { label: 'Skin Test', path: '/skin-test' },
                  { label: 'Health Services', path: '/health-services' },
                  { label: 'Makeup Consultants', path: '/makeup-consultants' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="relative text-sm font-medium transition-colors duration-300 group"
                    style={{ color: item.highlight ? colors.charcoal : '#6B7280' }}
                  >
                    {item.label}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: colors.gold }}
                    />
                  </Link>
                ))}
              </div>

              <Link
                to="/store-locator"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${colors.gold}15`,
                  color: colors.gold,
                  border: `1px solid ${colors.gold}40`,
                }}
              >
                <MapPin className="w-4 h-4" />
                Store Locator
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden shadow-2xl"
            style={{ backgroundColor: colors.offWhite }}
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="space-y-2">
                {/* Main Navigation */}
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Shop By Category', path: '/products' },
                  { label: 'Shop By Brand', path: '/products?filter=brand' },
                  { label: 'Sale & Offers', path: '/products?sale=true' },
                  { label: 'Skin Test', path: '/skin-test' },
                  { label: 'Health Services', path: '/health-services' },
                  { label: 'Makeup Consultants', path: '/makeup-consultants' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="flex items-center justify-between py-3 px-4 rounded-xl transition-colors"
                    style={{ color: colors.charcoal }}
                    onClick={() => setIsMenuOpen(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${colors.gold}10`)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4" style={{ color: colors.gold }} />
                  </Link>
                ))}

                {/* Upload Prescription */}
                <button
                  onClick={() => {
                    handlePrescriptionClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold transition-all"
                  style={{
                    backgroundColor: colors.gold,
                    color: colors.black,
                  }}
                >
                  <Upload className="w-5 h-5" />
                  Upload Prescription
                </button>

                <div className="my-4" style={{ borderTop: `1px solid ${colors.gold}20` }} />

                {/* Auth Section */}
                {isAuthenticated ? (
                  <>
                    {[
                      { icon: ShoppingCart, label: `Cart (${cartItemsCount})`, path: '/cart' },
                      { icon: Package, label: 'Orders', path: '/orders' },
                      { icon: Heart, label: 'Wishlist', path: '/wishlist', badge: wishlistCount },
                      { icon: User, label: 'Profile', path: '/profile' },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        className="flex items-center justify-between py-3 px-4 rounded-xl transition-colors"
                        style={{ color: colors.charcoal }}
                        onClick={() => setIsMenuOpen(false)}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${colors.gold}10`)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" style={{ color: colors.gold }} />
                          {item.label}
                        </span>
                        {item.badge ? (
                          <span
                            className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                            style={{ backgroundColor: colors.gold, color: colors.black }}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4" style={{ color: colors.gold }} />
                        )}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full py-3 px-4 rounded-xl transition-colors"
                      style={{ color: '#EF4444' }}
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => {
                        handleLoginClick();
                        setIsMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <button
                      className="flex-1 rounded-xl py-2 px-4 font-semibold transition-all duration-300 hover:opacity-90"
                      style={{ backgroundColor: colors.gold, color: colors.black }}
                      onClick={() => {
                        handleRegisterClick();
                        setIsMenuOpen(false);
                      }}
                    >
                      Register
                    </button>
                  </div>
                )}

                {/* WhatsApp */}
                <a
                  href="tel:+254714016010"
                  className="flex items-center gap-3 mt-4 py-3 px-4 rounded-xl"
                  style={{
                    backgroundColor: '#25D36610',
                    border: '1px solid #25D36630',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xs block" style={{ color: '#25D366' }}>
                      WhatsApp Us
                    </span>
                    <span className="font-bold" style={{ color: colors.charcoal }}>
                      +254 714 016010
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Click outside to close user menu */}
        {isUserMenuOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
        )}
      </nav>

      {/* Auth Modal Manager */}
      <AuthModalManager
        isLoginOpen={isLoginModalOpen}
        isRegisterOpen={isRegisterModalOpen}
        onCloseLogin={() => setIsLoginModalOpen(false)}
        onCloseRegister={() => setIsRegisterModalOpen(false)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
      />

      {/* Prescription Upload Modal */}
      <PrescriptionUploadModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
