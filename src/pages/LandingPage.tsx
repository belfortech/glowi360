import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Globe,
  Headphones,
  ShieldCheck,
  CreditCard,
  Sparkles
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Color palette
  const colors = {
    black: '#0B0B0B',
    gold: '#C9A24D',
    goldLight: '#D4AF37',
    offWhite: '#F5F5F5',
    ivory: '#FAF7F2',
    charcoal: '#2B2B2B',
  };

  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      title: "Uncover the Skin You Love",
      subtitle: "Premium skincare solutions crafted for your unique beauty",
      image: "/beautiful.png",
      badge: {
        text: "Upto 15% Off",
        price: "From KShs. 981"
      },
      theme: 'dark' // dark background, light text
    },
    {
      id: 2,
      title: "Discover Premium Skincare",
      subtitle: "Transform your skin with our curated collection of luxury products",
      image: "/elsy-products.png",
      badge: {
        text: "Up to 20% Off",
        price: "From KShs. 1,200"
      },
      theme: 'light' // light background, dark text
    },
    {
      id: 3,
      title: "Consult Skincare Experts",
      subtitle: "Get personalized advice from certified skincare specialists",
      image: "/elsy.png",
      badge: {
        text: "Book Now",
        price: "Expert Advice"
      },
      theme: 'gold' // gold accent theme
    }
  ];

  // Features data
  const features = [
    {
      icon: Truck,
      title: "Express Delivery",
      description: "Same day delivery if ordered by 7 pm"
    },
    {
      icon: Globe,
      title: "Nationwide Delivery",
      description: "From a network of over 140+ stores"
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description: "Available 7 days a week"
    },
    {
      icon: ShieldCheck,
      title: "Genuine Products",
      description: "All our products are 100% genuine"
    },
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "Pay by Mpesa, Visa or MasterCard"
    }
  ];

  const categories = [
    'Skincare',
    'Haircare',
    'Makeup',
    'Fragrances',
    'Body Care',
    'Wellness',
    'Men\'s Care'
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const getSlideStyles = (theme: string) => {
    switch (theme) {
      case 'dark':
        return {
          bg: `linear-gradient(135deg, ${colors.black} 0%, ${colors.charcoal} 100%)`,
          text: colors.offWhite,
          subtext: '#9CA3AF',
          accent: colors.gold
        };
      case 'light':
        return {
          bg: `linear-gradient(135deg, ${colors.ivory} 0%, ${colors.offWhite} 100%)`,
          text: colors.black,
          subtext: '#4B5563',
          accent: colors.gold
        };
      case 'gold':
        return {
          bg: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
          text: colors.black,
          subtext: colors.charcoal,
          accent: colors.black
        };
      default:
        return {
          bg: colors.ivory,
          text: colors.black,
          subtext: '#4B5563',
          accent: colors.gold
        };
    }
  };

  const currentStyles = getSlideStyles(bannerSlides[currentSlide].theme);

  return (
    <div className="w-full" style={{ backgroundColor: colors.offWhite }}>
      {/* Hero Banner Carousel */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Banner Container */}
          <div className="relative w-full" style={{ height: '480px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
                style={{ background: currentStyles.bg }}
              >
                {/* Decorative Elements */}
                <div
                  className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
                  style={{ backgroundColor: colors.gold, transform: 'translate(30%, -30%)' }}
                />
                <div
                  className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl"
                  style={{ backgroundColor: colors.gold, transform: 'translate(-30%, 30%)' }}
                />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full h-full flex items-center z-10">
                  {/* Left Content */}
                  <div className="flex-1 z-10 pr-4 lg:pr-16">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                      style={{
                        backgroundColor: bannerSlides[currentSlide].theme === 'dark'
                          ? 'rgba(201, 162, 77, 0.2)'
                          : 'rgba(11, 11, 11, 0.1)',
                        border: `1px solid ${currentStyles.accent}40`
                      }}
                    >
                      <Sparkles className="w-4 h-4" style={{ color: currentStyles.accent }} />
                      <span className="text-sm font-medium" style={{ color: currentStyles.accent }}>
                        Premium Collection
                      </span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
                      style={{ color: currentStyles.text }}
                    >
                      {bannerSlides[currentSlide].title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-lg md:text-xl mb-8 max-w-md"
                      style={{ color: currentStyles.subtext }}
                    >
                      {bannerSlides[currentSlide].subtitle}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="flex flex-wrap gap-4"
                    >
                      <button
                        onClick={() => navigate('/products')}
                        className="group px-8 py-4 font-semibold rounded-full transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: currentStyles.accent,
                          color: bannerSlides[currentSlide].theme === 'gold' ? colors.offWhite : colors.black,
                          boxShadow: `0 4px 20px ${currentStyles.accent}40`
                        }}
                      >
                        <span className="flex items-center gap-2">
                          Shop Now
                          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </span>
                      </button>

                      <button
                        onClick={() => navigate('/skin-test')}
                        className="px-8 py-4 font-semibold rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: 'transparent',
                          color: currentStyles.text,
                          border: `2px solid ${currentStyles.text}30`
                        }}
                      >
                        Take Skin Test
                      </button>
                    </motion.div>
                  </div>

                  {/* Right Image */}
                  <div className="hidden lg:flex flex-1 justify-center items-center relative h-full">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                      className="relative"
                    >
                      <img
                        src={bannerSlides[currentSlide].image}
                        alt={bannerSlides[currentSlide].title}
                        className="max-h-[420px] w-auto object-contain drop-shadow-2xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/hero.jpg';
                        }}
                      />

                      {/* Floating Badge */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
                        className="absolute -top-2 -right-4 rounded-2xl p-4 shadow-xl"
                        style={{ backgroundColor: colors.offWhite }}
                      >
                        <p className="text-xs mb-1" style={{ color: colors.charcoal }}>
                          {bannerSlides[currentSlide].badge.price}
                        </p>
                        <p className="text-xl font-bold" style={{ color: colors.gold }}>
                          {bannerSlides[currentSlide].badge.text}
                        </p>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <ChevronLeft className="w-6 h-6" style={{ color: colors.charcoal }} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <ChevronRight className="w-6 h-6" style={{ color: colors.charcoal }} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="relative transition-all duration-300"
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-8' : 'w-2'
                    }`}
                    style={{
                      backgroundColor: index === currentSlide
                        ? colors.gold
                        : 'rgba(255, 255, 255, 0.5)'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div
          className="rounded-2xl p-6 lg:p-8"
          style={{
            backgroundColor: colors.ivory,
            border: `1px solid ${colors.gold}20`
          }}
        >
          {/* Desktop Features */}
          <div className="hidden lg:flex items-center justify-between">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${colors.gold}15`,
                    border: `2px solid ${colors.gold}`
                  }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: colors.gold }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: colors.black }}>
                    {feature.title}
                  </h3>
                  <p className="text-xs" style={{ color: '#6B7280' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-2" style={{ minWidth: 'max-content' }}>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 min-w-[200px]">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: `${colors.gold}15`,
                      border: `2px solid ${colors.gold}`
                    }}
                  >
                    <feature.icon className="w-5 h-5" style={{ color: colors.gold }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: colors.black }}>
                      {feature.title}
                    </h3>
                    <p className="text-xs" style={{ color: '#6B7280' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ backgroundColor: colors.black }}
        >
          {/* Decorative gradient */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `linear-gradient(90deg, ${colors.gold}20 0%, transparent 50%, ${colors.gold}20 100%)`
            }}
          />

          <div className="relative py-8 px-6 lg:px-10">
            {/* Desktop Categories */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: colors.gold }}
                />
                <span className="font-bold text-lg" style={{ color: colors.offWhite }}>
                  Shop Categories
                </span>
              </div>

              <div className="flex items-center gap-6">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => navigate(`/products?category=${category.toLowerCase().replace(/ /g, '-').replace(/'/g, '')}`)}
                    className="relative text-base font-medium transition-all duration-300 hover:scale-105 group"
                    style={{ color: colors.offWhite }}
                  >
                    {category}
                    <span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: colors.gold }}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: colors.gold,
                  color: colors.black
                }}
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="lg:hidden">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: colors.gold }}
                />
                <span className="font-bold" style={{ color: colors.offWhite }}>
                  Shop Categories
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => navigate(`/products?category=${category.toLowerCase().replace(/ /g, '-').replace(/'/g, '')}`)}
                    className="px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
                    style={{
                      backgroundColor: `${colors.gold}20`,
                      color: colors.offWhite,
                      border: `1px solid ${colors.gold}40`
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <button
                onClick={() => navigate('/products')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold"
                style={{
                  backgroundColor: colors.gold,
                  color: colors.black
                }}
              >
                View All Categories
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `
      }} />
    </div>
  );
};

export default LandingPage;
