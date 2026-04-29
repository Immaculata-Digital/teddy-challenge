import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientCard } from './ClientCard';
import '@testing-library/jest-dom';

describe('ClientCard Component', () => {
  const mockClient = {
    uuid: 'test-uuid-123',
    name: 'João Silva',
    salary: 5000,
    companyValue: 100000,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('deve renderizar as informações do cliente corretamente', () => {
    render(
      <ClientCard 
        client={mockClient} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
        onView={vi.fn()} 
      />
    );

    expect(screen.getByText('João Silva')).toBeDefined();
    // Verifica formatação (pode conter R$ com espaço não separável)
    const cardText = screen.getByText(/João Silva/).parentElement?.textContent;
    expect(cardText).toMatch(/5\.000/);
    expect(cardText).toMatch(/100\.000/);
  });

  it('deve chamar as funções de callback ao clicar nos botões', () => {
    const onViewMock = vi.fn();
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();

    render(
      <ClientCard 
        client={mockClient} 
        onEdit={onEditMock} 
        onDelete={onDeleteMock} 
        onView={onViewMock} 
      />
    );

    const viewButton = screen.getByTitle('Visualizar');
    const editButton = screen.getByTitle('Editar');
    const deleteButton = screen.getByTitle('Excluir');

    fireEvent.click(viewButton);
    expect(onViewMock).toHaveBeenCalledWith(mockClient);
    expect(onViewMock).toHaveBeenCalledTimes(1);

    fireEvent.click(editButton);
    expect(onEditMock).toHaveBeenCalledWith(mockClient);
    
    fireEvent.click(deleteButton);
    expect(onDeleteMock).toHaveBeenCalledWith(mockClient.uuid);
  });
});
