// components/products/TopProductsHeading.tsx
import React, { useState } from 'react';

interface TopProductsHeadingProps {
  title: string;
  categories: string[];
  onCategorySelect?: (category: string) => void;
  onViewAll?: () => void;
}

const TopProductsHeading: React.FC<TopProductsHeadingProps> = ({
  title,
  categories,
  onCategorySelect,
  onViewAll
}) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect?.(category);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-4 mb-12" style={{ marginTop: '48px' }}>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <div 
          className="flex items-center justify-between mb-12"
          style={{
            width: '100%',
            maxWidth: '1240px',
            height: '44px',
            margin: '0 auto 48px',
          }}
        >
          {/* Title */}
          <h2 
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '36px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#0C0C0C',
              margin: 0,
            }}
          >
            {title}
          </h2>

          {/* Categories and View All */}
          <div 
            className="flex items-center"
            style={{
              width: '388px',
              height: '26px',
              gap: '23px',
            }}
          >
            {/* Category Buttons */}
            <div className="flex items-center gap-6">
              {categories.map((category) => (
                <div key={category} className="flex flex-col items-center">
                  <button
                    onClick={() => handleCategoryClick(category)}
                    style={{
                      fontFamily: 'Figtree',
                      fontWeight: 500,
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#0C0C0C',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {category}
                  </button>
                  {/* Underline for selected category */}
                  {selectedCategory === category && (
                    <div 
                      style={{
                        width: '40px',
                        height: '0px',
                        borderWidth: '1.5px',
                        borderStyle: 'solid',
                        borderColor: '#C9A24D',
                        marginTop: '4px',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* View All Button */}
            <button
              onClick={onViewAll}
              style={{
                fontFamily: 'Figtree',
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#C9A24D',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              View all
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Version */}
      <div className="block lg:hidden">
        {/* Mobile Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#0C0C0C] mb-6">
          {title}
        </h2>
        
        {/* Mobile Categories - Horizontal Scroll */}
        <div className="mb-4">
          <div 
            className="flex gap-3 overflow-x-auto pb-2"
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedCategory === category 
                    ? 'bg-[#C9A24D] text-white'
                    : 'bg-gray-100 text-[#0C0C0C] hover:bg-gray-200'
                }`}
                style={{
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Mobile View All */}
        <button
          onClick={onViewAll}
          className="text-[#C9A24D] font-medium hover:text-[#C9A24D]/80 text-base"
        >
          View all
        </button>
      </div>
    </div>
  );
};

export default TopProductsHeading;