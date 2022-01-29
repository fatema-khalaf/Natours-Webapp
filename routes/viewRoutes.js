const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

// Front end routes

router.use(viewsController.alerts);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.get('/home', authController.isLoggedIn, viewsController.getHome);
router.get(
  '/manage-tours',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getAlltours
);
router.get(
  '/add-tour',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getAddForm
);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );
module.exports = router;
