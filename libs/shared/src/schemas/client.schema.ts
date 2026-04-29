import { z } from 'zod';

export const CreateClientSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  salary: z
    .number({ required_error: 'Salário é obrigatório' })
    .positive('Salário deve ser positivo'),
  companyValue: z
    .number({ required_error: 'Valor da empresa é obrigatório' })
    .positive('Valor da empresa deve ser positivo'),
});

export const UpdateClientSchema = CreateClientSchema.partial();

export type CreateClientInput = z.infer<typeof CreateClientSchema>;
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;
