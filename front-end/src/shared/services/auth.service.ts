import { fetchApi } from './api';

export interface User {
  uuid: string;
  fullName: string;
  email: string;
  active: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  async login(credentials: any): Promise<AuthResponse> {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(data: any): Promise<AuthResponse> {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getProfile(): Promise<User> {
    return fetchApi('/auth/profile', {
      method: 'GET',
    });
  },
};
