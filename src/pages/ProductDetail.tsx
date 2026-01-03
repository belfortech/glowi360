// pages/ProductDetail.tsx - FIXED VERSION WITH INLINE STYLES
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowLeft,
  Plus,
  Minus,
  Truck,
  Shield,
  Clock,
  Check,
  AlertCircle,
  Calendar,
  Package,
  Award,
  Info
} from 'lucide-react';
import { useProduct, useAddToCart, useAddToWishlist, useRemoveFromWishlist, useWishlist, useFeaturedProducts } from '../hooks/api';
import { parsePrice, parseRating } from '../types/api';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Toast from '../components/ui/Toast';
import ProductGrid from '../components/products/ProductGrid';
import { getImageUrl } from '../config/api';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specifications'>('description');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // API calls
  const { data: product, isLoading, error } = useProduct(id!);
  const { data: wishlist } = useWishlist();
  const { data: featuredProducts } = useFeaturedProducts();
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const isWishlisted = wishlist?.products?.some((p: { product_id: string | undefined; }) => p.product_id === product?.product_id) || false;

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCartMutation.mutateAsync({
        product_id: product.product_id,
        quantity
      });
      setToast({
        show: true,
        message: 'Product added to cart successfully!',
        type: 'success'
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Failed to add product to cart',
        type: 'error'
      });
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + change, product?.stock_quantity || 1)));
  };

  const toggleWishlist = async () => {
    if (!product) return;

    try {
      if (isWishlisted) {
        await removeFromWishlistMutation.mutateAsync(product.product_id);
        setToast({
          show: true,
          message: 'Product removed from wishlist',
          type: 'success'
        });
      } else {
        await addToWishlistMutation.mutateAsync(product.product_id);
        setToast({
          show: true,
          message: 'Product added to wishlist',
          type: 'success'
        });
      }
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Failed to update wishlist',
        type: 'error'
      });
    }
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'Ksh.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-secondary mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  const productImages = [
    getImageUrl(product.image),
    getImageUrl(product.image),
    getImageUrl(product.image)
  ];

  const productPrice = parsePrice(product.price);
  const originalPrice = product.discount_percentage 
    ? Math.round(productPrice / (1 - product.discount_percentage / 100))
    : null;

  const productRating = parseRating(product.rating);

  const getCategoryName = () => {
    if (typeof product.category === 'string') {
      return product.category;
    }
    return product.category.name;
  };

  // Featured products for bottom section - Show 5 products
  const displayFeaturedProducts = Array.isArray(featuredProducts) ? featuredProducts.slice(0, 5) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-grey hover:text-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <button
            onClick={handleGoToCart}
            className="flex items-center gap-2 text-grey hover:text-secondary transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-4">
        <div className="flex items-center gap-2 text-sm text-grey">
          <button onClick={() => navigate('/')} className="hover:text-primary">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-primary">Products</button>
          <span>/</span>
          <span className="text-secondary">{getCategoryName()}</span>
          <span>/</span>
          <span className="text-secondary">{product.name}</span>
        </div>
      </div>

      {/* Main Product Card */}
      <div className="max-w-7xl mx-auto px-4 lg:px-0 mb-12">
        <div 
          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          style={{
            width: '1243px',
            height: '685px',
            margin: '0 auto'
          }}
        >
          <div className="flex h-full" style={{ gap: '36px', padding: '36px' }}>
            {/* Product Images - Left Side */}
            <div className="flex-shrink-0" style={{ width: '400px' }}>
              <div className="space-y-4 h-full">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '350px' }}>
                  {!imageError && productImages[selectedImage] ? (
                    <img
                      src={productImages[selectedImage]!}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded"></div>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                  {product.discount_percentage && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-black text-sm px-3 py-1 rounded-full font-medium">
                      -{product.discount_percentage}% OFF
                    </div>
                  )}
                </div>
                
                {/* Image Thumbnails */}
                <div className="flex gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-gray-200'
                      } flex items-center justify-center bg-gray-100`}
                    >
                      {image ? (
                        <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-400 text-xs">No Image</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info - Right Side */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-secondary mb-2">{product.name}</h1>
                <div className="flex flex-wrap gap-4 mb-4">
                  <p className="text-grey">Category: {getCategoryName()}</p>
                  {product.brand_name && (
                    <p className="text-grey">Brand: {product.brand_name}</p>
                  )}
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(productRating)}
                  </div>
                  <span className="text-sm text-grey">
                    {productRating.toFixed(1)} ({product.reviews_count} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-secondary">
                    {formatPrice(productPrice)}
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-grey line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                  {product.discount_percentage && (
                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                      Save {product.discount_percentage}%
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  {product.stock_quantity && product.stock_quantity > 0 ? (
                    <>
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-medium">
                        In Stock ({product.stock_quantity} available)
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Prescription Required */}
                {product.is_prescription_required && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-800 text-sm font-medium">Prescription Required</p>
                        <p className="text-yellow-700 text-xs mt-1">
                          This medication requires a valid prescription from a licensed healthcare provider.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-secondary">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={product.stock_quantity ? quantity >= product.stock_quantity : false}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    onClick={handleAddToCart} 
                    className="flex-1 text-lg py-3 text-white bg-[#D4AF37] hover:bg-[#C9A24D] border-none"
                    disabled={addToCartMutation.isPending || !product.stock_quantity || product.stock_quantity === 0}
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                  </Button>

                  <button
                    onClick={toggleWishlist}
                    disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                    className={`px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 ${
                      isWishlisted ? 'text-red-500 border-red-200 bg-red-50' : 'text-grey'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-sm text-grey">Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm text-grey">Genuine Product</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm text-grey">Same Day Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Card */}
      <div className="max-w-7xl mx-auto px-4 lg:px-0 mb-12">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          {/* Product Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'specifications', label: 'Specifications' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-grey hover:text-secondary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'description' && (
              <div className="space-y-8">
                <div>
                  <p 
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 400,
                      fontSize: '20px',
                      lineHeight: '125%',
                      letterSpacing: '-0.41px',
                      color: '#6C7278'
                    }}
                  >
                    {product.description}
                  </p>
                </div>
                
                {product.generic_name && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Award className="w-6 h-6 text-blue-500" />
                      <h3 
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          fontSize: '24px',
                          lineHeight: '125%',
                          letterSpacing: '-0.41px',
                          color: '#0C0C0C'
                        }}
                      >
                        Generic Information
                      </h3>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p 
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: 400,
                          fontSize: '18px',
                          lineHeight: '125%',
                          letterSpacing: '-0.41px',
                          color: '#6C7278'
                        }}
                      >
                        Generic Name:
                      </p>
                      <p 
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          fontSize: '18px',
                          lineHeight: '125%',
                          letterSpacing: '-0.41px',
                          color: '#0C0C0C'
                        }}
                      >
                        {product.generic_name}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="w-6 h-6 text-green-500" />
                    <h3 
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        fontSize: '24px',
                        lineHeight: '125%',
                        letterSpacing: '-0.41px',
                        color: '#0C0C0C'
                      }}
                    >
                      How to Use
                    </h3>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    {[
                      'Take as directed by your doctor or pharmacist',
                      'Follow the prescribed dosage',
                      'Complete the full course of treatment',
                      'Do not exceed the recommended dose'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2 mb-2 last:mb-0">
                        <span 
                          style={{
                            color: '#D4AF37',
                            fontWeight: 'bold',
                            marginTop: '2px',
                            flexShrink: 0
                          }}
                        >
                          •
                        </span>
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#6C7278'
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                    <h3 
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        fontSize: '24px',
                        lineHeight: '125%',
                        letterSpacing: '-0.41px',
                        color: '#0C0C0C'
                      }}
                    >
                      Important Precautions
                    </h3>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
                    <p 
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '125%',
                        letterSpacing: '-0.41px',
                        color: '#6C7278'
                      }}
                    >
                      Consult your doctor if you experience any adverse effects. Keep out of reach of children.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      fontSize: '24px',
                      lineHeight: '125%',
                      letterSpacing: '-0.41px',
                      color: '#0C0C0C'
                    }}
                  >
                    Customer Reviews
                  </h3>
                  <Button variant="outline" size="sm">Write a Review</Button>
                </div>
                
                {product.reviews_count > 0 ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-base">
                            U{review}
                          </div>
                          <div className="flex-1">
                            <h4 
                              style={{
                                fontFamily: 'Inter',
                                fontWeight: 500,
                                fontSize: '20px',
                                lineHeight: '125%',
                                letterSpacing: '-0.41px',
                                color: '#0C0C0C'
                              }}
                            >
                              User {review}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex gap-0.5">{renderStars(5)}</div>
                              <span 
                                style={{
                                  fontFamily: 'Inter',
                                  fontWeight: 400,
                                  fontSize: '16px',
                                  lineHeight: '125%',
                                  letterSpacing: '-0.41px',
                                  color: '#6C7278'
                                }}
                              >
                                {review} days ago
                              </span>
                            </div>
                          </div>
                        </div>
                        <p 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#6C7278'
                          }}
                        >
                          Excellent product! Very effective and fast delivery. Highly recommended.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-200">
                            Verified Purchase
                          </span>
                          <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-200">
                            Helpful Review
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <p 
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '125%',
                        letterSpacing: '-0.41px',
                        color: '#6C7278'
                      }}
                    >
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Details Section */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-6 h-6 text-blue-500" />
                    <h3 
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        fontSize: '24px',
                        lineHeight: '125%',
                        letterSpacing: '-0.41px',
                        color: '#0C0C0C'
                      }}
                    >
                      Product Details
                    </h3>
                  </div>
                  
                  <div className="space-y-1">
                    {product.brand_name && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#6C7278'
                          }}
                        >
                          Brand
                        </span>
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#0C0C0C'
                          }}
                        >
                          {product.brand_name}
                        </span>
                      </div>
                    )}
                    {product.generic_name && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#6C7278'
                          }}
                        >
                          Generic Name
                        </span>
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#0C0C0C'
                          }}
                        >
                          {product.generic_name}
                        </span>
                      </div>
                    )}
                    {product.manufacture && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#6C7278'
                          }}
                        >
                          Manufacturer
                        </span>
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#0C0C0C'
                          }}
                        >
                          {product.manufacture}
                        </span>
                      </div>
                    )}
                    {product.batch_number && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#6C7278'
                          }}
                        >
                          Batch Number
                        </span>
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#0C0C0C'
                          }}
                        >
                          {product.batch_number}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span 
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: 400,
                          fontSize: '18px',
                          lineHeight: '125%',
                          letterSpacing: '-0.41px',
                          color: '#6C7278'
                        }}
                      >
                        Stock Available
                      </span>
                      <span 
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          fontSize: '18px',
                          lineHeight: '125%',
                          letterSpacing: '-0.41px',
                          color: (product.stock_quantity || 0) > 10 ? '#059669' : '#EA580C'
                        }}
                      >
                        {product.stock_quantity || 0} units
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Dates & Safety Section */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-6 h-6 text-green-500" />
                    <h3 
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        fontSize: '24px',
                        lineHeight: '125%',
                        letterSpacing: '-0.41px',
                        color: '#0C0C0C'
                      }}
                    >
                      Dates & Safety
                    </h3>
                  </div>
                  
                  <div className="space-y-1">
                    {product.manufacturing_date && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#6C7278'
                          }}
                        >
                          Manufacturing Date
                        </span>
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#0C0C0C'
                          }}
                        >
                          {formatDate(product.manufacturing_date)}
                        </span>
                      </div>
                    )}
                    {product.expiry_date && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#6C7278'
                          }}
                        >
                          Expiry Date
                        </span>
                        <span 
                          style={{
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            fontSize: '18px',
                            lineHeight: '125%',
                            letterSpacing: '-0.41px',
                            color: '#0C0C0C'
                          }}
                        >
                          {formatDate(product.expiry_date)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span 
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: 400,
                          fontSize: '18px',
                          lineHeight: '125%',
                          letterSpacing: '-0.41px',
                          color: '#6C7278'
                        }}
                      >
                        Prescription Required
                      </span>
                      <span 
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          fontSize: '18px',
                          lineHeight: '125%',
                          letterSpacing: '-0.41px',
                          color: product.is_prescription_required ? '#DC2626' : '#059669'
                        }}
                      >
                        {product.is_prescription_required ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Storage Instructions - Full Width */}
                <div className="md:col-span-2">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-6 h-6 text-purple-500" />
                      <h3 
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          fontSize: '24px',
                          lineHeight: '125%',
                          letterSpacing: '-0.41px',
                          color: '#0C0C0C'
                        }}
                      >
                        Storage Instructions
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: '🌡️', text: 'Store in a cool, dry place' },
                        { icon: '☀️', text: 'Keep away from direct sunlight' },
                        { icon: '👶', text: 'Keep out of reach of children' },
                        { icon: '📅', text: 'Do not use after expiry date' }
                      ].map((instruction, index) => (
                        <div key={index} className="bg-sky-50 border border-sky-200 rounded-lg p-4 flex items-center gap-3 hover:bg-sky-100 hover:-translate-y-0.5 transition-all duration-200">
                          <span className="text-2xl">{instruction.icon}</span>
                          <span 
                            style={{
                              fontFamily: 'Inter',
                              fontWeight: 400,
                              fontSize: '20px',
                              lineHeight: '125%',
                              letterSpacing: '-0.41px',
                              color: '#6C7278'
                            }}
                          >
                            {instruction.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      {displayFeaturedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 lg:px-0 mb-12">
          <ProductGrid
            products={displayFeaturedProducts}
            title="Our Best Selling Products"
            showViewAll={true}
            gridType="best-selling"
            onViewAll={() => navigate('/products')}
          />
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default ProductDetail;