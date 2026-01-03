// src/utils/constants.ts
// Re-export API_BASE_URL from centralized config
export { API_BASE_URL } from '../config/api';

export const PRODUCT_CATEGORIES = [
  { id: 'pain-relief', label: 'Pain Relief' },
  { id: 'otc', label: 'OTC' },
  { id: 'cold-flu', label: 'Cold & Flu' },
  { id: 'vitamins', label: 'Vitamins & Supplements' },
  { id: 'diabetes', label: 'Diabetes Care' },
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'antibiotics', label: 'Antibiotics' },
  { id: 'baby-care', label: 'Baby Care' },
  { id: 'first-aid', label: 'First Aid' },
  { id: 'skin-care', label: 'Skin Care' },
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const DELIVERY_TYPES = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  SAME_DAY: 'same_day',
  PICKUP: 'pickup',
} as const;