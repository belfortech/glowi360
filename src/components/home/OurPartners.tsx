// components/home/OurPartners.tsx
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { brands, Brand } from '../../config/brands';

const OurPartners: React.FC = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Use first 8 brands for the homepage carousel
  const displayBrands = brands.slice(0, 8);

  const handleBrandClick = (brand: Brand) => {
    navigate(`/products?brand=${encodeURIComponent(brand.name)}`);
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section
      className="w-full py-16 lg:py-20"
      style={{ backgroundColor: '#F5F5F5' }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10">
          <div>
            <span
              className="inline-block text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: '#C9A24D' }}
            >
              Trusted Partners
            </span>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-3"
              style={{ color: '#0B0B0B' }}
            >
              Global Brands To Love
            </h2>
            <p
              className="text-base lg:text-lg"
              style={{ color: '#6B7280' }}
            >
              World-Famous Faves, All In One Place.
            </p>
          </div>

          {/* Desktop View All Link */}
          <button
            onClick={() => navigate('/products?filter=brand')}
            className="hidden lg:inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group"
            style={{ color: '#0B0B0B' }}
          >
            View All Brands
            <ArrowRight
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: '#C9A24D' }}
            />
          </button>
        </div>

        {/* Brands Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 -ml-2 lg:-ml-6"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E5E7EB'
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: '#0B0B0B' }} />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 scroll-smooth px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => handleBrandClick(brand)}
                className="flex-shrink-0 w-[220px] cursor-pointer group"
              >
                {/* Card Container */}
                <div
                  className="rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-2"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(201, 162, 77, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  {/* Product Image Circle */}
                  <div className="relative w-[160px] h-[160px] mx-auto mb-5">
                    <div
                      className="absolute inset-0 rounded-full transition-all duration-300"
                      style={{
                        background: 'linear-gradient(145deg, #FAFAFA 0%, #EFEFEF 100%)',
                      }}
                    />
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(145deg, rgba(201, 162, 77, 0.1) 0%, rgba(201, 162, 77, 0.05) 100%)',
                      }}
                    />
                    <div className="absolute inset-3 rounded-full overflow-hidden flex items-center justify-center">
                      <img
                        src={brand.productImage}
                        alt={`${brand.name} products`}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brand.name)}&background=f5f5f5&color=C9A24D&size=160&font-size=0.33&bold=true`;
                        }}
                      />
                    </div>
                  </div>

                  {/* Brand Info */}
                  <div className="text-center">
                    {/* Brand Logo/Name */}
                    <div className="h-8 flex items-center justify-center mb-2">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-h-full max-w-[100px] object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                      <span
                        className="text-base font-bold hidden"
                        style={{ display: 'none', color: '#0B0B0B' }}
                      >
                        {brand.name}
                      </span>
                    </div>

                    {/* Tagline */}
                    <p
                      className="text-xs font-medium leading-relaxed mb-2"
                      style={{ color: '#6B7280' }}
                    >
                      {brand.tagline}
                    </p>

                    {/* Discount Badge */}
                    {brand.discount && (
                      <span
                        className="inline-block text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: 'rgba(201, 162, 77, 0.1)',
                          color: '#C9A24D'
                        }}
                      >
                        {brand.discount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 -mr-2 lg:-mr-6"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E5E7EB'
              }}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#0B0B0B' }} />
            </button>
          )}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-8 lg:hidden">
          <button
            onClick={() => navigate('/products?filter=brand')}
            className="inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-full transition-all duration-300"
            style={{
              backgroundColor: '#0B0B0B',
              color: '#FFFFFF',
            }}
          >
            Shop All Brands
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Accent Line */}
        <div className="flex items-center justify-center mt-12 gap-2">
          <div className="h-px w-16 bg-gray-300" />
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#C9A24D' }}
          />
          <div className="h-px w-16 bg-gray-300" />
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
    </section>
  );
};

export default OurPartners;
