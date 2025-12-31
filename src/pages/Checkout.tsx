// pages/Checkout.tsx - IMPROVED LAYOUT WITH ADJUSTED WIDTHS
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertCircle } from 'lucide-react';
import { 
  useCheckoutSummary, 
  useCreateOrder
} from '../hooks/orderServiceApi';
import { DeliveryOption, CartItem } from '../types/api';
import Loading from '../components/common/Loading';
import Toast from '../components/ui/Toast';
import AddressManager from '../components/checkout/AddressManager';
import DeliveryOptions from '../components/checkout/DeliveryOptions';
import CheckoutSummary from '../components/checkout/CheckoutSummary';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: checkoutSummary, isLoading, error: checkoutError, refetch: refetchCheckout } = useCheckoutSummary();
  const createOrderMutation = useCreateOrder();
  
  const addresses = checkoutSummary?.addresses || [];
  const deliveryOptions = checkoutSummary?.delivery_options || [];
  const cart = checkoutSummary?.cart;
  const cartItems = cart?.items || [];
  
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'warning' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // FIXED: Proper numeric price parser
  const parsePrice = (price: any): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const cleanPrice = price.replace(/[^\d.-]/g, '');
      const parsed = parseFloat(cleanPrice);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'Ksh.');
  };

  // Calculate cart totals with proper numeric addition
  const cartSubtotal = cartItems.reduce((total: number, item: CartItem) => {
    const itemPrice = parsePrice(item.product.price);
    return total + (itemPrice * item.quantity);
  }, 0);

  const selectedDeliveryOptionData = deliveryOptions.find(
    option => option.delivery_option_id === selectedDeliveryOption
  );

  const deliveryFee = selectedDeliveryOptionData ? parsePrice(selectedDeliveryOptionData.price) : 0;
  const totalAmount = cartSubtotal + deliveryFee;

  const canPlaceOrder = Boolean(selectedAddress && selectedDeliveryOption && cartSubtotal > 0);

  // Console debugging only
  useEffect(() => {
    console.log('🔍 Checkout Debug:', {
      checkoutSummaryExists: !!checkoutSummary,
      addressesCount: addresses.length,
      deliveryOptionsCount: deliveryOptions.length,
      selectedAddress,
      selectedDeliveryOption,
      cartSubtotal: cartSubtotal,
      deliveryFee: deliveryFee,
      totalAmount: totalAmount,
      canPlaceOrder,
      cartItemsCount: cartItems.length
    });
  }, [checkoutSummary, addresses, deliveryOptions, selectedAddress, selectedDeliveryOption, cartSubtotal, deliveryFee, totalAmount, canPlaceOrder, cartItems]);

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.address_id);
      } else {
        setSelectedAddress(addresses[0].address_id);
      }
    }
  }, [addresses, selectedAddress]);

  // Auto-select cheapest delivery option
  useEffect(() => {
    if (deliveryOptions.length > 0 && !selectedDeliveryOption) {
      const cheapestOption = deliveryOptions.reduce((prev, current) => 
        parsePrice(prev.price) < parsePrice(current.price) ? prev : current
      );
      setSelectedDeliveryOption(cheapestOption.delivery_option_id);
    }
  }, [deliveryOptions, selectedDeliveryOption]);

  // Handle checkout error
  useEffect(() => {
    if (checkoutError) {
      setToast({
        show: true,
        message: 'Unable to load checkout. Please ensure your cart has items.',
        type: 'error'
      });
      setTimeout(() => navigate('/cart'), 3000);
    }
  }, [checkoutError, navigate]);

  const handlePlaceOrder = async (): Promise<void> => {
    if (!selectedAddress || !selectedDeliveryOption) {
      setToast({
        show: true,
        message: 'Please select address and delivery option',
        type: 'error'
      });
      return;
    }

    setIsProcessingOrder(true);

    try {
      const orderData = {
        address_id: selectedAddress,
        delivery_option_id: selectedDeliveryOption,
        special_instructions: specialInstructions.trim() || undefined
      };

      const order = await createOrderMutation.mutateAsync(orderData);
      
      setToast({
        show: true,
        message: 'Order placed successfully!',
        type: 'success'
      });
      
      setTimeout(() => {
        navigate('/order-success', { 
          state: { 
            orderId: order.order_id,
            orderTotal: totalAmount 
          } 
        });
      }, 1500);
    } catch (error: any) {
      setToast({
        show: true,
        message: error.response?.data?.detail || error.response?.data?.error || 'Failed to place order',
        type: 'error'
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleAddressAdded = () => {
    refetchCheckout();
    setToast({
      show: true,
      message: 'Address added successfully',
      type: 'success'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-grey">Loading checkout information...</p>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-grey mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-secondary mb-4">Your cart is empty</h1>
          <p className="text-grey mb-6">Add some items to your cart before proceeding to checkout.</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary">Secure Checkout</h1>
            <p className="text-grey mt-1">Review your order and complete your purchase</p>
          </div>
        </div>
        
        {/* UPDATED: Adjusted grid proportions - addresses smaller, summary larger */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Checkout Form - Now takes 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery Address */}
            <AddressManager
              addresses={addresses}
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
              onAddressAdded={handleAddressAdded}
            />

            {/* Delivery Options */}
            <DeliveryOptions
              deliveryOptions={deliveryOptions}
              selectedDeliveryOption={selectedDeliveryOption}
              onDeliveryOptionSelect={setSelectedDeliveryOption}
              formatPrice={formatPrice}
            />

            {/* Special Instructions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Special Instructions
              </h2>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special delivery instructions..."
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-grey mt-1">
                {specialInstructions.length}/500 characters
              </p>
            </div>

            {/* Prescription Notice */}
            {checkoutSummary?.prescription_required && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-yellow-800 mb-2">Prescription Required</h3>
                    <p className="text-yellow-700 text-sm">
                      This order contains prescription medications. You will need to provide a valid prescription 
                      during delivery or upload it after placing the order.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Now takes 2 columns (wider) */}
          <div className="lg:col-span-2">
            <CheckoutSummary
              cartItems={cartItems}
              cartSubtotal={cartSubtotal}
              selectedDeliveryOptionData={selectedDeliveryOptionData}
              deliveryFee={deliveryFee}
              totalAmount={totalAmount}
              canPlaceOrder={canPlaceOrder}
              isProcessingOrder={isProcessingOrder}
              onPlaceOrder={handlePlaceOrder}
              onBackToCart={() => navigate('/cart')}
              formatPrice={formatPrice}
              parsePrice={parsePrice}
            />
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
  );
};

export default Checkout;