// components/products/ProductFilters.tsx - MULTI-SELECT FILTERS (CATEGORY & BRAND) WITH CHECKBOXES
import React, { useMemo } from 'react';
import { useCategories, useProducts } from '../../hooks/api';
import { brands as configuredBrands, getBrandNames } from '../../config/brands';

interface ProductFiltersProps {
  filters: {
    category?: string[]; // Now an array for multi-select
    brand?: string[];    // Now an array for multi-select
  };
  onFiltersChange: (filters: {
    category?: string[];
    brand?: string[];
  }) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  // Fetch categories from backend /categories/ endpoint
  const { data: categoriesData = [], isLoading: categoriesLoading } = useCategories();
  
  // Fetch all products to extract unique brands
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();

  // Handle multi-select for categories
  const handleCategoryChange = (categorySlug: string) => {
    let newCategories = filters.category ? [...filters.category] : [];
    if (newCategories.includes(categorySlug)) {
      newCategories = newCategories.filter(c => c !== categorySlug);
    } else {
      newCategories.push(categorySlug);
    }
    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  // Handle multi-select for brands
  const handleBrandChange = (brand: string) => {
    let newBrands = filters.brand ? [...filters.brand] : [];
    if (newBrands.includes(brand)) {
      newBrands = newBrands.filter(b => b !== brand);
    } else {
      newBrands.push(brand);
    }
    onFiltersChange({
      ...filters,
      brand: newBrands.length > 0 ? newBrands : undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  // Transform backend categories to the format we need
  const categories = useMemo(() => {
    return categoriesData.map(category => ({
      name: category.name,
      slug: category.slug
    }));
  }, [categoriesData]);

  // Combine configured brands with dynamically discovered brands from products
  const brands = useMemo(() => {
    const brandSet = new Set<string>();

    // Add all configured brands first (these are our "official" brands)
    getBrandNames().forEach(brand => brandSet.add(brand));

    // Also add brands discovered from products
    allProducts.forEach(product => {
      const productWithBrand = product as any;
      if (productWithBrand.brand_name && productWithBrand.brand_name.trim()) {
        brandSet.add(productWithBrand.brand_name.trim());
      }
    });

    return Array.from(brandSet).sort();
  }, [allProducts]);

  // Show loading state if data is still loading
  if (categoriesLoading || productsLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-primary hover:text-primary/80 text-sm"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filters Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-black">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-primary hover:text-primary/80 text-sm"
        >
          Clear All
        </button>
      </div>

      {/* Categories Section - Always show if not loading */}
      {!categoriesLoading && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-medium text-black">Categories</h4>
            <svg 
              className="w-4 h-4 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Dynamic Category Checkboxes */}
          {categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((category) => (
                <label key={category.slug} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.category?.includes(category.slug) ?? false}
                    onChange={() => handleCategoryChange(category.slug)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              No categories available
            </div>
          )}
        </div>
      )}

      {/* Brands Section - Always show if not loading */}
      {!productsLoading && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-medium text-black">Brands</h4>
            <svg 
              className="w-4 h-4 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Dynamic Brand Checkboxes */}
          {brands.length > 0 ? (
            <div className="space-y-3">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.brand?.includes(brand) ?? false}
                    onChange={() => handleBrandChange(brand)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              No brands available
            </div>
          )}
        </div>
      )}

      {/* Consult a Doctor Button */}
      <div className="mt-8">
        <button
          onClick={() => {
            window.open('/consult', '_blank');
          }}
          className="w-full text-white px-4 py-3 rounded-lg transition-colors font-medium text-sm"
          style={{
            backgroundColor: '#C9A24D',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#B8923E';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#C9A24D';
          }}
        >
          Consult a Doctor
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;