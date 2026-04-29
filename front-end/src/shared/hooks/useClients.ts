import { useState, useCallback, useEffect } from 'react';
import { IClient, IPagination, CreateClientDto, UpdateClientDto } from '@teddy/shared';
import { clientsService } from '../services/clients.service';

export function useClients() {
  const [pagination, setPagination] = useState<IPagination<IClient> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async (page = 1, limit = 16) => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientsService.getAll(page, limit);
      setPagination(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = async (data: CreateClientDto) => {
    try {
      await clientsService.create(data);
      await fetchClients(pagination?.page || 1, pagination?.limit || 16);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao criar cliente');
    }
  };

  const updateClient = async (uuid: string, data: UpdateClientDto) => {
    try {
      await clientsService.update(uuid, data);
      await fetchClients(pagination?.page || 1, pagination?.limit || 16);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao atualizar cliente');
    }
  };

  const deleteClient = async (uuid: string) => {
    try {
      await clientsService.delete(uuid);
      await fetchClients(pagination?.page || 1, pagination?.limit || 16);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Erro ao excluir cliente');
    }
  };

  const incrementViews = async (uuid: string) => {
    try {
      await clientsService.incrementViews(uuid);
      // Opcional: atualizar a lista para refletir o novo contador se necessário
      // Mas como é apenas visualização, talvez não precise de re-fetch imediato
      // para não causar flicker. No entanto, se o modal for mostrar o valor do banco,
      // podemos querer os dados atualizados.
      await fetchClients(pagination?.page || 1, pagination?.limit || 16);
    } catch (err: any) {
      console.error('Erro ao incrementar visualizações:', err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients: pagination?.data || [],
    total: pagination?.total || 0,
    page: pagination?.page || 1,
    limit: pagination?.limit || 16,
    totalPages: pagination?.totalPages || 0,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    incrementViews,
  };
}
