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
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getRestaurantId: () => number | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const [lastUserId, setLastUserId] = useState<string | null>(null);

  // Clear cart when user changes (different user logged in)
  useEffect(() => {
    const currentUserId = user?.email || null;
    
    // If user changed (different user logged in), clear cart
    if (lastUserId !== null && lastUserId !== currentUserId && currentUserId !== null) {
      console.log('User changed, clearing cart');
      setCart([]);
      localStorage.removeItem('foodCart');
    }
    
    // Update last user ID
    if (currentUserId !== lastUserId) {
      setLastUserId(currentUserId);
    }
  }, [user, lastUserId]);

  // Load cart from localStorage on mount (only if user is logged in)
  useEffect(() => {
    if (!user) {
      // If no user, clear cart
      setCart([]);
      return;
    }

    const savedCart = localStorage.getItem('foodCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('foodCart');
      }
    }
  }, [user]);

  // Save cart to localStorage whenever it changes (only if user is logged in)
  useEffect(() => {
    if (user && cart.length > 0) {
      localStorage.setItem('foodCart', JSON.stringify(cart));
    } else if (!user) {
      // If user logs out, cart should already be cleared, but ensure it's removed
      localStorage.removeItem('foodCart');
    }
  }, [cart, user]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      // Check if item already exists
      const existingItem = prevCart.find((cartItem) => cartItem.menuId === item.menuId);
      
      if (existingItem) {
        // Increment quantity
        return prevCart.map((cartItem) =>
          cartItem.menuId === item.menuId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (menuId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.menuId !== menuId));
  };

  const updateQuantity = (menuId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuId === menuId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('foodCart');
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

