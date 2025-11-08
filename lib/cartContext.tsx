"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './authContext';
import CartAPI, { CartResponse, CartItemResponse } from './cartApi';

interface CartItem {
  id?: number; // Cart item ID from backend
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
  addToCart: (item: Omit<CartItem, 'quantity' | 'id'>) => Promise<void>;
  removeFromCart: (menuId: number) => Promise<void>;
  updateQuantity: (menuId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getRestaurantId: () => number | null;
  isLoading: boolean;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [lastUserId, setLastUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Convert backend cart response to frontend cart items
  const convertBackendCartToFrontend = (backendCart: CartResponse, restaurantNameOverride?: string): CartItem[] => {
    if (!backendCart.items || backendCart.items.length === 0) {
      return [];
    }

    // Use restaurantName from backend, or override if provided
    const restaurantName = restaurantNameOverride || backendCart.restaurantName || 'Restaurant';

    return backendCart.items.map((item: CartItemResponse) => ({
      id: item.id,
      menuId: item.menuId,
      menuName: item.menuName,
      price: item.price,
      quantity: item.quantity,
      image: item.menuImage || undefined,
      restaurantId: backendCart.restaurantId || 0,
      restaurantName,
    }));
  };

  // Sync cart from backend
  const syncCart = useCallback(async () => {
    if (!user || isSyncing) return;

    setIsSyncing(true);
    setIsLoading(true);
    try {
      const backendCart = await CartAPI.getCart();
      const frontendCart = convertBackendCartToFrontend(backendCart);
      setCart(frontendCart);
      
      // Also save to localStorage as backup
      if (frontendCart.length > 0) {
        localStorage.setItem('foodCart', JSON.stringify(frontendCart));
      } else {
        localStorage.removeItem('foodCart');
      }
    } catch (error) {
      console.error('Error syncing cart from backend:', error);
      // Fallback to localStorage if backend fails
      const savedCart = localStorage.getItem('foodCart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (parseError) {
          console.error('Error parsing saved cart:', parseError);
          setCart([]);
        }
      }
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [user, isSyncing]);

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

  // Load cart from backend when user logs in
  useEffect(() => {
    if (!user) {
      // If no user, clear cart
      setCart([]);
      localStorage.removeItem('foodCart');
      return;
    }

    // Sync cart from backend
    syncCart();
  }, [user, syncCart]);

  const addToCart = async (item: Omit<CartItem, 'quantity' | 'id'>) => {
    if (!user) {
      // If no user, use localStorage only (fallback)
      setCart((prevCart) => {
        const existingItem = prevCart.find((cartItem) => cartItem.menuId === item.menuId);
        const newCart = existingItem
          ? prevCart.map((cartItem) =>
              cartItem.menuId === item.menuId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          : [...prevCart, { ...item, quantity: 1 }];
        localStorage.setItem('foodCart', JSON.stringify(newCart));
        return newCart;
      });
      return;
    }

    setIsLoading(true);
    try {
      // Find existing item to determine quantity increment
      const existingItem = cart.find((cartItem) => cartItem.menuId === item.menuId);
      const quantityToAdd = existingItem ? 1 : 1; // Always add 1, backend will handle increment if exists

      const backendCart = await CartAPI.addItemToCart(item.menuId, quantityToAdd);
      const frontendCart = convertBackendCartToFrontend(backendCart, item.restaurantName);
      setCart(frontendCart);
      
      // Save to localStorage as backup
      localStorage.setItem('foodCart', JSON.stringify(frontendCart));
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      // Fallback to localStorage update
      setCart((prevCart) => {
        const existingItem = prevCart.find((cartItem) => cartItem.menuId === item.menuId);
        const newCart = existingItem
          ? prevCart.map((cartItem) =>
              cartItem.menuId === item.menuId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          : [...prevCart, { ...item, quantity: 1 }];
        localStorage.setItem('foodCart', JSON.stringify(newCart));
        return newCart;
      });
      
      // Show error message if it's a validation error
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Failed to add item to cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (menuId: number) => {
    if (!user) {
      // If no user, use localStorage only
      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => item.menuId !== menuId);
        if (newCart.length > 0) {
          localStorage.setItem('foodCart', JSON.stringify(newCart));
        } else {
          localStorage.removeItem('foodCart');
        }
        return newCart;
      });
      return;
    }

    setIsLoading(true);
    try {
      // Find cart item ID
      const cartItem = cart.find((item) => item.menuId === menuId);
      if (!cartItem?.id) {
        // Fallback if no ID (shouldn't happen, but handle gracefully)
        setCart((prevCart) => prevCart.filter((item) => item.menuId !== menuId));
        return;
      }

      const backendCart = await CartAPI.removeItemFromCart(cartItem.id);
      const frontendCart = convertBackendCartToFrontend(backendCart);
      setCart(frontendCart);
      
      // Update localStorage
      if (frontendCart.length > 0) {
        localStorage.setItem('foodCart', JSON.stringify(frontendCart));
      } else {
        localStorage.removeItem('foodCart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      // Fallback to localStorage update
      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => item.menuId !== menuId);
        if (newCart.length > 0) {
          localStorage.setItem('foodCart', JSON.stringify(newCart));
        } else {
          localStorage.removeItem('foodCart');
        }
        return newCart;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (menuId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(menuId);
      return;
    }

    if (!user) {
      // If no user, use localStorage only
      setCart((prevCart) => {
        const newCart = prevCart.map((item) =>
          item.menuId === menuId ? { ...item, quantity } : item
        );
        localStorage.setItem('foodCart', JSON.stringify(newCart));
        return newCart;
      });
      return;
    }

    setIsLoading(true);
    try {
      // Find cart item ID
      const cartItem = cart.find((item) => item.menuId === menuId);
      if (!cartItem?.id) {
        // Fallback if no ID
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.menuId === menuId ? { ...item, quantity } : item
          )
        );
        return;
      }

      const backendCart = await CartAPI.updateCartItem(cartItem.id, quantity);
      const frontendCart = convertBackendCartToFrontend(backendCart);
      setCart(frontendCart);
      
      // Update localStorage
      localStorage.setItem('foodCart', JSON.stringify(frontendCart));
    } catch (error) {
      console.error('Error updating cart item:', error);
      // Fallback to localStorage update
      setCart((prevCart) => {
        const newCart = prevCart.map((item) =>
          item.menuId === menuId ? { ...item, quantity } : item
        );
        localStorage.setItem('foodCart', JSON.stringify(newCart));
        return newCart;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      // If no user, just clear localStorage
      setCart([]);
      localStorage.removeItem('foodCart');
      return;
    }

    setIsLoading(true);
    try {
      await CartAPI.clearCart();
      setCart([]);
      localStorage.removeItem('foodCart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Fallback: clear local state anyway
      setCart([]);
      localStorage.removeItem('foodCart');
    } finally {
      setIsLoading(false);
    }
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
        isLoading,
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

