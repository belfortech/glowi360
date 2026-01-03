// pages/Cart.tsx - UPDATED WITH MODAL INTEGRATION AND DESIGN CHANGES
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveFromCart, useProducts } from '../hooks/api';
import { useAppSelector } from '../store';
import { parsePrice } from '../types/api';
import { getLocalCart, updateLocalCartItem, removeFromLocalCart, getLocalCartCount, clearLocalCart } from '../utils/localStorage';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Toast from '../components/ui/Toast';
import AuthModalManager from '../components/auth/AuthModalManager';
import { getImageUrl } from '../config/api';

interface LocalCartItemWithProduct {
  cart_item_id: string;
  product_id: string;
  quantity: number;
  product: any;
  total_price: number;
}

interface StockValidation {
  isValid: boolean;
  message?: string;
  availableStock?: number;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: cart, isLoading, refetch: refetchCart } = useCart();
  const { data: allProducts = [] } = useProducts(); // For guest cart product details
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();
  
  const [localCartItems, setLocalCartItems] = useState<LocalCartItemWithProduct[]>([]);
  const [localCartTotal, setLocalCartTotal] = useState(0);
  const [stockValidations, setStockValidations] = useState<Record<string, StockValidation>>({});
  const [isValidatingStock, setIsValidatingStock] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Enhanced price parsing function (MOVED UP BEFORE calculateCartTotals)
  const safeParsePrice = (price: any): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      // Remove any currency symbols and parse
      const cleanPrice = price.replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleanPrice);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Calculate totals for authenticated users (since backend doesn't provide total_price)
  const calculateCartTotals = (cartData: any) => {
    if (!cartData?.items) return { total: 0, itemCount: 0 };
    
    let total = 0;
    let itemCount = 0;
    
    cartData.items.forEach((item: any) => {
      const price = safeParsePrice(item.product?.price || 0);
      const quantity = item.quantity || 0;
      total += price * quantity;
      itemCount += quantity;
    });
    
    return { total, itemCount };
  };

  // Determine what to show with proper calculations
  const cartTotals = isAuthenticated && cart ? calculateCartTotals(cart) : { total: localCartTotal, itemCount: getLocalCartCount() };
  const cartItems = isAuthenticated ? (cart?.items || []) : localCartItems;
  const cartTotal = isAuthenticated ? cartTotals.total : localCartTotal;
  const cartItemCount = isAuthenticated ? cartTotals.itemCount : getLocalCartCount();
  const isLoadingData = isAuthenticated ? isLoading : (allProducts.length === 0);

  // Debug logging for authenticated users (CONSOLE ONLY)
  useEffect(() => {
    if (isAuthenticated && cart) {
      console.log('🔍 Backend Cart Debug:', {
        fullCart: cart,
        cartItems: cart.items,
        cartTotalPrice: cart.total_price,
        cartTotalItems: cart.total_items,
        firstItem: cart.items?.[0],
        firstItemProduct: cart.items?.[0]?.product,
        firstItemPrice: cart.items?.[0]?.product?.price,
        firstItemTotalPrice: cart.items?.[0]?.total_price
      });
    }
  }, [isAuthenticated, cart]);

  // Load local cart items for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      const localCart = getLocalCart();
      if (localCart.length > 0 && allProducts.length > 0) {
        const cartItemsWithProducts = localCart
          .map(item => {
            const product = allProducts.find(p => p.product_id === item.product_id);
            if (product) {
              const productPrice = safeParsePrice(product.price);
              const itemTotal = productPrice * item.quantity;
              console.log('Product price calculation:', {
                productName: product.name,
                rawPrice: product.price,
                parsedPrice: productPrice,
                quantity: item.quantity,
                itemTotal: itemTotal
              });
              
              return {
                cart_item_id: item.product_id,
                product_id: item.product_id,
                quantity: item.quantity,
                product: product,
                total_price: itemTotal
              };
            }
            return null;
          })
          .filter(Boolean) as LocalCartItemWithProduct[];
        
        setLocalCartItems(cartItemsWithProducts);
        
        // Calculate total
        const total = cartItemsWithProducts.reduce((sum, item) => sum + item.total_price, 0);
        console.log('Local cart total calculation:', {
          items: cartItemsWithProducts.length,
          itemTotals: cartItemsWithProducts.map(item => item.total_price),
          finalTotal: total
        });
        setLocalCartTotal(total);
      } else {
        setLocalCartItems([]);
        setLocalCartTotal(0);
      }
    }
  }, [isAuthenticated, allProducts]);

  // Stock validation for cart items (NOW cartItems is defined)
  useEffect(() => {
    const validateStock = () => {
      const validations: Record<string, StockValidation> = {};
      
      cartItems.forEach(item => {
        const product = item.product;
        const stockQuantity = product.stock_quantity || 0;
        
        if (stockQuantity === 0) {
          validations[item.cart_item_id] = {
            isValid: false,
            message: 'Out of stock',
            availableStock: 0
          };
        } else if (item.quantity > stockQuantity) {
          validations[item.cart_item_id] = {
            isValid: false,
            message: `Only ${stockQuantity} in stock`,
            availableStock: stockQuantity
          };
        } else {
          validations[item.cart_item_id] = {
            isValid: true,
            availableStock: stockQuantity
          };
        }
      });
      
      setStockValidations(validations);
    };

    if (cartItems.length > 0) {
      validateStock();
    }
  }, [cartItems]);

  const hasStockIssues = Object.values(stockValidations).some(v => !v.isValid);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'Ksh.');
  };

  const validateCartForCheckout = (): { isValid: boolean; message?: string } => {
    if (cartItems.length === 0) {
      return { isValid: false, message: 'Your cart is empty' };
    }

    const invalidItems = Object.entries(stockValidations).filter(([_, validation]) => !validation.isValid);
    
    if (invalidItems.length > 0) {
      return { 
        isValid: false, 
        message: 'Some items in your cart are out of stock or exceed available quantity' 
      };
    }

    return { isValid: true };
  };

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      if (isAuthenticated) {
        await updateCartItemMutation.mutateAsync({ itemId, quantity: newQuantity });
        setToast({
          show: true,
          message: 'Cart updated successfully',
          type: 'success'
        });
        
        // Refetch cart to get updated data
        refetchCart();
      } else {
        // Update local storage for guest users
        updateLocalCartItem(itemId, newQuantity);
        
        // Update local state and recalculate total
        setLocalCartItems(prev => {
          const updated = prev.map(item => {
            if (item.product_id === itemId) {
              const productPrice = safeParsePrice(item.product.price);
              const newTotalPrice = productPrice * newQuantity;
              
              console.log('Quantity update calculation:', {
                productId: itemId,
                productName: item.product.name,
                rawPrice: item.product.price,
                parsedPrice: productPrice,
                newQuantity: newQuantity,
                newTotalPrice: newTotalPrice
              });
              
              return {
                ...item,
                quantity: newQuantity,
                total_price: newTotalPrice
              };
            }
            return item;
          }).filter(item => item.quantity > 0);
          
          // Recalculate total immediately
          const total = updated.reduce((sum, item) => sum + item.total_price, 0);
          console.log('Cart total after quantity update:', {
            updatedItems: updated.length,
            itemTotals: updated.map(item => ({ name: item.product.name, total: item.total_price })),
            newCartTotal: total
          });
          setLocalCartTotal(total);
          
          return updated;
        });
        
        setToast({
          show: true,
          message: 'Cart updated successfully',
          type: 'success'
        });
      }
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Failed to update cart',
        type: 'error'
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      if (isAuthenticated) {
        await removeFromCartMutation.mutateAsync(itemId);
        setToast({
          show: true,
          message: 'Item removed from cart',
          type: 'success'
        });
      } else {
        // Remove from local storage for guest users
        removeFromLocalCart(itemId);
        
        // Update local state and recalculate total
        setLocalCartItems(prev => {
          const updated = prev.filter(item => item.product_id !== itemId);
          const total = updated.reduce((sum, item) => sum + item.total_price, 0);
          setLocalCartTotal(total);
          return updated;
        });
        
        setToast({
          show: true,
          message: 'Item removed from cart',
          type: 'success'
        });
      }
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.error || 'Failed to remove item',
        type: 'error'
      });
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      setToast({
        show: true,
        message: 'Please login to proceed to checkout',
        type: 'warning'
      });
      // Open login modal instead of navigation
      setIsLoginModalOpen(true);
      return;
    }

    // Validate cart before proceeding
    const validation = validateCartForCheckout();
    if (!validation.isValid) {
      setToast({
        show: true,
        message: validation.message || 'Cannot proceed to checkout',
        type: 'error'
      });
      return;
    }

    navigate('/checkout');
  };

  const handleLoginPrompt = () => {
    setToast({
      show: true,
      message: 'Login to sync your cart and access all features',
      type: 'success'
    });
    // Open login modal instead of navigation
    setIsLoginModalOpen(true);
  };

  const clearCart = () => {
    if (isAuthenticated) {
      // For authenticated users, remove all items
      cartItems.forEach(item => {
        removeFromCartMutation.mutate(item.cart_item_id);
      });
    } else {
      // For guest users, clear local storage
      clearLocalCart();
      setLocalCartItems([]);
      setLocalCartTotal(0);
    }
    
    setToast({
      show: true,
      message: 'Cart cleared successfully',
      type: 'success'
    });
  };

  // Modal handlers
  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseRegister = () => {
    setIsRegisterModalOpen(false);
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setIsRegisterModalOpen(true);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <ShoppingBag className="w-24 h-24 text-grey mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-secondary mb-2">Your cart is empty</h1>
              <p className="text-grey mb-6">Add some products to get started</p>
              
              {/* Guest user prompt */}
              {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-blue-800 text-sm mb-3">
                    <strong>Guest Mode:</strong> Your cart is saved locally. Login to sync across devices.
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
              
              <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
            </div>
          </div>
        </div>

        {/* Auth Modal Manager */}
        <AuthModalManager
          isLoginOpen={isLoginModalOpen}
          isRegisterOpen={isRegisterModalOpen}
          onCloseLogin={handleCloseLogin}
          onCloseRegister={handleCloseRegister}
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
        />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-secondary">Shopping Cart</h1>
              {!isAuthenticated && (
                <p className="text-sm text-grey mt-1">
                  Guest mode - <button 
                    onClick={handleLoginPrompt}
                    className="text-[#D4AF37] hover:text-[#D4AF37]/80 underline"
                  >
                    Login to sync
                  </button>
                </p>
              )}
            </div>
            
            {/* Clear Cart Button */}
            {cartItems.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
              >
                Clear Cart
              </Button>
            )}
          </div>

          {/* Stock Issues Warning */}
          {hasStockIssues && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="text-red-800 font-medium">Stock Issues Detected</h3>
                  <p className="text-red-700 text-sm">
                    Some items in your cart are out of stock or exceed available quantities. 
                    Please review and update your cart before checkout.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Guest user notification */}
          {!isAuthenticated && cartItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-blue-800 font-medium">Guest Mode</h3>
                  <p className="text-blue-700 text-sm">
                    Your cart is saved locally. Login to sync across all your devices and checkout.
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const productPrice = safeParsePrice(item.product.price);
                const itemTotal = productPrice * item.quantity; // Calculate item total
                const originalPrice = item.product.discount_percentage 
                  ? Math.round(productPrice / (1 - item.product.discount_percentage / 100))
                  : null;
                
                const stockValidation = stockValidations[item.cart_item_id];
                const hasStockIssue = stockValidation && !stockValidation.isValid;
                
                // Debug logging (CONSOLE ONLY)
                console.log('Rendering cart item:', {
                  name: item.product.name,
                  rawPrice: item.product.price,
                  parsedPrice: productPrice,
                  quantity: item.quantity,
                  backendItemTotal: item.total_price,
                  calculatedItemTotal: itemTotal
                });
                
                return (
                  <div key={item.cart_item_id} className={`bg-white rounded-lg shadow-sm p-6 ${hasStockIssue ? 'border-l-4 border-red-400' : ''}`}>
                    {/* Stock Warning */}
                    {hasStockIssue && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <span className="text-red-800 text-sm font-medium">
                            {stockValidation.message}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <img
                        src={getImageUrl(item.product.image)}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-lg object-cover cursor-pointer"
                        onClick={() => navigate(`/products/${item.product.product_id || (item as any).product_id}`)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/80/80';
                        }}
                      />
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-secondary mb-1 cursor-pointer hover:text-[#D4AF37]"
                          onClick={() => navigate(`/products/${item.product.product_id || (item as any).product_id}`)}
                        >
                          {item.product.name}
                        </h3>
                        <p className="text-grey text-sm mb-2">
                          Category: {typeof item.product.category === 'string' 
                            ? item.product.category 
                            : item.product.category?.name || 'Unknown'
                          }
                        </p>
                        
                        {/* Stock Info */}
                        {stockValidation && (
                          <p className={`text-xs mb-2 ${stockValidation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {stockValidation.isValid 
                              ? `${stockValidation.availableStock} in stock` 
                              : stockValidation.message
                            }
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-3">
                          <span className="font-semibold text-[#D4AF37]">
                            {formatPrice(productPrice)}
                          </span>
                          {originalPrice && (
                            <span className="text-sm text-grey line-through">
                              {formatPrice(originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityUpdate(
                              isAuthenticated ? item.cart_item_id : (item as LocalCartItemWithProduct).product_id,
                              item.quantity - 1
                            )}
                            disabled={item.quantity <= 1 || (isAuthenticated && updateCartItemMutation.isPending)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityUpdate(
                              isAuthenticated ? item.cart_item_id : (item as LocalCartItemWithProduct).product_id,
                              item.quantity + 1
                            )}
                            disabled={
                              hasStockIssue ||
                              (stockValidation?.availableStock !== undefined && item.quantity >= stockValidation.availableStock) || 
                              (isAuthenticated && updateCartItemMutation.isPending)
                            }
                            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(
                            isAuthenticated ? item.cart_item_id : (item as LocalCartItemWithProduct).product_id
                          )}
                          disabled={isAuthenticated && removeFromCartMutation.isPending}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="flex justify-end mt-4 pt-4 border-t">
                      <span className="font-semibold text-secondary">
                        Subtotal: {formatPrice(itemTotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-secondary mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-grey">Items ({cartItemCount})</span>
                    <span className="font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-grey">Delivery</span>
                    <span className="font-medium">
                      {isAuthenticated ? 'Calculated at checkout' : 'Login required'}
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold text-[#D4AF37]">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>
                
                {/* Updated Proceed to Checkout Button with custom styling */}
                <button
                  onClick={handleProceedToCheckout}
                  disabled={cartItems.length === 0 || hasStockIssues || isValidatingStock}
                  className={`w-full mb-4 text-white font-medium rounded-lg transition-colors flex items-center justify-center whitespace-nowrap ${
                    hasStockIssues 
                      ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#D4AF37] hover:bg-[#D4AF37]/90'
                  }`}
                  style={{
                    width: '365px',
                    height: '60px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    maxWidth: '100%',
                    minWidth: 'fit-content'
                  }}
                >
                  {isValidatingStock ? (
                    <>
                      <Loading size="sm" className="w-4 h-4 mr-2" />
                      <span>Validating Stock...</span>
                    </>
                  ) : hasStockIssues ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>Fix Stock Issues</span>
                    </>
                  ) : isAuthenticated ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Proceed to Checkout</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>Login to Checkout</span>
                    </>
                  )}
                </button>
                
                {/* Updated Continue Shopping Button with primary color styling */}
                <button
                  onClick={() => navigate('/products')}
                  className="w-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-medium rounded-lg transition-colors whitespace-nowrap flex items-center justify-center"
                  style={{
                    width: '365px',
                    height: '60px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    maxWidth: '100%',
                    minWidth: 'fit-content'
                  }}
                >
                  Continue Shopping
                </button>

                {/* Stock issues notice */}
                {hasStockIssues && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-800 text-xs font-medium mb-1">Stock Issues</p>
                        <p className="text-red-700 text-xs">
                          Please update quantities or remove out-of-stock items before checkout.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Guest checkout notice */}
                {!isAuthenticated && cartItems.length > 0 && !hasStockIssues && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-800 text-xs font-medium mb-1">Authentication Required</p>
                        <p className="text-yellow-700 text-xs">
                          Login to proceed with secure checkout, delivery, and order tracking.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cart persistence info for guests */}
                {!isAuthenticated && cartItems.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-green-800 text-xs font-medium mb-1">Cart Saved</p>
                        <p className="text-green-700 text-xs">
                          Your items are safely stored and will be synced when you login.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>

      {/* Auth Modal Manager */}
      <AuthModalManager
        isLoginOpen={isLoginModalOpen}
        isRegisterOpen={isRegisterModalOpen}
        onCloseLogin={handleCloseLogin}
        onCloseRegister={handleCloseRegister}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
      />
    </>
  );
};

export default Cart;