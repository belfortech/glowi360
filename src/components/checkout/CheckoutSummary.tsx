// components/checkout/CheckoutSummary.tsx - IMPROVED WITH SINGLE LINE BUTTON
import React from 'react';
import { Package, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { CartItem, DeliveryOption } from '../../types/api';
import Button from '../common/Button';
import Loading from '../common/Loading';
import { getImageUrl } from '../../config/api';

interface CheckoutSummaryProps {
  cartItems: CartItem[];
  cartSubtotal: number;
  selectedDeliveryOptionData: DeliveryOption | undefined;
  deliveryFee: number;
  totalAmount: number;
  canPlaceOrder: boolean;
  isProcessingOrder: boolean;
  onPlaceOrder: () => void;
  onBackToCart: () => void;
  formatPrice: (price: number) => string;
  parsePrice: (price: any) => number;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  cartItems,
  cartSubtotal,
  selectedDeliveryOptionData,
  deliveryFee,
  totalAmount,
  canPlaceOrder,
  isProcessingOrder,
  onPlaceOrder,
  onBackToCart,
  formatPrice,
  parsePrice
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-secondary mb-4">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {cartItems.map((item: CartItem) => {
          const itemPrice = parsePrice(item.product.price);
          const itemTotal = itemPrice * item.quantity;
          
          return (
            <div key={item.cart_item_id} className="flex items-center gap-3 p-2 border border-gray-100 rounded">
              <img
                src={getImageUrl(item.product.image)}
                alt={item.product.name}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/50/50';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-secondary text-sm truncate">
                  {item.product.name}
                </h4>
                <p className="text-grey text-xs">
                  {formatPrice(itemPrice)} x {item.quantity}
                </p>
              </div>
              <span className="font-medium text-sm">
                {formatPrice(itemTotal)}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Totals */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-grey">Subtotal ({cartItems.length} items)</span>
          <span className="font-medium">{formatPrice(cartSubtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-grey">
            Delivery Fee
            {selectedDeliveryOptionData && (
              <span className="text-xs block">{selectedDeliveryOptionData.name}</span>
            )}
          </span>
          <span className="font-medium">
            {selectedDeliveryOptionData 
              ? formatPrice(selectedDeliveryOptionData.price) 
              : 'Select delivery option'
            }
          </span>
        </div>
      </div>
      
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between">
          <span className="text-lg font-semibold">Total Amount</span>
          <span className="text-lg font-semibold text-primary">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>
      
      {/* IMPROVED: Place Order Button with single line text and better responsive design */}
      <button
        onClick={onPlaceOrder}
        disabled={!canPlaceOrder || isProcessingOrder}
        className={`w-full mb-4 flex items-center justify-center gap-2 text-white font-medium rounded-lg transition-colors ${
          !canPlaceOrder || isProcessingOrder
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-[#D4AF37] hover:bg-[#d14925]'
        }`}
        style={{
          height: '60px',
          padding: '0 16px', // Reduced padding for better text fit
          borderRadius: '8px',
          fontSize: '14px', // Slightly smaller font for better fit
          opacity: !canPlaceOrder || isProcessingOrder ? 0.6 : 1
        }}
      >
        {isProcessingOrder ? (
          <div className="flex items-center gap-2">
            <Loading size="sm" className="w-4 h-4" />
            <span className="whitespace-nowrap">Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap text-sm">Place Order - {formatPrice(totalAmount)}</span>
          </div>
        )}
      </button>
      
      <Button 
        variant="outline" 
        onClick={onBackToCart}
        className="w-full"
        disabled={isProcessingOrder}
      >
        Back to Cart
      </Button>

      {/* Ready to order notice */}
      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-green-800 text-xs font-medium mb-1">Ready to Order</p>
            <p className="text-green-700 text-xs">
              All items are available and ready for delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;