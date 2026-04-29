import React, { useState, useEffect } from 'react';
import { IClient, CreateClientDto } from '@teddy/shared';
import { maskCurrency, parseCurrencyToNumber } from '../../../shared/utils/currency';
import { useSnackbar } from '../../../shared/contexts/SnackbarContext';
import './ClientModal.css';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClientDto) => Promise<void>;
  client?: IClient | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSubmit, client }) => {
  const { showSuccess, showError } = useSnackbar();
  const [formData, setFormData] = useState<CreateClientDto>({
    name: '',
    salary: 0,
    companyValue: 0,
  });
  const [displaySalary, setDisplaySalary] = useState('');
  const [displayCompanyValue, setDisplayCompanyValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      const salary = Number(client.salary);
      const companyValue = Number(client.companyValue);
      setFormData({ name: client.name, salary, companyValue });
      setDisplaySalary(maskCurrency((salary * 100).toString()));
      setDisplayCompanyValue(maskCurrency((companyValue * 100).toString()));
    } else {
      setFormData({ name: '', salary: 0, companyValue: 0 });
      setDisplaySalary('');
      setDisplayCompanyValue('');
    }
  }, [client]);

  if (!isOpen) return null;

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCurrency(e.target.value);
    const numeric = parseCurrencyToNumber(masked);
    setDisplaySalary(masked);
    setFormData({ ...formData, salary: numeric });
  };

  const handleCompanyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCurrency(e.target.value);
    const numeric = parseCurrencyToNumber(masked);
    setDisplayCompanyValue(masked);
    setFormData({ ...formData, companyValue: numeric });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      showSuccess(client ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!');
      onClose();
    } catch (error: any) {
      showError(error.message || 'Erro ao salvar cliente');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{client ? 'Editar cliente:' : 'Criar cliente:'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Digite o nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Digite o salário"
              value={displaySalary}
              onChange={handleSalaryChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Digite o valor da empresa"
              value={displayCompanyValue}
              onChange={handleCompanyValueChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Salvando...' : client ? 'Salvar cliente' : 'Criar cliente'}
          </button>
        </form>
      </div>
    </div>
  );
};
