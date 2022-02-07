const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const Booking = require('./../models/bookingModel');

const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId; // tour Id from URL params
  if (!req.body.user) req.body.user = req.user.id; // get the Loged in user Id from protect() function.
  console.log('😵', req.params);
  console.log('😵', req.body.tour);
  next();
};

exports.checkBookedTour = catchAsync(async (req, res, next) => {
  const book = await Booking.findOne({
    user: req.body.user,
    tour: req.body.tour,
  });
  if (!book) {
    return next(
      new AppError('You do not have permission to review this tour', 403)
    );
  }
  next();
});

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter);
//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

// exports.createReview = catchAsync(async (req, res, next) => {
//   if (!req.body.tour) req.body.tour = req.params.tourId; // tour Id from URL params
//   if (!req.body.user) req.body.user = req.user.id; // get the Loged in user Id from protect() function.
//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
