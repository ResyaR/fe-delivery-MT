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
};

export default OrderAPI;

