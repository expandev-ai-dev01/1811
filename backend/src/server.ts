import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from '@/config';
import { errorMiddleware } from '@/middleware/error';
import { notFoundMiddleware } from '@/middleware/notFound';
import apiRoutes from '@/routes';
import { logger } from '@/utils/logger';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors(config.api.cors));

// Request processing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFoundMiddleware);

// Error handling
app.use(errorMiddleware);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server gracefully');
  process.exit(0);
});

// Server startup
const server = app.listen(config.api.port, () => {
  logger.info(`Server running on port ${config.api.port} in ${process.env.NODE_ENV} mode`);
});

export default server;
