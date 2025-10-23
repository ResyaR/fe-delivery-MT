import { API_BASE_URL } from './config';

export class OngkirAPI {
  /**
   * Get all cities with optional search
   */
  static async getCities(search?: string) {
    try {
      const url = new URL(`${API_BASE_URL}/ongkir/cities`);
      if (search) {
        url.searchParams.append('search', search);
      }
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  /**
   * Get all available services
   */
  static async getServices() {
    try {
      const response = await fetch(`${API_BASE_URL}/ongkir/services`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  /**
   * Calculate shipping cost by zone
   */
  static async calculateShippingCost(params: {
    originCityId: number;
    destCityId: number;
    serviceId: number;
    weight: number;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/ongkir/calculate-zone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to calculate shipping cost');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      throw error;
    }
  }
}

