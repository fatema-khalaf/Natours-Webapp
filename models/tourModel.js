const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');
// Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, // remove white spaces from the end and the biggening
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal to 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'] // this allows only chars without spacing
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // only for strings
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // to display only one number after the point e.g. 2.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // This function creats a 💥BUG💥 => cant update price discount anymore
        validator: function (val) {
          // this only points to current doc on NEW document ceation
          return val < this.price; // return the result of " val < this.price", it will be false or true
        },
        message: 'Discount price ({VALUE}) should be below regular price', // ({VALUE}) is mongoose expretion NOT js
      },
    },
    summary: {
      type: String,
      trim: true, // remove white spaces from the end and the biggening
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJson
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array, // for emmbeding
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // to make virtuals properties appear in query results
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Create index, the best practice is to create index onle for the most reqested fields
//tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 }); // 1 for ascending order, -1 for descending order
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

////////////////////////////////////////////////////////////////
// Mongoose middleware
////////////////////////////////////////////////////////////////
// ALL THESE HOOKS OR MIDDLEWARE WRITTEN HERE TO FULFILL CLEAN
// FILE ARCHTECTUER FAT MODELS AND THIN CONTROLLERS. ALL
// BUSSINESS LOGIC MUST BE IN THE MODEL AND APPLICATION
// LOGIC MUST BE IN THE CONTROLLER.
///////////////////////////////////////////////////////////////

// Virtual prorerty
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; // this here reffers to the current js document (Tour model)
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
// Document middleware: runs before .save() and .create() and NOT insertMany()
// This called "PRE SAVE HOOK"
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // "this" here reffers to the current js document (Tour model)
  next();
});

tourSchema.post('save', function (doc, next) {
  console.log(doc); // the new saved document
  next();
});

// Save the useres documents in guids array insted of just useres ids, this is Emmbeding data model
// Just for example 👇👇
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  // /^find/ Video-105 08:30
  this.find({ secretTour: { $ne: true } }); // "this" here reffers to the query Object so we can chin query methods to it.
  this.start = Date.now(); // "this" here reffers to the query Object so we can set any property we want on it.
  next();
});

// query middleware ALL find qurey will execute this meddleware
tourSchema.pre(/^find/, function (next) {
  // populate() to emmbed the data of the document instade of the id
  this.populate({
    path: 'guides',
    select: '-__v -passwordCahngedAt',
  });
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   // console.log(docs);
//   next();
// });

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // unshift() to add element to the beginning of array
//   console.log(this.pipeline()); // "this" here reffers to agrigate query
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
