// components/common/BannerAd.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Star } from 'lucide-react';

interface BannerAdProps {
  className?: string;
}

const BannerAd: React.FC<BannerAdProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState(0);

  // Color palette
  const colors = {
    black: '#0B0B0B',
    gold: '#C9A24D',
    goldLight: '#D4AF37',
    goldBright: '#E5C158',
    offWhite: '#F5F5F5',
    ivory: '#FAF7F2',
    charcoal: '#2B2B2B',
  };

  // Featured products/offers
  const offers = [
    {
      id: 1,
      title: "Luxury Fragrances",
      subtitle: "THE SIGNATURE COLLECTION",
      description: "Discover scents that define you",
      discount: "Up to 30% Off",
      image: "/09140_12.png",
      category: "fragrance",
      accentColor: colors.gold
    },
    {
      id: 2,
      title: "Premium Skincare",
      subtitle: "GLOW ESSENTIALS",
      description: "Transform your skincare routine",
      discount: "Buy 2 Get 1 Free",
      image: "/09140_12.png",
      category: "skincare",
      accentColor: colors.goldLight
    },
    {
      id: 3,
      title: "Beauty Must-Haves",
      subtitle: "NEW ARRIVALS",
      description: "Curated selection of trending products",
      discount: "Starting at KSh 999",
      image: "/09140_12.png",
      category: "makeup",
      accentColor: colors.goldBright
    }
  ];

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProduct((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [offers.length]);

  const currentOffer = offers[currentProduct];

  return (
    <section className={`w-full max-w-7xl mx-auto px-4 lg:px-4 mb-8 ${className}`}>
      {/* Desktop Version */}
      <div
        className="hidden lg:block relative overflow-hidden"
        style={{
          borderRadius: '24px',
          background: `linear-gradient(135deg, ${colors.black} 0%, ${colors.charcoal} 100%)`,
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top left glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.gold}40 0%, transparent 70%)`,
              filter: 'blur(40px)',
            }}
          />
          {/* Bottom right glow */}
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.goldLight}30 0%, transparent 70%)`,
              filter: 'blur(60px)',
            }}
          />
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: colors.gold,
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative flex items-center h-[320px] px-12">
          {/* Left Content */}
          <div className="flex-1 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gold}20 0%, ${colors.goldLight}10 100%)`,
                    border: `1px solid ${colors.gold}40`,
                  }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: colors.gold }} />
                  <span className="text-sm font-semibold" style={{ color: colors.gold }}>
                    {currentOffer.subtitle}
                  </span>
                </motion.div>

                {/* Title */}
                <h2
                  className="text-5xl font-black mb-3 leading-tight"
                  style={{
                    background: `linear-gradient(135deg, ${colors.offWhite} 0%, ${colors.ivory} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {currentOffer.title}
                </h2>

                {/* Description */}
                <p
                  className="text-lg mb-4 max-w-md"
                  style={{ color: '#9CA3AF' }}
                >
                  {currentOffer.description}
                </p>

                {/* Discount Badge */}
                <div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                    boxShadow: `0 4px 20px ${colors.gold}40`,
                  }}
                >
                  <Star className="w-4 h-4" style={{ color: colors.black }} />
                  <span className="font-bold" style={{ color: colors.black }}>
                    {currentOffer.discount}
                  </span>
                </div>

                {/* CTA Button */}
                <div>
                  <button
                    onClick={() => navigate(`/products?category=${currentOffer.category}`)}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
                    style={{
                      background: colors.offWhite,
                      color: colors.black,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    Shop Now
                    <ArrowRight
                      className="w-5 h-5 transition-transform group-hover:translate-x-1"
                      style={{ color: colors.gold }}
                    />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right - Product Display */}
          <div className="flex-1 flex justify-center items-center relative h-full">
            {/* Glowing Ring */}
            <div
              className="absolute w-72 h-72 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, ${colors.gold}00, ${colors.gold}60, ${colors.goldLight}60, ${colors.gold}00)`,
                animation: 'spin 8s linear infinite',
              }}
            />
            <div
              className="absolute w-64 h-64 rounded-full"
              style={{ backgroundColor: colors.charcoal }}
            />

            {/* Product Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct}
                initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10"
              >
                <div className="w-56 h-64 flex items-center justify-center">
                  <img
                    src={currentOffer.image}
                    alt={currentOffer.title}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 20px 40px rgba(201, 162, 77, 0.3))',
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentOffer.title)}&background=2B2B2B&color=C9A24D&size=200&font-size=0.33&bold=true`;
                    }}
                  />
                </div>

                {/* Floating Price Tag */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="absolute -top-2 -right-4 px-4 py-2 rounded-xl"
                  style={{
                    background: colors.ivory,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <span className="text-xs font-medium" style={{ color: colors.charcoal }}>
                    Limited Time
                  </span>
                  <p className="text-lg font-black" style={{ color: colors.gold }}>
                    SALE
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Decorative Elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-80 h-80"
              style={{
                border: `1px dashed ${colors.gold}30`,
                borderRadius: '50%',
              }}
            />
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-6 left-12 flex items-center gap-3">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentProduct(index)}
              className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
              style={{
                width: index === currentProduct ? '48px' : '16px',
                backgroundColor: `${colors.gold}30`,
              }}
            >
              {index === currentProduct && (
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: colors.gold }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Slide Counter */}
        <div
          className="absolute bottom-6 right-12 flex items-center gap-2"
          style={{ color: colors.offWhite }}
        >
          <span className="text-2xl font-bold" style={{ color: colors.gold }}>
            0{currentProduct + 1}
          </span>
          <span className="text-sm opacity-50">/</span>
          <span className="text-sm opacity-50">0{offers.length}</span>
        </div>
      </div>

      {/* Mobile Version */}
      <div
        className="block lg:hidden relative overflow-hidden"
        style={{
          borderRadius: '20px',
          background: `linear-gradient(135deg, ${colors.black} 0%, ${colors.charcoal} 100%)`,
        }}
      >
        {/* Background Glow */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle, ${colors.gold}40 0%, transparent 70%)`,
            filter: 'blur(30px)',
            transform: 'translate(30%, -30%)',
          }}
        />

        <div className="relative p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
                style={{
                  background: `${colors.gold}20`,
                  border: `1px solid ${colors.gold}40`,
                }}
              >
                <Sparkles className="w-3 h-3" style={{ color: colors.gold }} />
                <span className="text-xs font-semibold" style={{ color: colors.gold }}>
                  {currentOffer.subtitle}
                </span>
              </div>

              {/* Title */}
              <h2
                className="text-2xl font-black mb-2"
                style={{ color: colors.offWhite }}
              >
                {currentOffer.title}
              </h2>

              {/* Description */}
              <p className="text-sm mb-3" style={{ color: '#9CA3AF' }}>
                {currentOffer.description}
              </p>

              {/* Product Image */}
              <div className="relative my-4">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${colors.gold}20 0%, transparent 70%)`,
                    transform: 'scale(1.5)',
                  }}
                />
                <motion.img
                  key={currentProduct}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  src={currentOffer.image}
                  alt={currentOffer.title}
                  className="w-28 h-32 object-contain relative z-10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentOffer.title)}&background=2B2B2B&color=C9A24D&size=120&font-size=0.33&bold=true`;
                  }}
                />
              </div>

              {/* Discount */}
              <div
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-4"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
                }}
              >
                <Star className="w-3 h-3" style={{ color: colors.black }} />
                <span className="text-sm font-bold" style={{ color: colors.black }}>
                  {currentOffer.discount}
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate(`/products?category=${currentOffer.category}`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm"
                style={{
                  background: colors.offWhite,
                  color: colors.black,
                }}
              >
                Shop Now
                <ArrowRight className="w-4 h-4" style={{ color: colors.gold }} />
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentProduct(index)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: index === currentProduct ? '24px' : '8px',
                  backgroundColor: index === currentProduct ? colors.gold : `${colors.gold}40`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe animation for spinning ring */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </section>
  );
};

export default BannerAd;
