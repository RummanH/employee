const Report = require('../models/surveys/surveys.mongo');
const ApiFeatures = require('../services/ApiFeatures');
const AppError = require('../services/AppError');

async function httpCreateReport(req, res, next) {
  console.log(req.user);
  req.body.createdBy = req.user._id;
  console.log(req.body);
  const report = await Report.create(req.body);
  return res.status(201).json({ status: 'success', data: { report } });
}

async function httpGetAllReports(req, res, next) {
  const features = new ApiFeatures(Report.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reports = await features.query;
  return res.status(200).json({ status: 'success', data: { reports } });
}

async function httpUpdateReport(req, res, next) {
  const report = await Report.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!report) {
    return next(new AppError('Report not found!', 404));
  }
  return res.status(201).json({ status: 'success', data: { report } });
}

async function httpGetOneReport(req, res, next) {
  const report = await Report.findById(req.params._id);
  if (!report) {
    return next(new AppError('Report not found!', 404));
  }
  return res.status(200).json({ status: 'success', data: { report } });
}

async function httpDeleteReport(req, res, next) {
  const report = await Report.findByIdAndDelete(req.params._id);
  if (!report) {
    return next(new AppError('Report not found!', 404));
  }
  return res.status(204).json({ status: 'success', data: null });
}

module.exports = {
  httpCreateReport,
  httpGetAllReports,
  httpGetOneReport,
  httpUpdateReport,
  httpDeleteReport,
};
