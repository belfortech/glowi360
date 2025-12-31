// pages/Home.tsx - UPDATED FOR 10 PRODUCTS PER GRID (5 per row)
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import BannerAd from '../components/common/BannerAd';
import SaleCards from '../components/common/SaleCards';
import HealthXDifferent from '../components/common/HealthXDifferent';
import CustomerTestimonials from '../components/home/CustomerTestimonials';
import OurPartners from '../components/home/OurPartners';
import BookConsultation from '../components/home/BookConsultation';
import LandingPage from './LandingPage';
import { useFeaturedProducts, useProducts } from '../hooks/api';
import Loading from '../components/common/Loading';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // SEPARATE API CALL 1: Featured products for "Top Products" section
  const {
    data: featuredProducts,
    isLoading: featuredLoading,
    error: featuredError
  } = useFeaturedProducts();

  // SEPARATE API CALL 2: All products for "Best Selling Products" section
  const {
    data: allProducts,
    isLoading: allProductsLoading,
    error: allProductsError
  } = useProducts();

  const handleCategorySelect = (category: string) => {
    // For the homepage, we don't filter the grid by category
    // Instead, we navigate to the products page with the category filter
    const categorySlug = category.toLowerCase().replace(/ /g, '-').replace(/&/g, '');
    navigate(`/products?category=${categorySlug}`);
  };

  // Memoize to prevent unnecessary re-renders - Now showing 10 products per grid
  const topProducts = useMemo(() => {
    return Array.isArray(featuredProducts) ? featuredProducts.slice(0, 10) : [];
  }, [featuredProducts]);

  const bestSellingProducts = useMemo(() => {
    return Array.isArray(allProducts) ? allProducts.slice(0, 10) : [];
  }, [allProducts]);

  return (
    <div className="min-h-screen bg-white">
      {/* Landing Page Section */}
      <LandingPage />

      {/* Top Products Section - Uses Featured Products API */}
      <div className="py-8">
        {featuredLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading size="md" />
          </div>
        ) : featuredError ? (
          <div className="text-center py-12">
            <p className="text-grey">Unable to load featured products</p>
          </div>
        ) : topProducts.length > 0 ? (
          <ProductGrid
            products={topProducts}
            title="Top Products"
            showViewAll={true}
            showCategories={true}
            categories={['Pain Relief', 'OTC', 'Cold & Flu']}
            gridType="top-products"
            onViewAll={() => navigate('/products')}
            onCategorySelect={handleCategorySelect}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-grey">No featured products available</p>
          </div>
        )}
      </div>

      {/* Banner Ad Placement */}
      <BannerAd />

      {/* Best Selling Products Section - Uses All Products API */}
      <div className="py-8">
        {allProductsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading size="md" />
          </div>
        ) : allProductsError ? (
          <div className="text-center py-12">
            <p className="text-grey">Unable to load products</p>
          </div>
        ) : bestSellingProducts.length > 0 ? (
          <ProductGrid
            products={bestSellingProducts}
            title="Our Best Selling Products"
            showViewAll={true}
            gridType="best-selling"
            onViewAll={() => navigate('/products')}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-grey">No products available</p>
          </div>
        )}
      </div>

      {/* Other sections */}
      <SaleCards />

            {/* New Arrival Products Section - Uses All Products API */}
      <div className="py-8">
        {allProductsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loading size="md" />
          </div>
        ) : allProductsError ? (
          <div className="text-center py-12">
            <p className="text-grey">Unable to load products</p>
          </div>
        ) : bestSellingProducts.length > 0 ? (
          <ProductGrid
            products={bestSellingProducts}
            title="Our Best Selling Products"
            showViewAll={true}
            gridType="best-selling"
            onViewAll={() => navigate('/products')}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-grey">No products available</p>
          </div>
        )}
      </div>
      {/* <HealthXDifferent /> */}
      <CustomerTestimonials />
      <OurPartners />
      <BookConsultation />
    </div>
  );
};

export default Home;
