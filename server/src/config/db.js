import dns from 'dns';
import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

// Node.js inherits its DNS servers from the OS network config. On some Windows
// dev machines (post-Docker/WSL uninstall) this ends up as 127.0.0.1 with
// nothing listening, breaking SRV lookups. Override to reliable public resolvers.
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    if (env.isProd) process.exit(1);
    logger.warn('Continuing without MongoDB (development mode). Set a valid MONGO_URI to enable DB.');
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
