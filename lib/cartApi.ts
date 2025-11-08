import api from './axios';

export interface CartItemResponse {
  id: number;
  menuId: number;
  menuName: string;
  menuImage: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  restaurantId: number | null;
  restaurantName: string | null;
  items: CartItemResponse[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddItemToCartDto {
  menuId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

class CartAPI {
  /**
   * Get user's cart
   */
  async getCart(): Promise<CartResponse> {
    const response = await api.get<CartResponse>('/carts');
    return response.data;
  }

  /**
   * Add item to cart
   */
  async addItemToCart(menuId: number, quantity: number = 1): Promise<CartResponse> {
    const response = await api.post<CartResponse>('/carts/items', {
      menuId,
      quantity,
    });
    return response.data;
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(itemId: number, quantity: number): Promise<CartResponse> {
    const response = await api.put<CartResponse>(`/carts/items/${itemId}`, {
      quantity,
    });
    return response.data;
  }

  /**
   * Remove item from cart
   */
  async removeItemFromCart(itemId: number): Promise<CartResponse> {
    const response = await api.delete<CartResponse>(`/carts/items/${itemId}`);
    return response.data;
  }

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    await api.delete('/carts');
  }
}

export default new CartAPI();

