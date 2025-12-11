/**
 * IndexedDB Service for PWA Offline Support
 * Handles caching of restaurants, menus, and cart data
 */

const DB_NAME = 'MTTransDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  RESTAURANTS: 'restaurants',
  MENUS: 'menus',
  CART: 'cart',
  CART_ITEMS: 'cartItems',
  ADDRESSES: 'addresses',
};

class IndexedDBService {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize IndexedDB
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create restaurants store
        if (!db.objectStoreNames.contains(STORES.RESTAURANTS)) {
          const restaurantStore = db.createObjectStore(STORES.RESTAURANTS, {
            keyPath: 'id',
          });
          restaurantStore.createIndex('category', 'category', { unique: false });
          restaurantStore.createIndex('status', 'status', { unique: false });
        }

        // Create menus store
        if (!db.objectStoreNames.contains(STORES.MENUS)) {
          const menuStore = db.createObjectStore(STORES.MENUS, {
            keyPath: 'id',
          });
          menuStore.createIndex('restaurantId', 'restaurantId', {
            unique: false,
          });
          menuStore.createIndex('category', 'category', { unique: false });
        }

        // Create cart store
        if (!db.objectStoreNames.contains(STORES.CART)) {
          db.createObjectStore(STORES.CART, { keyPath: 'id' });
        }

        // Create cart items store
        if (!db.objectStoreNames.contains(STORES.CART_ITEMS)) {
          const cartItemsStore = db.createObjectStore(STORES.CART_ITEMS, {
            keyPath: 'id',
          });
          cartItemsStore.createIndex('cartId', 'cartId', { unique: false });
        }

