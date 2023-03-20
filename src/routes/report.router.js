const { Router } = require('express');
const { httpProtect } = require('../controllers/auth.controller');
const {
  httpGetAllReports,
  httpGetOneReport,
  httpUpdateReport,
  httpDeleteReport,
  httpCreateReport,
} = require('../controllers/surveys.controller');
const catchAsync = require('../services/catchAsync');

const router = Router();

router.use(catchAsync(httpProtect));

router
  .route('/')
  .get(catchAsync(httpGetAllReports))
  .post(catchAsync(httpCreateReport));
router
  .route('/:_id')
  .get(catchAsync(httpGetOneReport))
  .patch(catchAsync(httpUpdateReport))
  .delete(catchAsync(httpDeleteReport));

module.exports = router;
