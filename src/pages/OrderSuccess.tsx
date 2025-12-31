// pages/OrderSuccess.tsx - ENHANCED ORDER SUCCESS PAGE
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail, Phone, Clock, MapPin, AlertCircle, Download } from 'lucide-react';
import Button from '../components/common/Button';

interface LocationState {
  orderId?: string;
  orderTotal?: number;
}

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);
  
  // Get order details from navigation state
  const state = location.state as LocationState;
  const orderId = state?.orderId || `#ORD-${Date.now().toString().slice(-6)}`;
  const orderTotal = state?.orderTotal || 0;

  useEffect(() => {
    // Auto redirect countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price).replace('KES', 'Ksh.');
  };

  const handleStopCountdown = () => {
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-50 p-8 text-center border-b">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-green-700 text-lg">
            Thank you for your order. We've received your request and will process it shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="p-8">
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-secondary mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-grey">Order ID:</span>
                  <span className="font-medium text-primary">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey">Order Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey">Payment Status:</span>
                  <span className="font-medium text-yellow-600">Pending</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-grey">Total Amount:</span>
                  <span className="font-semibold text-lg text-primary">
                    {orderTotal > 0 ? formatPrice(orderTotal) : 'Calculating...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey">Estimated Delivery:</span>
                  <span className="font-medium">2-3 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey">Order Status:</span>
                  <span className="font-medium text-blue-600">Processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h3 className="font-semibold text-secondary mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary">Order Confirmation Email</h4>
                  <p className="text-sm text-grey mt-1">
                    Check your email for detailed order confirmation and tracking information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary">Order Processing</h4>
                  <p className="text-sm text-grey mt-1">
                    Our pharmacy team will verify and prepare your order for delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-secondary">Delivery</h4>
                  <p className="text-sm text-grey mt-1">
                    Your order will be delivered to your specified address within the estimated timeframe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                  <li>Keep your phone accessible for delivery coordination</li>
                  <li>Payment will be collected upon delivery (Cash/M-Pesa/Card)</li>
                  <li>Have any required prescriptions ready for verification</li>
                  <li>Someone should be available at the delivery address</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => {
                handleStopCountdown();
                navigate('/orders');
              }}
              className="w-full"
            >
              <Package className="w-4 h-4 mr-2" />
              Track Your Order
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  handleStopCountdown();
                  navigate('/products');
                }}
                className="w-full"
              >
                Continue Shopping
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  handleStopCountdown();
                  navigate('/');
                }}
                className="w-full"
              >
                Go to Homepage
              </Button>
            </div>
          </div>

          {/* Auto-redirect notice */}
          {countdown > 0 && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Redirecting to orders page in {countdown} seconds
                </span>
                <button
                  onClick={handleStopCountdown}
                  className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
                >
                  Stay here
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-gray-50 px-8 py-6 border-t">
          <div className="text-center">
            <p className="text-sm text-grey mb-3">Need help with your order?</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <a 
                href="tel:+254700000000" 
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Support</span>
              </a>
              <span className="text-grey">|</span>
              <a 
                href="mailto:support@healthx.co.ke" 
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email Support</span>
              </a>
            </div>
            
            {/* Business Hours */}
            <div className="mt-4 text-xs text-grey">
              <p>Support Hours: Monday - Friday 8:00 AM - 6:00 PM EAT</p>
              <p>Emergency Line: Available 24/7 for urgent medical inquiries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;