        // Create addresses store
        if (!db.objectStoreNames.contains(STORES.ADDRESSES)) {
          const addressStore = db.createObjectStore(STORES.ADDRESSES, {
            keyPath: 'id',
          });
          addressStore.createIndex('userId', 'userId', { unique: false });
        }
      };
    });
  }

  /**
   * Get database instance
   */
  async getDB() {
    if (!this.db) {
      await this.init();
    }
    return this.db;
  }

  /**
   * Generic method to add/update data
   */
  async put(storeName, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.getDB();
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generic method to get data by key
   */
  async get(storeName, key) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.getDB();
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generic method to get all data
   */
  async getAll(storeName, indexName = null, query = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.getDB();
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const source = indexName ? store.index(indexName) : store;
        const request = source.getAll(query);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generic method to delete data
   */
  async delete(storeName, key) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.getDB();
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generic method to clear store
   */
  async clear(storeName) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.getDB();
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============================================
  // RESTAURANTS METHODS
  // ============================================

  async cacheRestaurants(restaurants) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.getDB();
        const transaction = db.transaction([STORES.RESTAURANTS], 'readwrite');
        const store = transaction.objectStore(STORES.RESTAURANTS);

        // Clear existing data
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
          // Add all restaurants
          let completed = 0;
          const total = restaurants.length;
          
          if (total === 0) {
            resolve();
            return;
          }

          restaurants.forEach((restaurant) => {
            const putRequest = store.put({
              ...restaurant,
              cachedAt: new Date().toISOString(),
            });
            putRequest.onsuccess = () => {
              completed++;
              if (completed === total) {
                resolve();
              }
            };
            putRequest.onerror = () => reject(putRequest.error);
          });
        };
        clearRequest.onerror = () => reject(clearRequest.error);
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getCachedRestaurants(status = null) {
    if (status) {
      return new Promise(async (resolve, reject) => {
        try {
          const db = await this.getDB();
          const transaction = db.transaction([STORES.RESTAURANTS], 'readonly');
          const store = transaction.objectStore(STORES.RESTAURANTS);
          const index = store.index('status');
          const request = index.getAll(status);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        } catch (error) {
          reject(error);
        }
      });
    }
    return this.getAll(STORES.RESTAURANTS);
  }

  // ============================================
  // MENUS METHODS
  // ============================================

  async cacheMenus(menus, restaurantId = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.getDB();
        const transaction = db.transaction([STORES.MENUS], 'readwrite');
        const store = transaction.objectStore(STORES.MENUS);

        const clearAndAdd = () => {
          // Add all menus
          let completed = 0;
          const total = menus.length;
          
          if (total === 0) {
            resolve();
            return;
          }

          menus.forEach((menu) => {
            const putRequest = store.put({
              ...menu,
              cachedAt: new Date().toISOString(),
            });
            putRequest.onsuccess = () => {
              completed++;
              if (completed === total) {
                resolve();
              }
            };
            putRequest.onerror = () => reject(putRequest.error);
          });
        };

        // If restaurantId provided, clear only that restaurant's menus
        if (restaurantId) {
          const index = store.index('restaurantId');
          const request = index.openCursor(IDBKeyRange.only(restaurantId));
          let deleteCount = 0;
          let hasItems = false;
          
          request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              hasItems = true;
              cursor.delete();
              deleteCount++;
              cursor.continue();
            } else {
              // All deletions complete, now add menus
              clearAndAdd();
            }
          };
          request.onerror = () => reject(request.error);
          
          // If no items to delete, proceed to add
          setTimeout(() => {
            if (!hasItems) {
              clearAndAdd();
            }
          }, 100);
        } else {
          // Clear all menus
          const clearRequest = store.clear();
          clearRequest.onsuccess = () => clearAndAdd();
          clearRequest.onerror = () => reject(clearRequest.error);
        }
        
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getCachedMenus(restaurantId = null) {
    if (restaurantId) {
      return new Promise(async (resolve, reject) => {
        try {
          const db = await this.getDB();
          const transaction = db.transaction([STORES.MENUS], 'readonly');
          const store = transaction.objectStore(STORES.MENUS);
          const index = store.index('restaurantId');
          const request = index.getAll(restaurantId);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        } catch (error) {
          reject(error);
        }
      });
    }
    return this.getAll(STORES.MENUS);
  }

  // ============================================
  // CART METHODS
  // ============================================

  async cacheCart(cart) {
    return this.put(STORES.CART, {
      ...cart,
      cachedAt: new Date().toISOString(),
    });
  }

  async getCachedCart() {
    const carts = await this.getAll(STORES.CART);
    return carts.length > 0 ? carts[0] : null;
  }

  async cacheCartItems(items) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.getDB();
        const transaction = db.transaction([STORES.CART_ITEMS], 'readwrite');
        const store = transaction.objectStore(STORES.CART_ITEMS);

        // Clear existing items
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
          // Add all items
          let completed = 0;
          const total = items.length;
          
          if (total === 0) {
            resolve();
            return;
          }

          items.forEach((item) => {
            const putRequest = store.put({
              ...item,
              cachedAt: new Date().toISOString(),
            });
            putRequest.onsuccess = () => {
              completed++;
              if (completed === total) {
                resolve();
              }
            };
            putRequest.onerror = () => reject(putRequest.error);
          });
        };
        clearRequest.onerror = () => reject(clearRequest.error);
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getCachedCartItems(cartId = null) {
    if (cartId) {
      return new Promise(async (resolve, reject) => {
        try {
          const db = await this.getDB();
          const transaction = db.transaction([STORES.CART_ITEMS], 'readonly');
          const store = transaction.objectStore(STORES.CART_ITEMS);
          const index = store.index('cartId');
          const request = index.getAll(cartId);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        } catch (error) {
          reject(error);
        }
      });
    }
    return this.getAll(STORES.CART_ITEMS);
  }

  async addCartItem(item) {
    return this.put(STORES.CART_ITEMS, {
      ...item,
      cachedAt: new Date().toISOString(),
    });
  }

  async removeCartItem(itemId) {
    return this.delete(STORES.CART_ITEMS, itemId);
  }

  async clearCart() {
    await this.clear(STORES.CART_ITEMS);
    await this.clear(STORES.CART);
  }

  // ============================================
  // ADDRESSES METHODS
  // ============================================

  async cacheAddresses(addresses) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.getDB();
        const transaction = db.transaction([STORES.ADDRESSES], 'readwrite');
        const store = transaction.objectStore(STORES.ADDRESSES);

        // Clear existing addresses
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => {
          // Add all addresses
          let completed = 0;
          const total = addresses.length;
          
          if (total === 0) {
            resolve();
            return;
          }

          addresses.forEach((address) => {
            const putRequest = store.put({
              ...address,
              cachedAt: new Date().toISOString(),
            });
            putRequest.onsuccess = () => {
              completed++;
              if (completed === total) {
                resolve();
              }
            };
            putRequest.onerror = () => reject(putRequest.error);
          });
        };
        clearRequest.onerror = () => reject(clearRequest.error);
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getCachedAddresses(userId = null) {
    if (userId) {
      return new Promise(async (resolve, reject) => {
        try {
          const db = await this.getDB();
          const transaction = db.transaction([STORES.ADDRESSES], 'readonly');
          const store = transaction.objectStore(STORES.ADDRESSES);
          const index = store.index('userId');
          const request = index.getAll(userId);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        } catch (error) {
          reject(error);
        }
      });
    }
    return this.getAll(STORES.ADDRESSES);
  }

  async addAddress(address) {
    return this.put(STORES.ADDRESSES, {
      ...address,
      cachedAt: new Date().toISOString(),
    });
  }

  async removeAddress(addressId) {
    return this.delete(STORES.ADDRESSES, addressId);
  }
}

// Export singleton instance
export default new IndexedDBService();

