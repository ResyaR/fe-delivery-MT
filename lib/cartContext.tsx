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
  const isAddingToCartRef = useRef(false); // Guard untuk mencegah multiple concurrent add operations

  // Removed localStorage persistence - it was causing errors
  // Cart state is now managed purely through backend and React state

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
      }
    } catch (error) {
      console.error('Error syncing cart from backend:', error);
      // No localStorage fallback - just clear cart if sync fails
      if (user && !operationInProgressRef.current) {
        setCart([]);
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
      if (currentUserId === null) {
        // User logged out - clear cart
        console.log('User logged out, clearing cart');
        setCart([]);
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
      // If no user, just update local state (no persistence)
      setCart((prevCart) => {
        const existingItem = prevCart.find((cartItem) => cartItem.menuId === item.menuId);
        return existingItem
          ? prevCart.map((cartItem) =>
              cartItem.menuId === item.menuId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          : [...prevCart, { ...item, quantity: 1 }];
      });
      return;
    }

    // Prevent multiple concurrent add operations
    if (isAddingToCartRef.current) {
      console.warn('Add to cart operation already in progress, skipping...');
      return;
    }

    // Set flags untuk mencegah sync dan multiple concurrent operations
    operationInProgressRef.current = true;
    isAddingToCartRef.current = true;

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

    try {
      const backendCart = await CartAPI.addItemToCart(item.menuId, 1);
      const frontendCart = convertBackendCartToFrontend(backendCart, item.restaurantName);
      
      // Update dengan data dari backend (selalu gunakan data dari backend sebagai source of truth)
      setCart(frontendCart);
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      
      // Jika error 500, kemungkinan ada race condition di backend
      // Sync cart untuk mendapatkan state terbaru (mungkin item sudah berhasil ditambahkan)
      if (error?.response?.status === 500) {
        console.warn('Server error (500) during add to cart, syncing cart to get latest state...');
        try {
          const backendCart = await CartAPI.getCart();
          const frontendCart = convertBackendCartToFrontend(backendCart, item.restaurantName);
          setCart(frontendCart);
          // Don't throw error if sync succeeds - item might have been added successfully
          return;
        } catch (syncError) {
          console.error('Error syncing cart after 500 error:', syncError);
          // If sync fails, rollback optimistic update
          setCart(previousCart);
        }
      } else {
        // Untuk error selain 500, rollback optimistic update
        setCart(previousCart);
      }
      
      // Surface all errors with proper messages
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Gagal menambahkan item ke keranjang';
      throw new Error(errorMessage);
    } finally {
      // Clear flags setelah operasi selesai
      operationInProgressRef.current = false;
      isAddingToCartRef.current = false;
    }
  };

  const removeFromCart = async (menuId: number) => {
    if (!user) {
      // If no user, just update local state (no persistence)
      setCart((prevCart) => prevCart.filter((item) => item.menuId !== menuId));
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
            try {
              const removedCart = await CartAPI.removeItemFromCart(updatedCartItem.id);
              const finalCart = convertBackendCartToFrontend(removedCart);
              // Update dengan data dari backend (selalu gunakan data dari backend sebagai source of truth)
              setCart(finalCart);
            } catch (removeError: any) {
              // Jika error 404, berarti item sudah tidak ada di backend
              if (removeError?.response?.status === 404 || removeError?.message?.includes('not found')) {
                console.warn('Item not found in backend (404) during removal, syncing cart to get latest state...');
                // Sync cart untuk mendapatkan state terbaru
                try {
                  const backendCart = await CartAPI.getCart();
                  const frontendCart = convertBackendCartToFrontend(backendCart);
                  setCart(frontendCart);
                } catch (syncError) {
                  console.error('Error syncing cart after 404:', syncError);
                  // Jika sync gagal, keep optimistic removal
                }
              } else {
                // Error selain 404, throw error
                throw removeError;
              }
            }
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
      
      // Update dengan data dari backend (selalu gunakan data dari backend sebagai source of truth)
      setCart(frontendCart);
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      
      // Jika error 404, berarti item sudah tidak ada di backend (mungkin sudah dihapus sebelumnya)
      // Anggap sudah berhasil dihapus, jangan rollback
      if (error?.response?.status === 404 || error?.message?.includes('not found')) {
        console.warn('Item not found in backend (404), assuming already deleted. Syncing cart to get latest state...');
        // Sync cart untuk mendapatkan state terbaru dari backend
        try {
          const backendCart = await CartAPI.getCart();
          const frontendCart = convertBackendCartToFrontend(backendCart);
          setCart(frontendCart);
        } catch (syncError) {
          console.error('Error syncing cart after 404:', syncError);
          // Jika sync gagal, keep optimistic removal (item sudah dihapus di UI)
        }
        return; // Exit early, tidak perlu throw error
      }
      
      // Untuk error selain 404, rollback optimistic change
      setCart(previousCart);
      
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
      // If no user, just update local state (no persistence)
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.menuId === menuId ? { ...item, quantity } : item
        )
      );
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
      } else {
        // Jika backend return empty, keep optimistic update
        console.warn('Backend returned empty cart, keeping optimistic update');
      }
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      // Rollback optimistic update
      setCart(previousCart);
      
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
      // If no user, just clear local state
      setCart([]);
      return;
    }

    // Set flag untuk mencegah sync saat operasi berjalan
    operationInProgressRef.current = true;
    setIsLoading(true);
    
    // Optimistic clear
    const previousCart = [...cart];
    setCart([]);

    try {
      await CartAPI.clearCart();
      // Cart sudah di-clear di optimistic update
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Rollback jika clear gagal
      setCart(previousCart);
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

