"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
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
  const syncCartRef = useRef<(() => Promise<void>) | null>(null);
  const operationInProgressRef = useRef(false); // Guard untuk mencegah sync saat operasi berjalan

  const getUserSnapshotKey = (userEmail?: string | null) =>
    userEmail ? `foodCart:${userEmail}` : null;

  const persistCartForUser = (items: CartItem[]) => {
    // Persist general fallback
    if (items.length > 0) {
      localStorage.setItem('foodCart', JSON.stringify(items));
    } else {
      localStorage.removeItem('foodCart');
    }
    // Persist per-user snapshot to avoid flicker and stale hydration
    try {
      const snapshotKey = getUserSnapshotKey(user?.email || null);
      if (snapshotKey) {
        if (items.length > 0) {
          sessionStorage.setItem(snapshotKey, JSON.stringify(items));
        } else {
          sessionStorage.removeItem(snapshotKey);
        }
      }
    } catch {}
  };

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
    // Skip sync jika ada operasi yang sedang berjalan atau sudah syncing
    if (!user || isSyncing || operationInProgressRef.current) {
      return;
    }

    setIsSyncing(true);
    setIsLoading(true);
    try {
      // Always sync from backend first (this is the source of truth)
      const backendCart = await CartAPI.getCart();
      const frontendCart = convertBackendCartToFrontend(backendCart);
      
      // Hanya update jika tidak ada operasi yang sedang berjalan
      if (!operationInProgressRef.current) {
        setCart(frontendCart);
        // Save to localStorage as backup (only after successful backend sync)
        persistCartForUser(frontendCart);
      }
    } catch (error) {
      console.error('Error syncing cart from backend:', error);
      // Only fallback to localStorage if backend fails AND user is logged in
      // This ensures we don't use stale cart data from previous user
      if (user && !operationInProgressRef.current) {
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
      }
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [user, isSyncing]);

  // Store syncCart in ref to avoid dependency issues
  syncCartRef.current = syncCart;

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
    // Use ref to avoid dependency loop
    if (syncCartRef.current) {
      syncCartRef.current();
    }
  }, [user]); // Only depend on user, not syncCart

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
        persistCartForUser(newCart);
        return newCart;
      });
      return;
    }

    // Set flag untuk mencegah sync saat operasi berjalan
    operationInProgressRef.current = true;

    // Optimistic UI: update immediately
    const previousCart = [...cart];
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
    persistCartForUser(optimisticCart);

    try {
      const backendCart = await CartAPI.addItemToCart(item.menuId, 1);
      const frontendCart = convertBackendCartToFrontend(backendCart, item.restaurantName);
      
      // Merge dengan optimistic update untuk menghindari flicker
      // Pastikan semua item dari backend ada, tapi jangan replace jika ada perbedaan kecil
      if (frontendCart.length > 0) {
        setCart(frontendCart);
        persistCartForUser(frontendCart);
      } else {
        // Jika backend return empty, keep optimistic update
        console.warn('Backend returned empty cart, keeping optimistic update');
      }
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      // Rollback optimistic update
      setCart(previousCart);
      persistCartForUser(previousCart);
      
      // Surface all errors with proper messages
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Gagal menambahkan item ke keranjang';
      throw new Error(errorMessage);
    } finally {
      // Clear flag setelah operasi selesai
      operationInProgressRef.current = false;
    }
  };

  const removeFromCart = async (menuId: number) => {
    if (!user) {
      // If no user, use localStorage only
      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => item.menuId !== menuId);
        persistCartForUser(newCart);
        return newCart;
      });
      return;
    }

    // Set flag untuk mencegah sync saat operasi berjalan
    operationInProgressRef.current = true;

    // Find cart item first
    const cartItem = cart.find((item) => item.menuId === menuId);
    
    // If item not found, nothing to remove
    if (!cartItem) {
      console.warn('Item not found in cart:', menuId);
      operationInProgressRef.current = false;
      return;
    }

    // Optimistic removal - update UI immediately
    const previousCart = [...cart];
    const optimisticCart = cart.filter((item) => item.menuId !== menuId);
    setCart(optimisticCart);
    persistCartForUser(optimisticCart);

    try {
      // If cart item doesn't have ID, sync first to get proper IDs
      if (!cartItem.id) {
        console.warn('Cart item missing ID, syncing cart first...');
        try {
          // Sync cart to get proper IDs from backend
          const backendCart = await CartAPI.getCart();
          const frontendCart = convertBackendCartToFrontend(backendCart);
          
          // After sync, find the item again with proper ID
          const updatedCartItem = frontendCart.find((item) => item.menuId === menuId);
          
          if (updatedCartItem?.id) {
            // Now remove with proper ID
            const removedCart = await CartAPI.removeItemFromCart(updatedCartItem.id);
            const finalCart = convertBackendCartToFrontend(removedCart);
            setCart(finalCart);
            persistCartForUser(finalCart);
          } else {
            // Item not found after sync, keep optimistic update
            console.warn('Item not found after sync, keeping optimistic removal');
          }
        } catch (error) {
          console.error('Error syncing cart before removal:', error);
          // Keep optimistic removal if sync fails
        }
        return;
      }

      const backendCart = await CartAPI.removeItemFromCart(cartItem.id);
      const frontendCart = convertBackendCartToFrontend(backendCart);
      
      // Update dengan data dari backend
      setCart(frontendCart);
      persistCartForUser(frontendCart);
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      // Rollback optimistic change
      setCart(previousCart);
      persistCartForUser(previousCart);
      
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Gagal menghapus item dari keranjang';
      throw new Error(errorMessage);
    } finally {
      // Clear flag setelah operasi selesai
      operationInProgressRef.current = false;
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
        persistCartForUser(newCart);
        return newCart;
      });
      return;
    }

    // Set flag untuk mencegah sync saat operasi berjalan
    operationInProgressRef.current = true;
    setIsLoading(true);
    
    // Optimistic update - update UI immediately
    const previousCart = [...cart];
    const optimisticCart = cart.map((item) =>
      item.menuId === menuId ? { ...item, quantity } : item
    );
    setCart(optimisticCart);
    persistCartForUser(optimisticCart);

    try {
      // Find cart item ID dari previousCart (sebelum optimistic update)
      const cartItem = previousCart.find((item) => item.menuId === menuId);
      
      if (!cartItem?.id) {
        // If no ID, sync first to get proper IDs
        console.warn('Cart item missing ID, syncing cart first...');
        try {
          // Sync cart to get proper IDs from backend
          const syncedCart = await CartAPI.getCart();
          const frontendCart = convertBackendCartToFrontend(syncedCart);
          
          // After sync, find the item again with proper ID
          const updatedCartItem = frontendCart.find((item) => item.menuId === menuId);
          
          if (updatedCartItem?.id) {
            // Now update with proper ID
            const backendCart = await CartAPI.updateCartItem(updatedCartItem.id, quantity);
            const finalCart = convertBackendCartToFrontend(backendCart);
            setCart(finalCart);
            persistCartForUser(finalCart);
          } else {
            // Item not found after sync, keep optimistic update
            console.warn('Item not found after sync, keeping optimistic update');
          }
        } catch (syncError) {
          console.error('Error syncing cart before update:', syncError);
          // Keep optimistic update if sync fails
        }
        return;
      }

      const backendCart = await CartAPI.updateCartItem(cartItem.id, quantity);
      const frontendCart = convertBackendCartToFrontend(backendCart);
      
      // Update dengan data dari backend
      if (frontendCart.length > 0) {
        setCart(frontendCart);
        persistCartForUser(frontendCart);
      } else {
        // Jika backend return empty, keep optimistic update
        console.warn('Backend returned empty cart, keeping optimistic update');
      }
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      // Rollback optimistic update
      setCart(previousCart);
      persistCartForUser(previousCart);
      
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Gagal mengupdate jumlah item';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      // Clear flag setelah operasi selesai
      operationInProgressRef.current = false;
    }
  };

  const clearCart = async () => {
    if (!user) {
      // If no user, just clear localStorage
      setCart([]);
      localStorage.removeItem('foodCart');
      return;
    }

    // Set flag untuk mencegah sync saat operasi berjalan
    operationInProgressRef.current = true;
    setIsLoading(true);
    
    // Optimistic clear
    const previousCart = [...cart];
    setCart([]);
    persistCartForUser([]);

    try {
      await CartAPI.clearCart();
      // Cart sudah di-clear di optimistic update
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Rollback jika clear gagal
      setCart(previousCart);
      persistCartForUser(previousCart);
      throw error;
    } finally {
      setIsLoading(false);
      // Clear flag setelah operasi selesai
      operationInProgressRef.current = false;
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

