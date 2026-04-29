import React from 'react';
import { IClient } from '@teddy/shared';
import './ClientCard.css';

interface ClientCardProps {
  client: IClient;
  onEdit: (client: IClient) => void;
  onDelete: (uuid: string) => void;
  onView: (client: IClient) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete, onView }) => {
  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  return (
    <div className="client-card">
      <h3 className="client-name">{client.name}</h3>
      <p className="client-info">Salário: {formatCurrency(client.salary)}</p>
      <p className="client-info">Empresa: {formatCurrency(client.companyValue)}</p>
      
      <div className="client-actions">
        <button className="action-btn" title="Visualizar" onClick={() => onView(client)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        <button className="action-btn" title="Editar" onClick={() => onEdit(client)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
        <button className="action-btn delete" title="Excluir" onClick={() => onDelete(client.uuid)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
