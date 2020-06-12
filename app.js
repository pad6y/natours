const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

// Start express appgit status
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
//
//GLOBAL MIDDLEWARE SECTION
// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

//SECURITY HTTP headers
app.use(helmet());
//Development logging
if (process.env.NODE_ENV === 'development') {
  // console.log(process.env.NODE_ENV);
  app.use(morgan('dev'));
}
//Limit request (express-rate-limit)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
// USED to retieve data for user form update (req.body)
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// app.use((req, res, next) => {
//   console.log('hello from the middleware');
//   next();
// });

// Test middleware (this logs the time in terminal/ console)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//Handling routes not found/ defined
app.all('*', (req, res, next) => {
  // const err = new Error(`Cant find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
