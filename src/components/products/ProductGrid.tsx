// components/products/ProductGrid.tsx - UPDATED FOR 5 CARDS LAYOUT
import React from 'react';
import ProductCard from './ProductCard';
import { ProductListItem } from '../../types/api';
import TopProductsHeading from '../common/TopProductsHeading';

interface ProductGridProps {
  products: ProductListItem[];
  title?: string;
  showViewAll?: boolean;
  showCategories?: boolean;
  categories?: string[];
  onViewAll?: () => void;
  onCategorySelect?: (category: string) => void;
  gridType?: 'top-products' | 'best-selling' | 'default';
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  showViewAll = false,
  showCategories = false,
  categories = [],
  onViewAll,
  onCategorySelect,
  gridType = 'default'
}) => {
  // Don't render if no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-7 lg:px-4 mb-12">
      {/* Conditional Header Rendering */}
      {title && showCategories && categories.length > 0 ? (
        <div style={{ marginTop: '40px' }}>
          <TopProductsHeading
            title={title}
            categories={categories}
            onCategorySelect={onCategorySelect}
            onViewAll={onViewAll}
          />
        </div>
      ) : title && gridType === 'best-selling' ? (
        /* Best Selling Products Header */
        <div 
          className="flex items-center justify-between mb-10"
          style={{
            width: '100%',
            maxWidth: '1200px',
            height: '36px',
            margin: '40px auto 40px',
          }}
        >
          <h2 
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '30px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#0C0C0C',
              margin: 0,
            }}
          >
            {title}
          </h2>
          
          {showViewAll && (
            <button
              onClick={onViewAll}
              style={{
                fontFamily: 'Figtree',
                fontWeight: 500,
                fontSize: '17px',
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
          )}
        </div>
      ) : title ? (
        /* Default Header */
        <div className="flex items-center justify-between mb-7">
          <h2 className="font-inter font-semibold text-heading text-secondary">
            {title}
          </h2>
          {showViewAll && (
            <button
              onClick={onViewAll}
              className="text-primary hover:text-primary/80 font-medium"
            >
              View all
            </button>
          )}
        </div>
      ) : null}

      {/* Products Grid */}
      <div 
        className="flex items-center justify-between overflow-x-auto lg:overflow-visible"
        style={{
          width: '100%',
          maxWidth: '1200px',
          height: '320px',
          margin: '0 auto',
          gap: '12px',
        }}
      >
        {/* Desktop Grid - 5 Cards */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>

        {/* Mobile/Tablet Horizontal Scroll */}
        <div className="flex lg:hidden gap-3 w-full overflow-x-auto pb-3">
          {products.map((product) => (
            <div key={product.product_id} className="flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Second Row for 10 products total */}
      {products.length > 5 && (
        <div 
          className="hidden lg:flex items-center justify-between mt-7"
          style={{
            width: '100%',
            maxWidth: '1200px',
            height: '320px',
            margin: '30px auto 0',
            gap: '12px',
          }}
        >
          {products.slice(5, 10).map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;