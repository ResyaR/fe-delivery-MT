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
  const addingItemsRef = useRef<Set<number>>(new Set()); // Per-item lock untuk add to cart (by menuId)
  const updatingItemsRef = useRef<Set<number>>(new Set()); // Per-item lock untuk update quantity
  const removingItemsRef = useRef<Set<number>>(new Set()); // Per-item lock untuk remove

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

    // GUARD: Cek apakah item ini sedang ditambahkan (per-item lock)
    if (addingItemsRef.current.has(item.menuId)) {
      // Jangan log warning untuk setiap skip, ini normal behavior
      return;
    }

    addingItemsRef.current.add(item.menuId);
    operationInProgressRef.current = true;
    
    // Safety timeout: auto-clear flag setelah 10 detik (jika operasi terlalu lama)
    const timeoutId = setTimeout(() => {
      if (addingItemsRef.current.has(item.menuId)) {
        console.warn(`Auto-clearing add lock for item ${item.menuId} after timeout`);
        addingItemsRef.current.delete(item.menuId);
        operationInProgressRef.current = false;
      }
    }, 10000);

    // Check restaurant sebelum optimistic update (seperti Gojek/Grab)
    let previousCart: CartItem[] = [];
    let needsClearCart = false;
    
    setCart((prevCart) => {
      previousCart = [...prevCart];
      
      // Check jika cart punya item dari restaurant berbeda
      if (prevCart.length > 0) {
        const currentRestaurantId = prevCart[0].restaurantId;
        if (currentRestaurantId !== item.restaurantId) {
          needsClearCart = true;
          // Clear cart di UI dulu (optimistic) - seperti Gojek/Grab auto-replace
          return [{ ...item, quantity: 1 }];
        }
      }
      
      // Normal flow: tambah item
      const existingItem = prevCart.find((cartItem) => cartItem.menuId === item.menuId);
      return existingItem
        ? prevCart.map((cartItem) =>
            cartItem.menuId === item.menuId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        : [...prevCart, { ...item, quantity: 1 }];
    });

    try {
      // Jika perlu clear cart, clear dulu (seperti Gojek/Grab)
      if (needsClearCart) {
        try {
          await CartAPI.clearCart();
        } catch (clearError) {
          console.error('Error clearing cart:', clearError);
          // Continue anyway, backend will handle it
        }
      }

      const backendCart = await CartAPI.addItemToCart(item.menuId, 1);
      const frontendCart = convertBackendCartToFrontend(backendCart, item.restaurantName);
      
      // Update dengan data dari backend
      setCart((prevCart) => {
        const prevTotal = prevCart.reduce((sum, item) => sum + item.quantity, 0);
        const newTotal = frontendCart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (prevTotal === newTotal && prevCart.length === frontendCart.length) {
          const isSame = prevCart.every((prevItem, idx) => {
            const newItem = frontendCart[idx];
            return prevItem.menuId === newItem.menuId && 
                   prevItem.quantity === newItem.quantity;
          });
          if (isSame) {
            return prevCart;
          }
        }
        
        return frontendCart;
      });
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      
      const errorMessage = error?.response?.data?.message || error?.message || '';
      const isServerError = error?.response?.status === 500;
      const isDifferentRestaurantError = error?.response?.status === 400 && 
        (errorMessage.includes('different restaurants') || 
         errorMessage.includes('different restaurant') ||
         errorMessage.includes('Cannot add items from different restaurants'));
      
      // Handle error 500 - retry dengan sync cart dulu (masalah backend cartId null)
      if (isServerError) {
        console.log('Server error (500) detected, syncing cart and retrying...');
        // JANGAN clear flag di sini, biarkan finally block yang handle
        
        // Sync cart dulu untuk pastikan state konsisten
        try {
          await new Promise(resolve => setTimeout(resolve, 300)); // Small delay
          const syncedCart = await CartAPI.getCart();
          const syncedFrontendCart = convertBackendCartToFrontend(syncedCart);
          setCart(syncedFrontendCart);
          
          // Cek apakah item sudah ada di cart setelah sync
          const existingItem = syncedFrontendCart.find((cartItem) => cartItem.menuId === item.menuId);
          if (existingItem) {
            // Item sudah ada, tidak perlu add lagi - flag akan di-clear di finally
            return;
          }
          
          // Retry add item (flag masih aktif dari awal, tidak perlu set lagi)
          const backendCart = await CartAPI.addItemToCart(item.menuId, 1);
          const frontendCart = convertBackendCartToFrontend(backendCart, item.restaurantName);
          setCart(frontendCart);
          
          // Success, flag akan di-clear di finally
          return;
        } catch (retryError: any) {
          console.error('Error retrying after 500 error:', retryError);
          setCart(previousCart);
          // Flag akan di-clear di finally
          throw new Error(retryError?.response?.data?.message || retryError?.message || 'Gagal menambahkan item ke keranjang');
        }
      }
      
      // Handle error "different restaurants" - auto clear and retry (fallback)
      if (isDifferentRestaurantError) {
        console.log('Backend detected different restaurant, clearing and retrying...');
        try {
          await CartAPI.clearCart();
          setCart([]);
          
          // Retry adding item (flag masih aktif dari awal)
          const backendCart = await CartAPI.addItemToCart(item.menuId, 1);
          const frontendCart = convertBackendCartToFrontend(backendCart, item.restaurantName);
          setCart(frontendCart);
          
          // Success, flag akan di-clear di finally
          return;
        } catch (retryError: any) {
          console.error('Error retrying after clear cart:', retryError);
          setCart(previousCart);
          // Flag akan di-clear di finally
          throw new Error(retryError?.response?.data?.message || retryError?.message || 'Gagal menambahkan item ke keranjang');
        }
      }
      
      // Rollback untuk error lain
      setCart(previousCart);
      // Flag akan di-clear di finally
      throw new Error(errorMessage || 'Gagal menambahkan item ke keranjang');
    } finally {
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Pastikan flag selalu di-clear (fallback)
      if (addingItemsRef.current.has(item.menuId)) {
        addingItemsRef.current.delete(item.menuId);
      }
      operationInProgressRef.current = false;
    }
  };

  const removeFromCart = async (menuId: number) => {
    if (!user) {
      // If no user, just update local state (no persistence)
      setCart((prevCart) => prevCart.filter((item) => item.menuId !== menuId));
      return;
    }

    // GUARD: Cek apakah item ini sedang dihapus
    if (removingItemsRef.current.has(menuId)) {
      console.warn(`Item ${menuId} is already being removed, skipping...`);
      return;
    }

    removingItemsRef.current.add(menuId);
    operationInProgressRef.current = true;

    // Find cart item first menggunakan functional update untuk mendapatkan state terbaru
    let cartItem: CartItem | undefined;
    let previousCart: CartItem[] = [];
    setCart((prevCart) => {
      previousCart = [...prevCart];
      cartItem = prevCart.find((item) => item.menuId === menuId);
      // Optimistic removal langsung di sini
      return prevCart.filter((item) => item.menuId !== menuId);
    });
    
    // If item not found, nothing to remove (ini normal, tidak perlu warn)
    if (!cartItem) {
      // Item sudah tidak ada, mungkin sudah dihapus sebelumnya
      // Ini normal, tidak perlu warn
      removingItemsRef.current.delete(menuId);
      operationInProgressRef.current = false;
      return;
    }

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
      removingItemsRef.current.delete(menuId);
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

    // GUARD: Cek apakah item ini sedang di-update
    if (updatingItemsRef.current.has(menuId)) {
      console.warn(`Item ${menuId} is already being updated, skipping...`);
      return;
    }

    updatingItemsRef.current.add(menuId);
    operationInProgressRef.current = true;
    setIsLoading(true);
    
    // Gunakan functional update untuk mendapatkan state terbaru dan optimistic update
    let previousCart: CartItem[] = [];
    let cartItem: CartItem | undefined;
    setCart((prevCart) => {
      previousCart = [...prevCart];
      cartItem = prevCart.find((item) => item.menuId === menuId);
      // Optimistic update langsung di sini
      return prevCart.map((item) =>
        item.menuId === menuId ? { ...item, quantity } : item
      );
    });

    try {
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
      
      // Hanya update jika data berbeda (prevent unnecessary re-render)
      setCart((prevCart) => {
        const prevItem = prevCart.find((item) => item.menuId === menuId);
        const newItem = frontendCart.find((item) => item.menuId === menuId);
        
        // Jika quantity sama, skip update untuk prevent flickering
        if (prevItem && newItem && prevItem.quantity === newItem.quantity) {
          return prevCart; // Skip update
        }
        
        return frontendCart;
      });
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
      updatingItemsRef.current.delete(menuId);
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

