import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/httpResponse';
import { contactCreate } from '@/services/contact/contactRules';
import { zId, zString } from '@/utils/zodValidation';

// Validation Schema for Contact Creation
export const createSchema = z.object({
  body: z.object({
    idCar: zId,
    name: zString
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres')
      .refine((val) => val.trim().split(' ').length >= 2, {
        message: 'Informe nome e sobrenome',
      }),
    email: zString.email('E-mail inválido').max(100),
    phone: zString
      .min(10, 'Telefone deve ter no mínimo 10 dígitos')
      .regex(/^[0-9()\-\s]+$/, 'Telefone contém caracteres inválidos'),
    contactPreference: z.enum(['Telefone', 'E-mail', 'WhatsApp']),
    bestTime: z.enum(['Manhã', 'Tarde', 'Noite', 'Qualquer horário']).optional(),
    subject: z.enum([
      'Informações gerais',
      'Agendamento de test drive',
      'Negociação de preço',
      'Financiamento',
      'Outro',
    ]),
    message: zString
      .min(10, 'Mensagem deve ter no mínimo 10 caracteres')
      .max(1000, 'Mensagem deve ter no máximo 1000 caracteres'),
    financing: z.boolean().default(false),
    newsletter: z.boolean().default(false),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'É necessário aceitar os termos de privacidade' }),
    }),
    captchaToken: zString,
  }),
});

/**
 * @api {post} /api/v1/external/public/contact Submit Contact Form
 * @apiName CreateContact
 * @apiGroup Contact
 * @apiVersion 1.0.0
 * @apiDescription Submits a contact form for a specific vehicle
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const DEFAULT_ACCOUNT_ID = 1;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    const body = req.body as z.infer<typeof createSchema>['body'];

    const result = await contactCreate({
      idAccount: DEFAULT_ACCOUNT_ID,
      ipAddress,
      ...body,
    });

    res.status(201).json(successResponse(result));
  } catch (error: any) {
    if (error.message === 'Invalid CAPTCHA') {
      res.status(400).json(errorResponse('Falha na verificação de segurança', 'CAPTCHA_ERROR'));
      return;
    }
    next(error);
  }
}
