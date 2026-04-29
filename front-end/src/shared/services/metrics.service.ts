import { IDashboardMetrics } from '@teddy/shared';
import { fetchApi } from './api';

export const metricsService = {
  async getDashboard(): Promise<IDashboardMetrics> {
    return fetchApi('/metrics', { method: 'GET' });
  },
};
