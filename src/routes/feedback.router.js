const { Router } = require('express');
const { httpProtect } = require('../controllers/auth.controller');
const {
  httpGetAllFeedbacks,
  httpGetOneFeedback,
  httpUpdateFeedback,
  httpDeleteFeedback,
  httpCreateFeedback,
} = require('../controllers/feedback.controller');
const catchAsync = require('../services/catchAsync');

const router = Router();

router.use(catchAsync(httpProtect));

router
  .route('/')
  .get(catchAsync(httpGetAllFeedbacks))
  .post(catchAsync(httpCreateFeedback));
router
  .route('/:_id')
  .get(catchAsync(httpGetOneFeedback))
  .patch(catchAsync(httpUpdateFeedback))
  .delete(catchAsync(httpDeleteFeedback));

module.exports = router;
