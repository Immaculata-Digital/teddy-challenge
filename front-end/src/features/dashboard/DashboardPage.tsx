import React, { useEffect, useState } from 'react';
import { useAuth } from '../../shared/contexts/AuthContext';
import { metricsService } from '../../shared/services/metrics.service';
import { IDashboardMetrics } from '@teddy/shared';
import './DashboardPage.css';

const formatCurrency = (value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
};

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

export function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<IDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await metricsService.getDashboard();
        setMetrics(data);
      } catch (err) {
        console.error('Erro ao carregar métricas:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Carregando dashboard...</div>;
  }

  const maxDistribution = Math.max(
    ...(metrics?.salaryDistribution?.map((d) => d.count) || [1]),
    1,
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-greeting">
        <h1>Olá, {user?.fullName || 'Usuário'}!</h1>
        <p>Aqui está o resumo dos seus clientes.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-label">Total de Clientes</p>
          <p className="kpi-value">{metrics?.totalClients ?? 0}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Salário Médio</p>
          <p className="kpi-value">{formatCurrency(metrics?.avgSalary ?? 0)}</p>
          <p className="kpi-sub">
            Min: {formatCurrency(metrics?.minSalary ?? 0)} • Max: {formatCurrency(metrics?.maxSalary ?? 0)}
          </p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Valor Médio de Empresa</p>
          <p className="kpi-value">{formatCurrency(metrics?.avgCompanyValue ?? 0)}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Valor Total em Empresas</p>
          <p className="kpi-value">{formatCurrency(metrics?.totalCompanyValue ?? 0)}</p>
          <p className="kpi-sub">Soma de todas as empresas</p>
        </div>
      </div>

      {/* Sections: Recent Clients + Chart */}
      <div className="dashboard-sections">
        {/* Últimos Clientes */}
        <div className="section-card">
          <h2>Últimos Clientes Cadastrados</h2>
          {metrics?.recentClients && metrics.recentClients.length > 0 ? (
            <ul className="recent-list">
              {metrics.recentClients.map((client) => (
                <li key={client.uuid} className="recent-item">
                  <div>
                    <div className="recent-name">{client.name}</div>
                    <div className="recent-date">{formatDate(client.createdAt)}</div>
                  </div>
                  <div className="recent-salary">
                    {formatCurrency(client.salary)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-recent">Nenhum cliente cadastrado ainda.</div>
          )}
        </div>

        {/* Gráfico de Distribuição Salarial */}
        <div className="section-card">
          <h2>Distribuição por Faixa Salarial</h2>
          <div className="chart-bars">
            {metrics?.salaryDistribution?.map((item, index) => (
              <div key={index} className="chart-bar-row">
                <span className="chart-bar-label">{item.label}</span>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill"
                    style={{
                      width: `${(item.count / maxDistribution) * 100}%`,
                    }}
                  />
                </div>
                <span className="chart-bar-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
