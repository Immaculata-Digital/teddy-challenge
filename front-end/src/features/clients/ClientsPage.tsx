import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '../../shared/hooks/useClients';
import { useSnackbar } from '../../shared/contexts/SnackbarContext';
import { ClientCard } from './components/ClientCard';
import { ClientModal } from './components/ClientModal';
import { ConfirmModal } from '../../shared/components/ConfirmModal';
import { Pagination } from './components/Pagination';
import { IClient, CreateClientDto } from '@teddy/shared';
import './ClientsPage.css';

export const ClientsPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const {
    clients,
    total,
    page,
    totalPages,
    loading,
    error,
    limit,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    incrementViews,
  } = useClients();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: IClient) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleViewDetails = (client: IClient) => {
    navigate(`/clients/${client.uuid}`);
  };

  const handleSubmit = async (data: CreateClientDto) => {
    if (selectedClient) {
      await updateClient(selectedClient.uuid, data);
    } else {
      await createClient(data);
    }
  };

  const handleDeleteClick = (uuid: string) => {
    const client = clients.find(c => c.uuid === uuid);
    if (client) {
      setSelectedClient(client);
      setIsConfirmDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedClient) return;
    
    try {
      await deleteClient(selectedClient.uuid);
      showSuccess('Cliente excluído com sucesso!');
    } catch (error: any) {
      showError(error.message || 'Erro ao excluir cliente');
    }
  };

  return (
    <div className="clients-container">
      <header className="clients-header">
        <div className="clients-count">
          <strong>{total}</strong> clientes encontrados:
        </div>
        <div className="clients-per-page">
          Clientes por página:
          <select 
            value={limit} 
            onChange={(e) => fetchClients(1, parseInt(e.target.value))}
          >
            <option value={16}>16</option>
            <option value={32}>32</option>
            <option value={48}>48</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">Carregando clientes...</div>
      ) : clients.length > 0 ? (
        <div className="clients-grid">
          {clients.map((client) => (
            <ClientCard
              key={client.uuid}
              client={client}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteClick}
              onView={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">Nenhum cliente encontrado.</div>
      )}

      <div className="create-client-btn-row">
        <button className="btn-large-outline" onClick={handleOpenCreateModal}>
          Criar cliente
        </button>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => fetchClients(newPage, limit)}
      />

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        client={selectedClient}
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="Excluir Cliente"
        message={`Deseja realmente excluir o cliente ${selectedClient?.name}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </div>
  );
};
