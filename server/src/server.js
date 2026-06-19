import http from 'http';

import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/index.js';
import { logger } from './utils/logger.js';

const start = async () => {
  await connectDB();

  const httpServer = http.createServer(app);
  initSocket(httpServer);

  httpServer.listen(env.port, () => {
    logger.info(`Angels One API listening on port ${env.port} [${env.nodeEnv}]`);
  });

  const shutdown = () => {
    logger.info('Shutting down...');
    httpServer.close(() => process.exit(0));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

start();
