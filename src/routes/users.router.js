const { Router } = require('express');

const {
  httpSignupUser,
  httpLoginUser,
  httpForgotPassword,
  httpResetPassword,
  httpChangePassword,
  httpProtect,
} = require('../controllers/auth.controller');
const {
  httpUpdateMe,
  httpDeleteMe,
  httpGetAllUsers,
  httpGetOneUser,
  httpUpdateUser,
  httpDeleteUser,
} = require('../controllers/users.controller');
const catchAsync = require('../services/catchAsync');

const router = Router();

// Not RestFul for all users
router.route('/signup').post(catchAsync(httpSignupUser));
router.route('/login').post(catchAsync(httpLoginUser));
router.route('/forgotPassword').post(catchAsync(httpForgotPassword));
router.route('/resetPassword/:token').patch(catchAsync(httpResetPassword));

// For logged in users only

router.use(catchAsync(httpProtect));

router.route('/changePassword').patch(catchAsync(httpChangePassword));
router.route('/updateMe').patch(catchAsync(httpUpdateMe));
router.route('/deleteMe').delete(catchAsync(httpDeleteMe));

// RestFul routes may only used by administration
router.route('/').get(catchAsync(httpGetAllUsers));
router
  .route('/:_id')
  .get(catchAsync(httpGetOneUser))
  .patch(catchAsync(httpUpdateUser))
  .delete(catchAsync(httpDeleteUser));

module.exports = router;
