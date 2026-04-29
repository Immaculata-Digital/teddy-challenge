import React from 'react';
import { IClient } from '@teddy/shared';
import './ClientModal.css';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: IClient | null;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ isOpen, onClose, client }) => {
  if (!isOpen || !client) return null;

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const formatDate = (dateStr: string | Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalhes do Cliente</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="client-details">
          <div className="detail-row">
            <strong>Nome:</strong>
            <span>{client.name}</span>
          </div>
          <div className="detail-row">
            <strong>Salário:</strong>
            <span>{formatCurrency(client.salary)}</span>
          </div>
          <div className="detail-row">
            <strong>Valor da Empresa:</strong>
            <span>{formatCurrency(client.companyValue)}</span>
          </div>
          <div className="detail-row">
            <strong>Visualizações:</strong>
            <span className="views-badge">{client.views}</span>
          </div>
          <div className="detail-row">
            <strong>ID Sequencial:</strong>
            <span>{client.seqid}</span>
          </div>
          <div className="detail-row">
            <strong>UUID:</strong>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>{client.uuid}</span>
          </div>
          <div className="detail-row">
            <strong>Criado em:</strong>
            <span>{formatDate(client.createdAt)}</span>
          </div>
        </div>

        <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-large-outline" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};
