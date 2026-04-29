import { IClient } from './client.interface';

export interface IDashboardMetrics {
  totalClients: number;
  avgSalary: number;
  totalSalary: number;
  avgCompanyValue: number;
  totalCompanyValue: number;
  maxSalary: number;
  minSalary: number;
  recentClients: Pick<IClient, 'uuid' | 'name' | 'salary' | 'companyValue' | 'createdAt'>[];
  salaryDistribution: {
    label: string;
    count: number;
  }[];
  timestamp: string;
}
