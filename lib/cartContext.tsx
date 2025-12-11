"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './authContext';
import indexedDB from './indexedDB';

interface CartItem {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
  image?: string;
  restaurantId: number;
  restaurantName: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (menuId: number) => Promise<void>;
  updateQuantity: (menuId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getRestaurantId: () => number | null;
  isLoading: boolean;
  isSyncing: boolean;
  syncCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mt_trans_cart';

// Helper functions untuk localStorage
const saveCartToStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return [];
};

// Helper function to save cart to IndexedDB (backup for offline)
const saveCartToIndexedDB = async (cart: CartItem[]) => {
  try {
    // Initialize IndexedDB if not already done
    await indexedDB.init();
    
    // Save cart items to IndexedDB
    if (cart.length > 0) {
      const cartItems = cart.map((item, index) => ({
        id: `cart-item-${item.menuId}-${Date.now()}-${index}`,
        cartId: 'main-cart',
        menuId: item.menuId,
        quantity: item.quantity,
        price: item.price,
        menuName: item.menuName,
        image: item.image,
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
      }));
      
      await indexedDB.cacheCartItems(cartItems);
      await indexedDB.cacheCart({
        id: 'main-cart',
        restaurantId: cart[0]?.restaurantId || null,
        items: cartItems,
      });
    } else {
      await indexedDB.clearCart();
    }
  } catch (error) {
    console.warn('Error saving cart to IndexedDB:', error);
    // Don't throw, just log warning - localStorage is primary
  }
};

// Helper function to load cart from IndexedDB (fallback)
const loadCartFromIndexedDB = async (): Promise<CartItem[]> => {
  try {
    await indexedDB.init();
    const cachedCart = await indexedDB.getCachedCart();
    
    if (cachedCart && cachedCart.items) {
      return cachedCart.items.map((item: any) => ({
        menuId: item.menuId,
        menuName: item.menuName,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName,
      }));
    }
  } catch (error) {
    console.warn('Error loading cart from IndexedDB:', error);
  }
  return [];
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [previousUser, setPreviousUser] = useState<any>(null);
  const { user, loading: authLoading } = useAuth();

  // Load cart from localStorage on mount (only once, before auth check)
  // Fallback to IndexedDB if localStorage is empty
  useEffect(() => {
    if (!isInitialized) {
      const savedCart = loadCartFromStorage();
      if (savedCart && Array.isArray(savedCart) && savedCart.length > 0) {
        setCart(savedCart);
        setIsInitialized(true);
      } else {
        // Try IndexedDB as fallback
        loadCartFromIndexedDB().then((cachedCart) => {
          if (cachedCart && cachedCart.length > 0) {
            setCart(cachedCart);
            saveCartToStorage(cachedCart); // Sync back to localStorage
          }
          setIsInitialized(true);
        }).catch(() => {
          setIsInitialized(true);
        });
      }
    }
  }, [isInitialized]);

  // Save cart to localStorage and IndexedDB whenever cart changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      if (cart.length > 0) {
        saveCartToStorage(cart);
        // Also save to IndexedDB for offline backup
        saveCartToIndexedDB(cart).catch(() => {
          // Silently fail, localStorage is primary
        });
      } else {
        // Keep cart in localStorage even if empty, so we know it was initialized
        // Only remove if explicitly cleared
      }
    }
  }, [cart, isInitialized]);

  // Track previous user to detect logout
  useEffect(() => {
    setPreviousUser(user);
  }, [user]);

  // Clear cart when user explicitly logs out (user changed from non-null to null)
  useEffect(() => {
    if (!authLoading && isInitialized && previousUser && !user) {
      // User was logged in before but now null = logout, clear cart
      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [user, previousUser, authLoading, isInitialized]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
      setCart((prevCart) => {
      // Biarkan semua item dari berbagai restaurant bisa ditambahkan ke cart yang sama
      // Normal flow: tambah item
        const existingItem = prevCart.find((cartItem) => cartItem.menuId === item.menuId);
      if (existingItem) {
        return prevCart.map((cartItem) =>
              cartItem.menuId === item.menuId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    return Promise.resolve();
  };

  const removeFromCart = async (menuId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.menuId !== menuId));
    return Promise.resolve();
  };

  const updateQuantity = async (menuId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(menuId);
      return;
    }

        setCart((prevCart) =>
          prevCart.map((item) =>
            item.menuId === menuId ? { ...item, quantity } : item
          )
        );
    return Promise.resolve();
  };

  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    // Also clear IndexedDB
    try {
      await indexedDB.clearCart();
    } catch (error) {
      console.warn('Error clearing cart from IndexedDB:', error);
    }
    return Promise.resolve();
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getRestaurantId = () => {
    if (cart.length === 0) return null;
    return cart[0].restaurantId;
  };

  const syncCart = () => {
    // No-op untuk localStorage, tidak perlu sync
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getRestaurantId,
        isLoading: false,
        isSyncing: false,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
