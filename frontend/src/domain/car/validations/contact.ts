import { z } from 'zod';

export const contactSchema = z.object({
  idCar: z.string(),
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .refine((val) => val.trim().split(' ').length >= 2, {
      message: 'Informe nome e sobrenome',
    }),
  email: z
    .string({ message: 'E-mail é obrigatório' })
    .email('E-mail inválido')
    .max(100, 'E-mail muito longo'),
  phone: z
    .string({ message: 'Telefone é obrigatório' })
    .min(10, 'Telefone deve ter no mínimo 10 dígitos')
    .regex(/^[0-9()\-\s]+$/, 'Telefone contém caracteres inválidos'),
  contactPreference: z.enum(['Telefone', 'E-mail', 'WhatsApp'] as const, {
    message: 'Selecione uma preferência de contato',
  }),
  bestTime: z.enum(['Manhã', 'Tarde', 'Noite', 'Qualquer horário'] as const).optional(),
  subject: z.enum(
    [
      'Informações gerais',
      'Agendamento de test drive',
      'Negociação de preço',
      'Financiamento',
      'Outro',
    ] as const,
    {
      message: 'Selecione o assunto',
    }
  ),
  message: z
    .string({ message: 'Mensagem é obrigatória' })
    .min(10, 'Mensagem muito curta (mínimo 10 caracteres)')
    .max(1000, 'Mensagem muito longa (máximo 1000 caracteres)'),
  financing: z.boolean(),
  newsletter: z.boolean(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'É necessário aceitar os termos de privacidade',
  }),
  captchaToken: z.string(),
});
