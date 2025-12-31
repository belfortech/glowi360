// pages/Products.tsx - UPDATED FOR MULTI-SELECT FILTERS (ARRAYS)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductFilters from '../components/products/ProductFilters';
import SearchBar from '../components/common/SearchBar';
import BannerAd from '../components/common/BannerAd';
import Loading from '../components/common/Loading';
import ProductCard from '../components/products/ProductCard';
import { useProducts } from '../hooks/api';
import { parsePrice, parseRating } from '../types/api';
import { productMatchesBrand } from '../config/brands';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<{
    category?: string[];
    brand?: string[];
  }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Get ALL products from backend (no filtering parameters)
  const { data: allProducts = [], isLoading, error } = useProducts();

  useEffect(() => {
    // Initialize filters from URL params
    const category = searchParams.getAll('category');
    const brand = searchParams.getAll('brand');
    const search = searchParams.get('search');

    setFilters({
      ...(category.length > 0 ? { category } : {}),
      ...(brand.length > 0 ? { brand } : {}),
    });

    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Update URL params
      const newParams = new URLSearchParams(searchParams);
      if (query && query.trim()) {
        newParams.set('search', query.trim());
      } else {
        newParams.delete('search');
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handleFiltersChange = useCallback(
    (newFilters: { category?: string[]; brand?: string[] }) => {
      setFilters(newFilters);

      // Update URL params for multi-select
      const newParams = new URLSearchParams(searchParams);

      // Category - remove all, then add each
      newParams.delete('category');
      if (newFilters.category && newFilters.category.length) {
        newFilters.category.forEach((cat) => newParams.append('category', cat));
      }

      // Brand - remove all, then add each
      newParams.delete('brand');
      if (newFilters.brand && newFilters.brand.length) {
        newFilters.brand.forEach((b) => newParams.append('brand', b));
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // FRONTEND-ONLY FILTERING - UPDATED FOR MULTI-SELECT
  const filteredProducts = allProducts.filter((product) => {
    // 1. SEARCH FILTER (Frontend only)
    if (searchQuery && searchQuery.trim()) {
      const searchLower = searchQuery.trim().toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      if (!nameMatch) return false;
    }

    // 2. CATEGORY FILTER (multi-select)
    if (filters.category && filters.category.length > 0) {
      let categoryMatches = false;
      const productCategorySlugs: string[] = [];
      if (typeof product.category === 'string') {
        productCategorySlugs.push(
          product.category
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/&/g, '')
        );
      } else if (
        product.category &&
        typeof product.category === 'object' &&
        'slug' in product.category
      ) {
        productCategorySlugs.push((product.category as any).slug);
      }
      // Match if any selected category is in product's category slugs
      categoryMatches = filters.category.some((cat) =>
        productCategorySlugs.includes(cat)
      );
      if (!categoryMatches) return false;
    }

    // 3. BRAND FILTER (multi-select) - Uses shared brand config
    if (filters.brand && filters.brand.length > 0) {
      let brandMatches = false;
      const productWithBrand = product as any;

      for (const filterBrand of filters.brand) {
        // Method 1: Check brand_name field directly
        if (
          productWithBrand.brand_name &&
          productWithBrand.brand_name.toLowerCase() === filterBrand.toLowerCase()
        ) {
          brandMatches = true;
          break;
        }

        // Method 2: Use shared brand matching (keywords-based)
        if (productMatchesBrand(product.name, filterBrand)) {
          brandMatches = true;
          break;
        }

        // Method 3: Fallback - Extract brand from product name (first word)
        const extractedBrand = product.name.split(' ')[0];
        if (extractedBrand.toLowerCase() === filterBrand.toLowerCase()) {
          brandMatches = true;
          break;
        }
      }

      if (!brandMatches) return false;
    }

    return true;
  });

  // FRONTEND SORTING - OPTIMIZED WITH useMemo
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parsePrice(a.price) - parsePrice(b.price);
        case 'price-high':
          return parsePrice(b.price) - parsePrice(a.price);
        case 'rating':
          return parseRating(b.rating) - parseRating(a.rating);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [filteredProducts, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-secondary mb-4">
            Error Loading Products
          </h1>
          <p className="text-grey">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SearchBar onSearch={handleSearch} />

      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/5">
            <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} />
          </div>

          {/* Main Content Area */}
          <div className="lg:w-4/5">
            <div className="mb-8">
              <div className="w-full">
                <BannerAd />
              </div>
            </div>
            {/* Products Grid Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-grey">
                  Showing {sortedProducts.length} of {allProducts.length} products
                </p>
                {(filters.brand?.length ||
                  filters.category?.length ||
                  searchQuery) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {searchQuery && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Search: "{searchQuery}"
                      </span>
                    )}
                    {filters.category &&
                      filters.category.map((cat) => (
                        <span
                          key={cat}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                        >
                          Category: {cat}
                        </span>
                      ))}
                    {filters.brand &&
                      filters.brand.map((brand) => (
                        <span
                          key={brand}
                          className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                        >
                          Brand: {brand}
                        </span>
                      ))}
                  </div>
                )}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {sortedProducts.map((product) => (
                  <div key={product.product_id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-grey text-lg">
                  No products found matching your criteria.
                </p>
                <div className="mt-4 space-y-2">
                  {searchQuery && (
                    <p className="text-sm text-grey">
                      No products found for search term: "{searchQuery}"
                    </p>
                  )}
                  {filters.brand?.length && (
                    <p className="text-sm text-grey">
                      No products found for brands: {filters.brand.join(', ')}
                    </p>
                  )}
                  {filters.category?.length && (
                    <p className="text-sm text-grey">
                      No products found for categories: {filters.category.join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setFilters({});
                    setSearchQuery('');
                    setSearchParams({});
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;