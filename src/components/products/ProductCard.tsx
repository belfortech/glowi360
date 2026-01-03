// components/products/ProductCard.tsx - UPDATED WITH GUEST INDICATOR REMOVED
import React, { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { ProductListItem, parsePrice, parseRating } from '../../types/api';
import { useAddToCart } from '../../hooks/api';
import { useAppSelector } from '../../store';
import Toast from '../ui/Toast';
import { getImageUrl } from '../../config/api';

interface ProductCardProps {
  product: ProductListItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const addToCartMutation = useAddToCart();
  const [imageError, setImageError] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await addToCartMutation.mutateAsync({
        product_id: product.product_id,
        quantity: 1
      });
      
      if (isAuthenticated) {
        setToast({
          show: true,
          message: 'Product added to cart successfully!',
          type: 'success'
        });
      } else {
        setToast({
          show: true,
          message: 'Product added to cart! Login to sync across devices.',
          type: 'success'
        });
      }
    } catch (error: any) {
      console.error('Add to cart error:', error);
      setToast({
        show: true,
        message: error.response?.data?.error || 'Failed to add product to cart',
        type: 'error'
      });
    }
  };

  const renderStars = (rating: string | number) => {
    const numericRating = parseRating(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        style={{
          width: '9px',
          height: '9px',
        }}
        className={`${
          i < Math.floor(numericRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatPrice = (price: string | number): string => {
    const numericPrice = parsePrice(price);
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(numericPrice).replace('KES', 'Ksh.');
  };

  const handleCardClick = () => {
    window.location.href = `/products/${product.product_id}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div 
        className="bg-white hover:shadow-md transition-shadow cursor-pointer"
        style={{
          width: '220px',
          height: '320px',
        }}
        onClick={handleCardClick}
      >
        {/* Product Image Container */}
        <div 
          className="relative overflow-hidden flex items-center justify-center"
          style={{
            width: '220px',
            height: '220px',
            background: '#F5F5F5',
          }}
        >
          {/* FIXED: Proper image handling with fallback */}
          {!imageError && product.image ? (
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            /* Fallback placeholder when no image or error */
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded"></div>
                <p className="text-xs">No Image</p>
              </div>
            </div>
          )}
          
          {product.discount_percentage && product.discount_percentage > 0 && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-1 py-0.5 rounded">
              -{product.discount_percentage}%
            </div>
          )}

          {/* Guest mode indicator - REMOVED */}
        </div>

        {/* Product Info Container */}
        <div 
          className="p-2.5 flex flex-col justify-between"
          style={{
            width: '220px',
            height: '100px',
            top: '220px',
          }}
        >
          {/* Top Section: Rating and Product Name */}
          <div className="flex-1">
            {/* Rating Container */}
            <div 
              className="flex items-center mb-1"
              style={{
                width: '55px',
                height: '9px',
                gap: '2px',
              }}
            >
              {renderStars(product.rating)}
            </div>

            {/* Product Name */}
            <h3 
              style={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '11px',
                lineHeight: '15px',
                letterSpacing: '0.06px',
                color: '#0C0C0C',
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.name}
            </h3>
          </div>

          {/* Bottom Section: Price and Cart - Fixed at bottom */}
          <div className="flex items-center justify-between mt-1">
            {/* Price */}
            <span 
              style={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '24px',
                letterSpacing: '-0.4px',
                color: '#0C0C0C',
              }}
            >
              {formatPrice(product.price)}
            </span>
            
            {/* Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              className="flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 relative"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '14px',
                paddingTop: '2px',
                paddingRight: '5px',
                paddingBottom: '2px',
                paddingLeft: '5px',
                gap: '6px',
                background: '#D4AF37',
                border: 'none',
                cursor: 'pointer',
              }}
              title={isAuthenticated ? 'Add to cart' : 'Add to cart (Guest mode)'}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-white" />

              {/* Loading indicator */}
              {addToCartMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#D4AF37] rounded-full">
                  <div className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
};

export default ProductCard;