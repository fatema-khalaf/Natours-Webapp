const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const app = express();

// For heroku configration
app.enable('trust proxy');

// Set up Pug engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARE
// Implement CORS
app.use(cors());

app.options('*', cors());
// 1) Set security HTTP headers, should be at the top 💥💥 I turned it off to make the map appear
//app.use(helmet());

// 2) Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) Limte api requst from one IP middelware
const limiter = rateLimit({
  // accept 100 requset from one IP in one hour
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requsets from this IP, please try again in an hour',
});
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// 4) Build in midddleware "body parser" to read data from body into req.body.
app.use(
  express.json({
    limit: '10kb', // don't accept data more than 10kb in body
  })
);
// app.use(express.urlencoded({ extended: true, limit: '10kb' })); // this middleware only for "updateUserData" function in viewsController
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: false
// }));
// app.use(bodyParser.urlencoded({ extended: true }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // prevent mongo query from be inserted to the DB

// Data sanitization against XSS
app.use(xss()); // prevent HTML code from be inserted to the DB

// Prevent parameter pollution -duplicate values like 'sort' cause errors-
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  })
);

// 5) Serving static files
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public'))); // path.join to correct any wrong path names

// 6) Set a request Time to each request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // requestTime can be any name, it is optional
  //console.log(req.cookies);
  next();
});

//app.use(compression());

// ROUTES
// Front end routes
app.use('/', viewRouter);
// API routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// To handle wrong URL request
// This must be at the end of the document Video-111 06:00
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'Fail';
  // err.statusCode = 404;
  //next(err); // this will skip all other middelware and emplements err middleware

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
