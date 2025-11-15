import axios from './axios';
import { API_BASE_URL } from './config';

export interface OrderItem {
  menuId: number;
  menuName: string;
  price: number;
  quantity: number;
}

export interface CreateOrderData {
  restaurantId: number;
  items: OrderItem[];
  deliveryAddress: string;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  deliveryFee?: number;
}

export const OrderAPI = {
  async createOrder(orderData: CreateOrderData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  },

  async getMyOrders() {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/my-orders`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching my orders:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  async getOrderDetail(orderId: number) {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching order detail:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch order detail');
    }
  },

  async trackOrder(orderNumber: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/track/${encodeURIComponent(orderNumber)}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Error tracking order:', error);
      throw new Error(error.response?.data?.message || 'Failed to track order');
    }
  },

  async trackOrderPublic(orderNumber: string) {
    try {
      // Public endpoint - no auth required
      const response = await fetch(`${API_BASE_URL}/orders/public/track/${encodeURIComponent(orderNumber)}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Resi tidak ditemukan');
      }
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      console.error('Error tracking order:', error);
      throw new Error(error.message || 'Resi tidak ditemukan');
    }
  },
};

export default OrderAPI;

