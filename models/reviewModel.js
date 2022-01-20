const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    // to make virtuals properties appear in query results
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// make each combination of user and tour allways unique
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // populate() to emmbed the data of the document instade of the id
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// This method called static method we used it here because in static method this keyword points to the current model
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this point to the current model "ReviewModel"
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this.tour points to current review
  this.constructor.calcAverageRatings(this.tour); // Video-167 09:00
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.rev = await this.findOne();
  //console.log(this.rev);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.rev.constructor.calcAverageRatings(this.rev.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
