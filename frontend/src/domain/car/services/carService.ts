import { publicClient } from '@/core/lib/api';
import type {
  CarListResponse,
  CarFilterParams,
  CarDetailResponse,
  ContactFormData,
} from '../types';

export const carService = {
  /**
   * @service Car
   * @domain Car
   * @description List cars with filters and pagination
   */
  async list(params: CarFilterParams): Promise<CarListResponse> {
    const { data } = await publicClient.get<CarListResponse>('/public/car', {
      params,
    });
    return data;
  },

  /**
   * @service Car
   * @domain Car
   * @description Get car details by ID
   */
  async getById(id: string): Promise<CarDetailResponse> {
    const { data } = await publicClient.get<CarDetailResponse>(`/public/car/${id}`);
    return data;
  },

  /**
   * @service Car
   * @domain Car
   * @description Send contact form for a vehicle
   */
  async sendContact(data: ContactFormData): Promise<void> {
    // Mock endpoint as it is not explicitly provided in backend files but required by spec
    await publicClient.post('/public/contact', data);
  },
};
