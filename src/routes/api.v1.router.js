const { Router } = require('express');
const multer = require('multer');
const sharp = require('sharp');

const userRouter = require('./users.router');
const reportRouter = require('./report.router');
const feedbackRouter = require('./feedback.router');
const AppError = require('../services/AppError');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadSinglePhoto = upload.single('image');

const resizePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a photo!'));
    }
    if (req.file.mimetype.split('/')[0] !== 'image') {
      return next(new AppError('Please upload a photo!'));
    }

    const file = await sharp(req.file.buffer)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./public/img/${Date.now() + Math.random()}.jpeg`);

    return res.status(200).json({ status: 'success', data: { image: file } });
  } catch (err) {
    return next(err);
  }
};

const router = Router();

router.use('/users', userRouter);
router.use('/reports', reportRouter);
router.use('/feedbacks', feedbackRouter);
router.route('/upload').post(uploadSinglePhoto, resizePhoto);

module.exports = router;
