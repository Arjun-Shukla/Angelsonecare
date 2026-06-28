import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

import { env } from './config/env.js';
import { configurePassport } from './config/passport.js';
import apiRoutes from './routes/index.js';
import { notFound } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const clientDist = join(__dirname, '../../client/dist');

const app = express();

const ALLOWED_ORIGINS = [
  env.clientUrl,
  'https://www.angelsonecare.in',
  'https://angelsonecare.in',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

configurePassport(passport);
app.use(passport.initialize());

app.get('/health', (req, res) => res.status(200).json({ success: true, status: 'healthy' }));
app.get('/', (req, res) => res.status(200).json({ success: true, message: 'Angels One API' }));

app.use('/api', apiRoutes);

// Serve built React app in production
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // SPA fallback — let React Router handle client-side routes
  app.get('*', (req, res) => {
    res.sendFile(join(clientDist, 'index.html'));
  });
} else {
  app.use(notFound);
}

app.use(errorHandler);

export default app;
