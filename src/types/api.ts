// src/types/api.ts - UPDATED TO MATCH BACKEND EXACTLY AND FIX TYPE ISSUES
export interface User {
  user_id: string;
  email: string;
  name: string;
  phone_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  category_id: string;
  name: string;
  slug: string;
  description: string;
  product_count: number;
}

// Updated Product interface for DETAIL view (from /products/{id}/ endpoint)
export interface Product {
  product_id: string;
  name: string;
  slug: string;
  description: string; // Always present in detail view
  price: string; // Backend returns as string
  discount_percentage?: number;
  is_discounted: boolean;
  manufacturing_date?: string;
  expiry_date?: string;
  batch_number?: string;
  brand_name?: string;
  generic_name?: string;
  manufacture?: string;
  image?: string;
  category: Category; // Always full Category object in detail view
  stock_quantity: number; // Always present in detail view
  is_active: boolean;
  is_featured: boolean;
  is_prescription_required: boolean;
  rating: string; // Backend returns as string
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

// Product for LIST views (what the /products/ and /products/featured/ endpoints return)
export interface ProductListItem {
  product_id: string;
  name: string;
  slug: string;
  price: string; // String in backend
  discount_percentage?: number;
  is_discounted: boolean;
  image?: string;
  category: string; // Just category name in list view
  rating: string; // String in backend
  reviews_count: number;
  // Additional fields that might be present in cart items
  brand_name?: string; // Add this for cart compatibility
  stock_quantity?: number; // Add this for cart compatibility
}

// Cart Item Product interface - extends ProductListItem with required cart fields
export interface CartProductItem extends ProductListItem {
  brand_name?: string;
  stock_quantity: number; // Required for cart quantity validation
}

export interface CartItem {
  cart_item_id: string;
  product: CartProductItem; // Use the extended interface
  quantity: number;
  total_price: number;
}

export interface Cart {
  cart_id: string;
  items: CartItem[];
  total_items: number;
  total_price: number;
}

export interface Address {
  address_id: string;
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  county: string;
  postal_code?: string;
  is_default: boolean;
}

export interface DeliveryOption {
  delivery_option_id: string;
  name: string;
  delivery_type: 'standard' | 'express' | 'same_day' | 'pickup';
  description: string;
  price: number;
  estimated_time_range: string;
  estimated_hours_min: number;
  estimated_hours_max: number;
}

export interface OrderItem {
  order_item_id: string;
  product_name: string;
  product_price: number;
  product_original_price?: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  order_id: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  delivery_full_name: string;
  delivery_phone_number: string;
  delivery_address_line_1: string;
  delivery_address_line_2?: string;
  delivery_city: string;
  delivery_county: string;
  delivery_postal_code?: string;
  delivery_option: DeliveryOption;
  delivery_fee: number;
  estimated_delivery_time: string;
  subtotal: number;
  total_amount: number;
  total_items: number;
  special_instructions?: string;
  prescription_required: boolean;
  prescription_uploaded: boolean;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  delivered_at?: string;
}

// Pagination interface for API responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Helper functions for converting price strings to numbers
export const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  return parseFloat(price) || 0;
};

// Helper function for converting rating strings to numbers  
export const parseRating = (rating: string | number): number => {
  if (typeof rating === 'number') return rating;
  return parseFloat(rating) || 0;
};