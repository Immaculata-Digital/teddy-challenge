import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientsService } from '../../../shared/services/clients.service';
import { IClient } from '@teddy/shared';
import './ClientDetailsPage.css';

export const ClientDetailsPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!uuid) return;
      try {
        setLoading(true);
        // Incrementa views ao entrar na página
        await clientsService.incrementViews(uuid);
        const data = await clientsService.getById(uuid);
        setClient(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar detalhes do cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [uuid]);

  if (loading) return <div className="details-loading">Carregando detalhes...</div>;
  if (error || !client) return <div className="details-error">{error || 'Cliente não encontrado'}</div>;

  return (
    <div className="client-details-container">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate('/clients')}>
          &larr; Voltar
        </button>
        <h1>Detalhes do Cliente</h1>
      </div>

      <div className="details-card">
        <div className="details-main-info">
          <div className="info-group">
            <label>Nome Completo</label>
            <p>{client.name}</p>
          </div>
          
          <div className="info-row">
            <div className="info-group">
              <label>Salário Mensal</label>
              <p className="highlight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(client.salary))}
              </p>
            </div>
            <div className="info-group">
              <label>Valor da Empresa</label>
              <p className="highlight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(client.companyValue))}
              </p>
            </div>
          </div>
        </div>

        <div className="details-stats">
          <div className="stat-item">
            <span className="stat-label">Visualizações</span>
            <span className="stat-value">{client.views}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Criado em</span>
            <span className="stat-value">
              {new Date(client.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Última atualização</span>
            <span className="stat-value">
              {new Date(client.updatedAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
