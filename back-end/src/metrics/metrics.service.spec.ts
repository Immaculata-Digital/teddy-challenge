import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from '../clients/entities/client.entity';

describe('MetricsService', () => {
  let service: MetricsService;
  
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getRawOne: jest.fn().mockResolvedValue({
      avgSalary: '1000',
      totalSalary: '1000',
      avgCompanyValue: '10000',
      totalCompanyValue: '10000',
      maxSalary: '1000',
      minSalary: '1000',
    }),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(1),
  };

  const mockClientsRepo = {
    count: jest.fn().mockResolvedValue(1),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    find: jest.fn().mockResolvedValue([{
      uuid: 'test-uuid',
      name: 'Test Client',
      salary: 1000,
      companyValue: 10000,
      createdAt: new Date(),
    }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientsRepo,
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get metrics successfully', async () => {
    const metrics = await service.getMetrics();
    expect(metrics.totalClients).toBe(1);
    expect(metrics.avgSalary).toBe(1000);
    expect(metrics.recentClients).toHaveLength(1);
    expect(metrics.salaryDistribution).toBeDefined();
    expect(metrics.salaryDistribution.length).toBe(5); // 5 ranges
  });
});
