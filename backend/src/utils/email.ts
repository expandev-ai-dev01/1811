import { logger } from '@/utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * @summary
 * Mock email service to simulate sending emails without external dependencies.
 * In a real production environment, this would use a library like 'nodemailer' or an API client (SendGrid, AWS SES).
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    logger.info('📧 [MOCK EMAIL SENT]', {
      to: options.to,
      subject: options.subject,
      // Truncate body for logs
      bodyPreview: options.html.substring(0, 100) + '...',
    });

    return true;
  } catch (error) {
    logger.error('Failed to send email', error);
    return false;
  }
};
