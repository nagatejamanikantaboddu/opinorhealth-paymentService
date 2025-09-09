import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import config from './src/config/config.js';
import morgan from './src/config/morgan.js';
import routes from './src/routes/v1/index.js'; // this should load ONLY payment routes

const app = express();

// 🟢 Logging
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// 🛡 Security
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// 🛠 Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚡ Performance
app.use(compression());

// 🌍 CORS
app.use(cors());
app.options('*', cors());

// 📌 Routes (only Payment APIs inside routes)
app.use('/v1/api/', routes);

// ✅ Health check route
app.use('/', (req, res) => {
  res.json({ message: '✅ Payment Service is running', service: 'payment' });
});

// ❌ 404 handler
app.use((req, res, next) => {
  next(new Error(httpStatus.NOT_FOUND, 'Not found'));
});

// 🔴 Global error handler (optional, enable when you have errorHandler middleware)
// import { errorConverter, errorHandler } from './src/middlewares/error.js';
// app.use(errorConverter);
// app.use(errorHandler);

export default app;
