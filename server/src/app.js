import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import { env } from './config/env.js';
import { configurePassport } from './config/passport.js';
import apiRoutes from './routes/index.js';
import { notFound } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors({
  origin: env.clientUrl,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure Google OAuth strategy then attach Passport to the request pipeline
configurePassport(passport);
app.use(passport.initialize());

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
