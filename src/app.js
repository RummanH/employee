const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const express = require('express');
const xss = require('xss-clean');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const globalErrorHandler = require('./controllers/error.controller');
const apiV1Router = require('./routes/api.v1.router');
const AppError = require('./services/AppError');

const app = express();
app.use(express.static(path.join(__dirname, '..', 'public', 'img')));

// Set security HTTP headers


// Allowing cross origin resource sharing
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://safetyap.netlify.app',
      'https://apps-sos.com',
    ],
    credentials: true,
  })
);

// Limit requests from same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against NoSQL query injection
app.use(xss());

// Api routes
app.use('/api/v1', apiV1Router);

// Handling unhandled routes
app.all('*', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
);

app.use(globalErrorHandler);

module.exports = app;
