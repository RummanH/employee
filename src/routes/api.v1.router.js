const { Router } = require('express');

const userRouter = require('./users.router');
const reportRouter = require('./report.router');
const feedbackRouter = require('./feedback.router');

const router = Router();

router.use('/users', userRouter);
router.use('/reports', reportRouter);
router.use('/feedbacks', feedbackRouter);

module.exports = router;
