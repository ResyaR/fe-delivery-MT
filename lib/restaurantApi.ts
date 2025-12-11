import { API_BASE_URL } from './config';
import indexedDB from './indexedDB';

export const RestaurantAPI = {
  async getAllRestaurants(city?: string) {
    try {
      let url = `${API_BASE_URL}/restaurants?status=active`;
      if (city) {
        url += `&city=${encodeURIComponent(city)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch restaurants');
      
      const result = await response.json();
      const restaurants = result.data;
      
      // Cache restaurants to IndexedDB
      try {
        await indexedDB.cacheRestaurants(restaurants);
      } catch (cacheError) {
        console.warn('Failed to cache restaurants:', cacheError);
      }
      
      return restaurants;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      
      // Try to get from cache if online fetch fails
      try {
        const cached = await indexedDB.getCachedRestaurants('active');
        if (cached && cached.length > 0) {
          console.log('Using cached restaurants');
          return cached;
        }
      } catch (cacheError) {
        console.error('Error getting cached restaurants:', cacheError);
      }
      
      throw error;
    }
  },

  async getRestaurant(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
      if (!response.ok) throw new Error('Failed to fetch restaurant');
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      
      // Try to get from cache
      try {
        const cached = await indexedDB.get('restaurants', id);
        if (cached) {
          console.log('Using cached restaurant');
          return cached;
        }
      } catch (cacheError) {
        console.error('Error getting cached restaurant:', cacheError);
      }
      
      throw error;
    }
  },

  async getMenusByRestaurant(restaurantId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/menus/restaurant/${restaurantId}`);
      if (!response.ok) throw new Error('Failed to fetch menus');
      
      const result = await response.json();
      const menus = result.data;
      
      // Cache menus to IndexedDB
      try {
        await indexedDB.cacheMenus(menus, restaurantId);
      } catch (cacheError) {
        console.warn('Failed to cache menus:', cacheError);
      }
      
      return menus;
    } catch (error) {
      console.error('Error fetching menus:', error);
      
      // Try to get from cache
      try {
        const cached = await indexedDB.getCachedMenus(restaurantId);
        if (cached && cached.length > 0) {
          console.log('Using cached menus');
          return cached;
        }
      } catch (cacheError) {
        console.error('Error getting cached menus:', cacheError);
      }
      
      throw error;
    }
  },
};

export default RestaurantAPI;

