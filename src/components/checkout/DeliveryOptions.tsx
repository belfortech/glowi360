// components/checkout/DeliveryOptions.tsx - CLEANED UP VERSION
import React from 'react';
import { Truck, Clock, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { DeliveryOption } from '../../types/api';

interface DeliveryOptionsProps {
  deliveryOptions: DeliveryOption[];
  selectedDeliveryOption: string;
  onDeliveryOptionSelect: (optionId: string) => void;
  formatPrice: (price: number) => string;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  deliveryOptions,
  selectedDeliveryOption,
  onDeliveryOptionSelect,
  formatPrice
}) => {
  const selectedOption = deliveryOptions.find(opt => opt.delivery_option_id === selectedDeliveryOption);

  const handleDeliveryChange = (optionId: string) => {
    console.log('Delivery option selected:', optionId);
    onDeliveryOptionSelect(optionId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5" />
        Delivery Options
        {deliveryOptions.length === 0 && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
      </h2>
      
      {deliveryOptions.length > 0 ? (
        <div className="space-y-4">
          {/* Dropdown Selector */}
          <div className="relative">
            <label className="block text-sm font-medium text-secondary mb-2">
              Select Delivery Method
            </label>
            <div className="relative">
              <select
                value={selectedDeliveryOption}
                onChange={(e) => handleDeliveryChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white pr-10"
              >
                <option value="">Choose delivery option...</option>
                {deliveryOptions.map((option) => (
                  <option key={option.delivery_option_id} value={option.delivery_option_id}>
                    {option.name} - {formatPrice(option.price)} ({option.estimated_time_range})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Selected Option Details */}
          {selectedOption && (
            <div className="border border-primary bg-primary/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-secondary">{selectedOption.name}</h3>
                </div>
                <span className="font-semibold text-primary text-lg">
                  {formatPrice(selectedOption.price)}
                </span>
              </div>
              <p className="text-grey text-sm mb-2">{selectedOption.description}</p>
              <p className="text-grey text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Estimated delivery: {selectedOption.estimated_time_range}
              </p>
              {selectedOption.price === 0 && (
                <p className="text-green-600 text-sm font-medium mt-2">✅ FREE DELIVERY</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Truck className="w-12 h-12 text-grey mx-auto mb-4" />
          <p className="text-grey mb-4">No delivery options available.</p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="text-sm text-red-800">
              <p className="font-medium mb-2">⚠️ No delivery options found</p>
              <p>Please contact administrator to add delivery options via Django Admin.</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-blue-800 text-sm font-medium mb-2">Admin Instructions:</p>
            <ol className="text-blue-700 text-sm space-y-1">
              <li>1. Go to Django Admin → Delivery Options</li>
              <li>2. Click "Add Delivery Option"</li>
              <li>3. Fill in name, type, price, and time estimates</li>
              <li>4. Set "Is Active" to True</li>
              <li>5. Save</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryOptions;