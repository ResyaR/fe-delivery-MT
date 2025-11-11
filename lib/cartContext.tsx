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
  isSyncing: boolean;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [lastUserId, setLastUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const getUserSnapshotKey = (userEmail?: string | null) =>
    userEmail ? `foodCart:${userEmail}` : null;

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
      // Always sync from backend first (this is the source of truth)
      const backendCart = await CartAPI.getCart();
      const frontendCart = convertBackendCartToFrontend(backendCart);
      setCart(frontendCart);
      
      // Save to localStorage as backup (only after successful backend sync)
      if (frontendCart.length > 0) {
        localStorage.setItem('foodCart', JSON.stringify(frontendCart));
      } else {
        // If backend cart is empty, remove localStorage to avoid confusion
        localStorage.removeItem('foodCart');
      }

      // Save a per-user session snapshot to avoid flicker on next login
      try {
        const snapshotKey = getUserSnapshotKey(user?.email || null);
        if (snapshotKey) {
          sessionStorage.setItem(snapshotKey, JSON.stringify(frontendCart));
        }
      } catch {}
    } catch (error) {
      console.error('Error syncing cart from backend:', error);
      // Only fallback to localStorage if backend fails AND user is logged in
      // This ensures we don't use stale cart data from previous user
      if (user) {
        const savedCart = localStorage.getItem('foodCart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            // Only use localStorage if it seems valid (has items with menuId)
            if (Array.isArray(parsedCart) && parsedCart.length > 0 && parsedCart[0].menuId) {
              console.warn('Using localStorage cart as fallback (backend sync failed)');
              setCart(parsedCart);
            } else {
              console.warn('localStorage cart seems invalid, clearing it');
              localStorage.removeItem('foodCart');
              setCart([]);
            }
          } catch (parseError) {
            console.error('Error parsing saved cart:', parseError);
            setCart([]);
            localStorage.removeItem('foodCart');
          }
        } else {
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [user, isSyncing]);

  // Handle cart when user changes (different user logged in or logged out)
  useEffect(() => {
    const currentUserId = user?.email || null;
    
    // If user changed (including initial login or logout)
    if (lastUserId !== currentUserId) {
      if (currentUserId !== null) {
        // User logged in
        // 1) Try hydrate from per-user session snapshot for instant UI (avoids empty flicker)
        try {
          const snapshotKey = getUserSnapshotKey(currentUserId);
          if (snapshotKey) {
            const snapshot = sessionStorage.getItem(snapshotKey);
            if (snapshot) {
              const parsed = JSON.parse(snapshot);
              if (Array.isArray(parsed)) {
                setCart(parsed);
              }
            }
          }
        } catch {}

        // 2) Clear cross-user localStorage to avoid stale data mixing
        localStorage.removeItem('foodCart');
      } else {
        // User logged out - clear everything
        console.log('User logged out, clearing cart');
        setCart([]);
        localStorage.removeItem('foodCart');
        try {
          // Optionally clear all per-user snapshots on logout
          // If you want to retain last state per user for same-session relogin, comment this block
          const keysToRemove: string[] = [];
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith('foodCart:')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((k) => sessionStorage.removeItem(k));
        } catch {}
      }
      
      // Update last user ID
      setLastUserId(currentUserId);
    }
  }, [user, lastUserId]);

  // Load cart from backend when user logs in
  useEffect(() => {
    if (!user) {
      // If no user, cart should already be cleared by user change effect
      return;
    }

    // Always sync cart from backend when user is available
    // This ensures cart is loaded from database after login
    // localStorage has been cleared in the previous effect, so we won't use stale data
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

    // Optimistic UI: update immediately
    const previousCart = cart;
    const optimisticCart = (() => {
      const existingItem = cart.find((cartItem) => cartItem.menuId === item.menuId);
      return existingItem
        ? cart.map((cartItem) =>
            cartItem.menuId === item.menuId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        : [...cart, { ...item, quantity: 1 }];
    })();
    setCart(optimisticCart);

    try {
      const backendCart = await CartAPI.addItemToCart(item.menuId, 1);
      const frontendCart = convertBackendCartToFrontend(backendCart, item.restaurantName);
      setCart(frontendCart);
      localStorage.setItem('foodCart', JSON.stringify(frontendCart));
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      // Rollback optimistic update
      setCart(previousCart);
      // Surface validation error
      if (error?.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Failed to add item to cart');
      }
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

    // Optimistic removal
    const previousCart = cart;
    const cartItem = cart.find((item) => item.menuId === menuId);
    const optimisticCart = cart.filter((item) => item.menuId !== menuId);
    setCart(optimisticCart);
    if (optimisticCart.length > 0) {
      localStorage.setItem('foodCart', JSON.stringify(optimisticCart));
    } else {
      localStorage.removeItem('foodCart');
    }

    try {
      if (!cartItem?.id) {
        // If we don't have an ID, try to resync to be safe
        await syncCart();
        return;
      }

      const backendCart = await CartAPI.removeItemFromCart(cartItem.id);
      const frontendCart = convertBackendCartToFrontend(backendCart);
      setCart(frontendCart);
      if (frontendCart.length > 0) {
        localStorage.setItem('foodCart', JSON.stringify(frontendCart));
      } else {
        localStorage.removeItem('foodCart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      // Rollback optimistic change
      setCart(previousCart);
      if (previousCart.length > 0) {
        localStorage.setItem('foodCart', JSON.stringify(previousCart));
      } else {
        localStorage.removeItem('foodCart');
      }
      throw error;
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
        isSyncing,
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

