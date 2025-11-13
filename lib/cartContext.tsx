"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './authContext';

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.length > 0) {
      setCart(savedCart);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (cart.length > 0) {
      saveCartToStorage(cart);
    } else {
      // Clear localStorage if cart is empty
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart]);

  // Clear cart when user logs out
  useEffect(() => {
    if (!user) {
      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [user]);

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
