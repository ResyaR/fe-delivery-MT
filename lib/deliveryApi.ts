import api from './axios';

export interface DropLocationDto {
  sequence: number;
  locationName: string;
  address: string;
  recipientName?: string;
  recipientPhone?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateMultiDropDto {
  pickupLocation: string;
  dropLocations: DropLocationDto[];
  estimatedDistance: number;
  notes?: string;
  packageDescription?: string;
}

export interface CreateScheduledDeliveryDto {
  pickupLocation: string;
  dropoffLocation: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduleTimeSlot: string;
  barang?: {
    itemName: string;
    scale: string;
  };
  notes?: string;
}

export interface CreatePaketBesarDto {
  pickupLocation: string;
  dropoffLocation: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  category?: string;
  isFragile?: boolean;
  requiresHelper?: boolean;
  notes?: string;
  scheduledDate?: string;
  scheduleTimeSlot?: string;
}

export const DeliveryAPI = {
  // Create Multi-Drop Delivery
  async createMultiDrop(data: CreateMultiDropDto) {
    const response = await api.post('/delivery/multi-drop', data);
    return response.data;
  },

  // Create Scheduled Delivery
  async createScheduledDelivery(data: CreateScheduledDeliveryDto) {
    const response = await api.post('/delivery/scheduled', data);
    return response.data;
  },

  // Create Paket Besar Delivery
  async createPaketBesar(data: CreatePaketBesarDto) {
    const response = await api.post('/delivery/paket-besar', data);
    return response.data;
  },

  // Get drop locations for a delivery
  async getDropLocations(deliveryId: number) {
    const response = await api.get(`/delivery/${deliveryId}/drop-locations`);
    return response.data;
  },

  // Get delivery history
  async getHistory(type?: string) {
    const params = type ? { type } : {};
    const response = await api.get('/delivery/history', { params });
    return response.data;
  },

  // Get delivery details
  async getDeliveryDetails(id: number) {
    const response = await api.get(`/delivery/${id}`);
    return response.data;
  },
};

export default DeliveryAPI;

