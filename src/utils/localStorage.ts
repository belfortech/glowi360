// utils/localStorage.ts - LOCAL STORAGE CART/WISHLIST MANAGEMENT
export interface LocalCartItem {
  product_id: string;
  quantity: number;
  added_at: string;
}

export interface LocalWishlistItem {
  product_id: string;
  added_at: string;
}

const CART_STORAGE_KEY = 'healthx_guest_cart';
const WISHLIST_STORAGE_KEY = 'healthx_guest_wishlist';

// Cart Functions
export const getLocalCart = (): LocalCartItem[] => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading local cart:', error);
    return [];
  }
};

export const addToLocalCart = (productId: string, quantity: number = 1): LocalCartItem[] => {
  try {
    const cart = getLocalCart();
    const existingItem = cart.find(item => item.product_id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        product_id: productId,
        quantity,
        added_at: new Date().toISOString()
      });
    }
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('Error adding to local cart:', error);
    return getLocalCart();
  }
};

export const updateLocalCartItem = (productId: string, quantity: number): LocalCartItem[] => {
  try {
    const cart = getLocalCart();
    const itemIndex = cart.findIndex(item => item.product_id === productId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('Error updating local cart:', error);
    return getLocalCart();
  }
};

export const removeFromLocalCart = (productId: string): LocalCartItem[] => {
  try {
    const cart = getLocalCart().filter(item => item.product_id !== productId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  } catch (error) {
    console.error('Error removing from local cart:', error);
    return getLocalCart();
  }
};

export const clearLocalCart = (): void => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing local cart:', error);
  }
};

export const getLocalCartCount = (): number => {
  return getLocalCart().reduce((total, item) => total + item.quantity, 0);
};

// Wishlist Functions
export const getLocalWishlist = (): LocalWishlistItem[] => {
  try {
    const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error reading local wishlist:', error);
    return [];
  }
};

export const addToLocalWishlist = (productId: string): LocalWishlistItem[] => {
  try {
    const wishlist = getLocalWishlist();
    const existingItem = wishlist.find(item => item.product_id === productId);
    
    if (!existingItem) {
      wishlist.push({
        product_id: productId,
        added_at: new Date().toISOString()
      });
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    }
    
    return wishlist;
  } catch (error) {
    console.error('Error adding to local wishlist:', error);
    return getLocalWishlist();
  }
};

export const removeFromLocalWishlist = (productId: string): LocalWishlistItem[] => {
  try {
    const wishlist = getLocalWishlist().filter(item => item.product_id !== productId);
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    return wishlist;
  } catch (error) {
    console.error('Error removing from local wishlist:', error);
    return getLocalWishlist();
  }
};

export const clearLocalWishlist = (): void => {
  try {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing local wishlist:', error);
  }
};

export const getLocalWishlistCount = (): number => {
  return getLocalWishlist().length;
};

export const isInLocalWishlist = (productId: string): boolean => {
  return getLocalWishlist().some(item => item.product_id === productId);
};

export const isInLocalCart = (productId: string): boolean => {
  return getLocalCart().some(item => item.product_id === productId);
};

// Sync Functions - Called when user logs in
export const syncLocalCartToBackend = async (addToCartFn: (data: { product_id: string; quantity: number }) => Promise<any>) => {
  const localCart = getLocalCart();
  
  for (const item of localCart) {
    try {
      await addToCartFn({
        product_id: item.product_id,
        quantity: item.quantity
      });
    } catch (error) {
      console.error('Error syncing cart item to backend:', error);
    }
  }
  
  // DON'T clear local cart after sync - keep for when user logs out
  console.log('✅ Local cart synced to backend, keeping local copy');
};

export const syncLocalWishlistToBackend = async (addToWishlistFn: (productId: string) => Promise<any>) => {
  const localWishlist = getLocalWishlist();
  
  for (const item of localWishlist) {
    try {
      await addToWishlistFn(item.product_id);
    } catch (error) {
      console.error('Error syncing wishlist item to backend:', error);
    }
  }
  
  // DON'T clear local wishlist after sync - keep for when user logs out
  console.log('✅ Local wishlist synced to backend, keeping local copy');
};