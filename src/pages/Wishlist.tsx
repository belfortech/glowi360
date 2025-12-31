// pages/Wishlist.tsx - UPDATED WITH LOCAL STORAGE SUPPORT
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist, useRemoveFromWishlist, useAddToCart, useProducts } from '../hooks/api';
import { parsePrice, parseRating } from '../types/api';
import { getLocalWishlist, removeFromLocalWishlist } from '../utils/localStorage';
import { useAppSelector } from '../store';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Toast from '../components/ui/Toast';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: wishlist, isLoading } = useWishlist();
  const { data: allProducts = [] } = useProducts(); // For guest wishlist product details
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();
  
  const [localWishlistProducts, setLocalWishlistProducts] = useState<any[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Load local wishlist products for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      const localWishlist = getLocalWishlist();
      if (localWishlist.length > 0 && allProducts.length > 0) {
        const wishlistProducts = localWishlist
          .map(item => allProducts.find(product => product.product_id === item.product_id))
          .filter(Boolean);
        setLocalWishlistProducts(wishlistProducts);
      } else {
        setLocalWishlistProducts([]);
      }
    }
  }, [isAuthenticated, allProducts]);

  const formatPrice = (price: string | number) => {
    const numericPrice = parsePrice(price);
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(numericPrice).replace('KES', 'Ksh.');
  };

  const renderStars = (rating: string | number) => {
    const numericRating = parseRating(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(numericRating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      if (isAuthenticated) {
        await removeFromWishlistMutation.mutateAsync(productId);
      } else {
        // Remove from local storage for guest users
        removeFromLocalWishlist(productId);
        // Update local state
        setLocalWishlistProducts(prev => 
          prev.filter(product => product.product_id !== productId)
        );
      }
      
      setToast({
        show: true,
        message: 'Product removed from wishlist',
        type: 'success'
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Failed to remove from wishlist',
        type: 'error'
      });
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCartMutation.mutateAsync({
        product_id: productId,
        quantity: 1
      });
      setToast({
        show: true,
        message: 'Product added to cart successfully!',
        type: 'success'
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Failed to add to cart',
        type: 'error'
      });
    }
  };

  const handleLoginPrompt = () => {
    setToast({
      show: true,
      message: 'Please login to sync your wishlist across devices',
      type: 'success'
    });
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  // FIXED: Proper image URL handling
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}${imageUrl}`;
  };

  // FIXED: Proper category name extraction
  const getCategoryName = (category: any) => {
    if (!category) return 'Uncategorized';
    
    // If category is a string, return it directly
    if (typeof category === 'string') {
      return category;
    }
    
    // If category is an object, extract the name property
    if (typeof category === 'object' && category.name) {
      return category.name;
    }
    
    // Fallback
    return 'Uncategorized';
  };

  // Determine which products to show
  const productsToShow = isAuthenticated 
    ? (wishlist?.products || [])
    : localWishlistProducts;

  const isLoadingData = isAuthenticated ? isLoading : (allProducts.length === 0);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (productsToShow.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Heart className="w-24 h-24 text-grey mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-secondary mb-2">Your wishlist is empty</h1>
            <p className="text-grey mb-6">Add some products to your wishlist to see them here</p>
            
            {/* Guest user prompt */}
            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-blue-800 text-sm mb-3">
                  <strong>Guest Mode:</strong> Your wishlist is saved locally. Login to sync across devices.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLoginPrompt}
                  className="mr-2"
                >
                  Login to Sync
                </Button>
              </div>
            )}
            
            <Button onClick={() => navigate('/products')}>Browse Products</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary">My Wishlist</h1>
            {!isAuthenticated && (
              <p className="text-sm text-grey mt-1">
                Guest mode - <button 
                  onClick={handleLoginPrompt}
                  className="text-primary hover:text-primary/80 underline"
                >
                  Login to sync
                </button>
              </p>
            )}
          </div>
          <p className="text-grey">{productsToShow.length} items</p>
        </div>

        {/* Guest user notification */}
        {!isAuthenticated && productsToShow.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-800 font-medium">Guest Mode</h3>
                <p className="text-blue-700 text-sm">
                  Your wishlist is saved locally. Login to sync across all your devices.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLoginPrompt}
              >
                Login to Sync
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsToShow.map((product: any) => {
            const productPrice = parsePrice(product.price);
            const originalPrice = product.discount_percentage 
              ? Math.round(productPrice / (1 - product.discount_percentage / 100))
              : null;
            
            return (
              <div key={product.product_id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                  {getImageUrl(product.image) ? (
                    <img
                      src={getImageUrl(product.image)!}
                      alt={product.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => navigate(`/products/${product.product_id}`)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div class="text-gray-500 text-center">
                              <div class="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded"></div>
                              <p class="text-sm">No Image</p>
                            </div>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded"></div>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                  
                  {product.discount_percentage && product.discount_percentage > 0 && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-black text-xs px-1.5 py-0.5 rounded">
                      -{product.discount_percentage}%
                    </div>
                  )}
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product.product_id)}
                    disabled={isAuthenticated && removeFromWishlistMutation.isPending}
                    className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 text-red-500 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(product.rating)}
                    <span className="text-xs text-grey ml-1">({product.reviews_count || 0})</span>
                  </div>
                  
                  {/* Product Name */}
                  <h3 
                    className="font-medium text-secondary mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-2"
                    onClick={() => navigate(`/products/${product.product_id}`)}
                  >
                    {product.name}
                  </h3>
                  
                  {/* Category - FIXED */}
                  <p className="text-sm text-grey mb-3">
                    {getCategoryName(product.category)}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-semibold text-secondary">
                      {formatPrice(productPrice)}
                    </span>
                    {originalPrice && (
                      <span className="text-sm text-grey line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(product.product_id)}
                      disabled={addToCartMutation.isPending}
                      className="flex-1 text-sm py-2"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/products/${product.product_id}`)}
                      className="px-3 py-2"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/products')}
            className="px-8"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Wishlist;