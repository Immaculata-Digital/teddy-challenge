import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { IDashboardMetrics } from '@teddy/shared';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
  ) {}

  async getMetrics(): Promise<IDashboardMetrics> {
    const [totalClients, aggregates, recentClients, salaryDistribution] =
      await Promise.all([
        this.clientsRepo.count({ where: { deleted: false } }),
        this.clientsRepo
          .createQueryBuilder('c')
          .where('c.deleted = :deleted', { deleted: false })
          .select('COALESCE(AVG(c.salary), 0)', 'avgSalary')
          .addSelect('COALESCE(SUM(c.salary), 0)', 'totalSalary')
          .addSelect('COALESCE(AVG(c.company_value), 0)', 'avgCompanyValue')
          .addSelect('COALESCE(SUM(c.company_value), 0)', 'totalCompanyValue')
          .addSelect('COALESCE(MAX(c.salary), 0)', 'maxSalary')
          .addSelect('COALESCE(MIN(c.salary), 0)', 'minSalary')
          .getRawOne(),
        this.clientsRepo.find({
          where: { deleted: false },
          order: { createdAt: 'DESC' },
          take: 5,
        }),
        this.getSalaryDistribution(),
      ]);

    return {
      totalClients,
      avgSalary: parseFloat(aggregates.avgSalary),
      totalSalary: parseFloat(aggregates.totalSalary),
      avgCompanyValue: parseFloat(aggregates.avgCompanyValue),
      totalCompanyValue: parseFloat(aggregates.totalCompanyValue),
      maxSalary: parseFloat(aggregates.maxSalary),
      minSalary: parseFloat(aggregates.minSalary),
      recentClients: recentClients.map((c) => ({
        uuid: c.uuid,
        name: c.name,
        salary: c.salary,
        companyValue: c.companyValue,
        createdAt: c.createdAt,
      })),
      salaryDistribution,
      timestamp: new Date().toISOString(),
    };
  }

  private async getSalaryDistribution() {
    const ranges = [
      { label: 'Até R$ 2.000', min: 0, max: 2000 },
      { label: 'R$ 2.000 - R$ 5.000', min: 2000, max: 5000 },
      { label: 'R$ 5.000 - R$ 10.000', min: 5000, max: 10000 },
      { label: 'R$ 10.000 - R$ 20.000', min: 10000, max: 20000 },
      { label: 'Acima de R$ 20.000', min: 20000, max: 999999999 },
    ];

    const distribution = await Promise.all(
      ranges.map(async (range) => {
        const count = await this.clientsRepo
          .createQueryBuilder('c')
          .where('c.salary >= :min AND c.salary < :max', {
            min: range.min,
            max: range.max,
          })
          .andWhere('c.deleted = false')
          .getCount();
        return { label: range.label, count };
      }),
    );

    return distribution;
  }
}
