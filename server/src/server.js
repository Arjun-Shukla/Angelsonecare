import http from 'http';

import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/index.js';
import { verifyMailer } from './config/mailer.js';
import { logger } from './utils/logger.js';

// Prevent unhandled promise rejections from crashing the process (e.g. transient DB errors)
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled rejection: ${reason}`);
});

// Prevent uncaught sync exceptions from taking down the process
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
});

const start = async () => {
  try {
    const httpServer = http.createServer(app);
    initSocket(httpServer);

    // Track open sockets so we can destroy them instantly on shutdown,
    // freeing the port before nodemon starts the next process.
    const openSockets = new Set();
    httpServer.on('connection', (socket) => {
      openSockets.add(socket);
      socket.once('close', () => openSockets.delete(socket));
    });

    // Catch EADDRINUSE and other listen errors so nodemon doesn't crash-loop
    httpServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${env.port} is already in use — kill the existing process and restart.`);
      } else {
        logger.error(`HTTP server error: ${err.message}`);
      }
      process.exit(1);
    });

    // Bind the port first so Render detects it immediately, then connect DB
    httpServer.listen(env.port, '0.0.0.0', () => {
      logger.info(`Angels One API listening on port ${env.port} [${env.nodeEnv}]`);
    });

    await connectDB();
    await verifyMailer(); // already catches its own errors internally

    const shutdown = () => {
      logger.info('Shutting down...');
      // Destroy all keep-alive connections immediately so the port is freed
      // before nodemon spawns the next process.
      openSockets.forEach(s => s.destroy());
      httpServer.close(() => process.exit(0));
      // Force-exit fallback in case some connection outlives the close
      setTimeout(() => process.exit(0), 2000).unref();
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT',  shutdown);
    // nodemon sends SIGUSR2 on restart (Unix); on Windows it uses SIGTERM
    process.once('SIGUSR2', shutdown);
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

start();
