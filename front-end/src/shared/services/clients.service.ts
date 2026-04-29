import { IClient, IPagination, CreateClientDto, UpdateClientDto } from '@teddy/shared';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
});

// Interceptor para adicionar o token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const clientsService = {
  async getAll(page = 1, limit = 16): Promise<IPagination<IClient>> {
    const response = await api.get<IPagination<IClient>>('/clients', {
      params: { page, limit },
    });
    return response.data;
  },

  async getById(uuid: string): Promise<IClient> {
    const response = await api.get<IClient>(`/clients/${uuid}`);
    return response.data;
  },

  async create(data: CreateClientDto): Promise<IClient> {
    const response = await api.post<IClient>('/clients', data);
    return response.data;
  },

  async update(uuid: string, data: UpdateClientDto): Promise<IClient> {
    const response = await api.put<IClient>(`/clients/${uuid}`, data);
    return response.data;
  },

  async delete(uuid: string): Promise<void> {
    await api.delete(`/clients/${uuid}`);
  },

  async incrementViews(uuid: string): Promise<void> {
    await api.post(`/clients/${uuid}/view`);
  },
};
