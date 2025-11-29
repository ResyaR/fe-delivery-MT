import { API_BASE_URL } from './config';

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
      return result.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
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
      throw error;
    }
  },

  async getMenusByRestaurant(restaurantId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/menus/restaurant/${restaurantId}`);
      if (!response.ok) throw new Error('Failed to fetch menus');
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching menus:', error);
      throw error;
    }
  },
};

export default RestaurantAPI;

