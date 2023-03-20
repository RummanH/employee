const { Router } = require('express');

const userRouter = require('./users.router');
const reportRouter = require('./report.router');

const router = Router();

router.use('/users', userRouter);
router.use('/reports', reportRouter);

module.exports = router;
