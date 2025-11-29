import api from './axios';

export interface Address {
  id: number;
  userId: number;
  label: string;
  street: string;
  city: string;
  cityId?: number;
  province: string;
  postalCode?: string;
  zone?: number;
  note?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  label: string;
  street: string;
  city: string;
  cityId?: number;
  province: string;
  postalCode?: string;
  zone?: number;
  note?: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}

class AddressAPI {
  async getAll(): Promise<Address[]> {
    const response = await api.get('/addresses');
    return response.data;
  }

  async getById(id: number): Promise<Address> {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  }

  async create(data: CreateAddressDto): Promise<Address> {
    const response = await api.post('/addresses', data);
    return response.data;
  }

  async update(id: number, data: UpdateAddressDto): Promise<Address> {
    const response = await api.patch(`/addresses/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
  }

  async setDefault(id: number): Promise<Address> {
    const response = await api.patch(`/addresses/${id}/set-default`);
    return response.data;
  }
}

export const addressAPI = new AddressAPI();

