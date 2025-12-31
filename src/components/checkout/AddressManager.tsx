// components/checkout/AddressManager.tsx - IMPROVED WITH ICONS AND COMPACT LAYOUT
import React, { useState } from 'react';
import { MapPin, Plus, CheckCircle, Edit2, Trash2, MoreVertical, User, Phone, Home } from 'lucide-react';
import { Address } from '../../types/api';
import { useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from '../../hooks/orderServiceApi';
import Button from '../common/Button';
import Loading from '../common/Loading';
import Modal from '../ui/Modal';

interface AddressManagerProps {
  addresses: Address[];
  selectedAddress: string;
  onAddressSelect: (addressId: string) => void;
  onAddressAdded: () => void;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  addresses,
  selectedAddress,
  onAddressSelect,
  onAddressAdded
}) => {
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    county: '',
    postal_code: '',
    is_default: false
  });
  
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setAddressForm({
      full_name: '',
      phone_number: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      county: '',
      postal_code: '',
      is_default: false
    });
    setAddressErrors({});
    setEditingAddress(null);
  };

  const validateAddressForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!addressForm.full_name.trim()) errors.full_name = 'Full name is required';
    if (!addressForm.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    } else {
      const phoneRegex = /^(\+254|254|0)?[1-9]\d{8}$/;
      if (!phoneRegex.test(addressForm.phone_number)) {
        errors.phone_number = 'Please enter a valid Kenyan phone number';
      }
    }
    if (!addressForm.address_line_1.trim()) errors.address_line_1 = 'Address line 1 is required';
    if (!addressForm.city.trim()) errors.city = 'City is required';
    if (!addressForm.county.trim()) errors.county = 'County is required';

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (addressErrors[name]) {
      setAddressErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCreateAddress = async (): Promise<void> => {
    if (!validateAddressForm()) return;

    try {
      const response = await createAddressMutation.mutateAsync(addressForm);
      onAddressSelect(response.address_id);
      setShowAddressModal(false);
      resetForm();
      onAddressAdded();
    } catch (error: any) {
      console.error('Failed to add address:', error);
    }
  };

  const handleEditAddress = (address: Address): void => {
    setEditingAddress(address);
    setAddressForm({
      full_name: address.full_name,
      phone_number: address.phone_number,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      city: address.city,
      county: address.county,
      postal_code: address.postal_code || '',
      is_default: address.is_default
    });
    setShowAddressModal(true);
    setShowActionsMenu(null);
  };

  const handleUpdateAddress = async (): Promise<void> => {
    if (!editingAddress || !validateAddressForm()) return;

    try {
      await updateAddressMutation.mutateAsync({
        addressId: editingAddress.address_id,
        data: addressForm
      });
      setShowAddressModal(false);
      resetForm();
      onAddressAdded(); // Refresh data
    } catch (error: any) {
      console.error('Failed to update address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string): Promise<void> => {
    try {
      await deleteAddressMutation.mutateAsync(addressId);
      setShowDeleteConfirm(null);
      onAddressAdded(); // Refresh data
      
      // If deleted address was selected, clear selection
      if (selectedAddress === addressId) {
        onAddressSelect('');
      }
    } catch (error: any) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleSetDefault = async (addressId: string): Promise<void> => {
    try {
      await setDefaultAddressMutation.mutateAsync(addressId);
      setShowActionsMenu(null);
      onAddressAdded(); // Refresh data
    } catch (error: any) {
      console.error('Failed to set default address:', error);
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowAddressModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-secondary flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Delivery Address
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={openAddModal}
          className="flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>
      
      {addresses.length > 0 ? (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.address_id}
              className={`relative p-4 border rounded-lg transition-colors ${
                selectedAddress === address.address_id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <label className="block cursor-pointer">
                <input
                  type="radio"
                  name="address"
                  value={address.address_id}
                  checked={selectedAddress === address.address_id}
                  onChange={(e) => onAddressSelect(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* IMPROVED: Compact 2-line layout with icons */}
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-[#D4AF37]" />
                      <h3 className="font-medium text-secondary">{address.full_name}</h3>
                      {address.is_default && (
                        <span className="text-xs bg-primary text-white px-2 py-1 rounded ml-2">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-start gap-4 text-sm text-grey">
                      {/* Address with icon */}
                      <div className="flex items-start gap-2 flex-1">
                        <Home className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                        <span>
                          {address.address_line_1}
                          {address.address_line_2 && `, ${address.address_line_2}`}, {address.city}, {address.county} {address.postal_code}
                        </span>
                      </div>
                      
                      {/* Phone with icon */}
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#D4AF37]" />
                        <span>{address.phone_number}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {selectedAddress === address.address_id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                    
                    {/* Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionsMenu(showActionsMenu === address.address_id ? null : address.address_id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      {showActionsMenu === address.address_id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          
                          {!address.is_default && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(address.address_id);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Set as Default
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(address.address_id);
                              setShowActionsMenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <MapPin className="w-12 h-12 text-grey mx-auto mb-4" />
          <p className="text-grey mb-4">No addresses found. Please add a delivery address.</p>
          <Button onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>
      )}

      {/* Click outside to close actions menu */}
      {showActionsMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowActionsMenu(null)}
        />
      )}

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          resetForm();
        }}
        title={editingAddress ? "Edit Delivery Address" : "Add New Delivery Address"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={addressForm.full_name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  addressErrors.full_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {addressErrors.full_name && (
                <p className="mt-1 text-sm text-red-600">{addressErrors.full_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone_number"
                value={addressForm.phone_number}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  addressErrors.phone_number ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+254 700 000 000"
              />
              {addressErrors.phone_number && (
                <p className="mt-1 text-sm text-red-600">{addressErrors.phone_number}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="address_line_1"
              value={addressForm.address_line_1}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                addressErrors.address_line_1 ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Street address, building name, house number"
            />
            {addressErrors.address_line_1 && (
              <p className="mt-1 text-sm text-red-600">{addressErrors.address_line_1}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              name="address_line_2"
              value={addressForm.address_line_2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Apartment, suite, unit, floor, etc."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={addressForm.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  addressErrors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter city"
              />
              {addressErrors.city && (
                <p className="mt-1 text-sm text-red-600">{addressErrors.city}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                County *
              </label>
              <input
                type="text"
                name="county"
                value={addressForm.county}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  addressErrors.county ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter county"
              />
              {addressErrors.county && (
                <p className="mt-1 text-sm text-red-600">{addressErrors.county}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postal_code"
                value={addressForm.postal_code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="00100"
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_default"
                checked={addressForm.is_default}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm text-grey">Set as default delivery address</span>
            </label>
          </div>
          
          {/* FIXED: Submit button with primary color and proper visibility */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={editingAddress ? handleUpdateAddress : handleCreateAddress}
              disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
              className={`flex-1 h-12 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                createAddressMutation.isPending || updateAddressMutation.isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#D4AF37] hover:bg-[#d14925]'
              }`}
            >
              {(createAddressMutation.isPending || updateAddressMutation.isPending) ? (
                <>
                  <Loading size="sm" className="w-4 h-4" />
                  {editingAddress ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editingAddress ? 'Update Address' : 'Add Address'
              )}
            </button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddressModal(false);
                resetForm();
              }}
              className="flex-1 h-12"
              disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Address"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this address? This action cannot be undone.
          </p>
          
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => showDeleteConfirm && handleDeleteAddress(showDeleteConfirm)}
              disabled={deleteAddressMutation.isPending}
              className={`flex-1 h-12 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                deleteAddressMutation.isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {deleteAddressMutation.isPending ? (
                <>
                  <Loading size="sm" className="w-4 h-4" />
                  Deleting...
                </>
              ) : (
                'Delete Address'
              )}
            </button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 h-12"
              disabled={deleteAddressMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressManager;