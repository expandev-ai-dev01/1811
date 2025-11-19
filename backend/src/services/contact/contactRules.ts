import { dbRequest, ExpectedReturn } from '@/utils/database';
import { ContactCreateRequest, ContactCreateResponse } from './contactTypes';
import { sendEmail } from '@/utils/email';
import { logger } from '@/utils/logger';

/**
 * @summary
 * Validates the captcha token with external provider.
 * Currently a mock implementation.
 */
async function validateCaptcha(token: string): Promise<boolean> {
  // In production: Verify token with Google reCAPTCHA API
  // const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', ...);
  if (!token) return false;
  return true;
}

/**
 * @summary
 * Creates a new contact request, generates protocol, and sends confirmation emails.
 *
 * @function contactCreate
 * @module contact
 *
 * @param {ContactCreateRequest} params - Contact form data
 * @returns {Promise<ContactCreateResponse>} Created contact details
 */
export async function contactCreate(params: ContactCreateRequest): Promise<ContactCreateResponse> {
  // 1. Validate Captcha
  const isCaptchaValid = await validateCaptcha(params.captchaToken);
  if (!isCaptchaValid) {
    throw new Error('Invalid CAPTCHA');
  }

  // 2. Persist to Database
  const result = await dbRequest(
    '[functional].[spContactCreate]',
    {
      idAccount: params.idAccount,
      idCar: params.idCar,
      name: params.name,
      email: params.email,
      phone: params.phone,
      contactPreference: params.contactPreference,
      bestTime: params.bestTime || null,
      subject: params.subject,
      message: params.message,
      financing: params.financing,
      newsletter: params.newsletter,
      termsAccepted: params.termsAccepted,
      ipAddress: params.ipAddress,
    },
    ExpectedReturn.Multi,
    ['contact', 'car']
  );

  const contact = result.contact[0];
  const car = result.car[0];

  if (!contact) {
    throw new Error('Failed to create contact record');
  }

  // 3. Send Confirmation Email to User (Async - don't block response)
  const userEmailContent = `
    <h1>Olá, ${contact.name}!</h1>
    <p>Recebemos seu interesse no veículo <strong>${car.brand} ${car.model} (${car.year})</strong>.</p>
    <p><strong>Protocolo:</strong> ${contact.protocol}</p>
    <p><strong>Sua mensagem:</strong><br/>"${params.message}"</p>
    <p>Nossa equipe entrará em contato em até 24 horas úteis.</p>
    <p>Atenciosamente,<br/>Equipe Catálogo de Carros</p>
  `;

  sendEmail({
    to: contact.email,
    subject: `Confirmação de contato - ${car.model}`,
    html: userEmailContent,
  }).catch((err) => logger.error('Failed to send user confirmation email', err));

  // 4. Send Notification Email to Sales Team (Async)
  const salesEmailContent = `
    <h1>Novo Lead: ${car.brand} ${car.model}</h1>
    <p><strong>Cliente:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Telefone:</strong> ${params.phone}</p>
    <p><strong>Preferência:</strong> ${params.contactPreference}</p>
    <p><strong>Assunto:</strong> ${params.subject}</p>
    <p><strong>Mensagem:</strong> ${params.message}</p>
    <p><strong>Protocolo:</strong> ${contact.protocol}</p>
    <a href="#">Ver no Painel</a>
  `;

  // Assuming a configured sales email address
  const SALES_EMAIL = 'vendas@catalogocarros.com.br';
  sendEmail({
    to: SALES_EMAIL,
    subject: `Novo contato - ${car.model}`,
    html: salesEmailContent,
  }).catch((err) => logger.error('Failed to send sales notification email', err));

  return {
    contact,
    car,
    estimatedResponseTime: '24h úteis',
  };
}
