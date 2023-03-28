const Report = require('../models/surveys/surveys.mongo');
const Feedback = require('../models/feedback/feedback.mongo');
const ApiFeatures = require('../services/ApiFeatures');
const AppError = require('../services/AppError');
const Email = require('../services/Email');
const User = require('../models/users/users.mongo');

async function httpCreateFeedback(req, res, next) {
  req.body.createdBy = req.user._id;
  const feedback = await Feedback.create(req.body);
  const report = await Report.findByIdAndUpdate(req.body.report, {
    isReviewed: true,
  });
  const reporter = await User.findById(report.createdBy);
  if (req.body.type === 'feedback') {
    await new Email(reporter, 'ut').sendFeToEm();
    await new Email(req.user, 'ut').sendFeToSf();
  }
  if (req.body.type === 'recommendation') {
    await new Email(reporter, 'ut').sendRecToEm();
    await new Email(req.user, 'ut').sendRecToSf();
  }

  return res.status(201).json({ status: 'success', data: { feedback } });
}

async function httpGetAllFeedbacks(req, res, next) {
  const features = new ApiFeatures(Feedback.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const feedbacks = await features.query;
  return res.status(200).json({ status: 'success', data: { feedbacks } });
}

async function httpUpdateFeedback(req, res, next) {
  const feedback = await Feedback.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!feedback) {
    return next(new AppError('Feedback not found!', 404));
  }
  return res.status(201).json({ status: 'success', data: { feedback } });
}

async function httpGetOneFeedback(req, res, next) {
  const feedback = await Feedback.findById(req.params._id);
  if (!feedback) {
    return next(new AppError('Feedback not found!', 404));
  }
  return res.status(200).json({ status: 'success', data: { feedback } });
}

async function httpDeleteFeedback(req, res, next) {
  const feedback = await Feedback.findByIdAndDelete(req.params._id);
  if (!feedback) {
    return next(new AppError('Feedback not found!', 404));
  }
  return res.status(204).json({ status: 'success', data: null });
}

module.exports = {
  httpCreateFeedback,
  httpGetAllFeedbacks,
  httpGetOneFeedback,
  httpUpdateFeedback,
  httpDeleteFeedback,
};
