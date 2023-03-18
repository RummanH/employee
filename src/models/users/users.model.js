const ApiFeatures = require('../../services/ApiFeatures');
const User = require('./users.mongo');

async function saveUser(currentUser) {
  return await User.create(currentUser);
}

async function getOneUserById(_id) {
  return await User.findById(_id).select('+password');
}

async function getOneUserByEmail(email) {
  return await User.findOne({ email }).select('+password');
}

async function getOneUserByToken(hashedToken) {
  return await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
}

async function updateMe(_id, currentUpdate) {
  return await User.findByIdAndUpdate(_id, currentUpdate, {
    new: true,
    runValidators: true,
  });
}

async function getAllUsers(queryString) {
  const features = new ApiFeatures(User.find(), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  return await features.query;
}

async function updateUser(_id, currentUpdate) {
  return await User.findByIdAndUpdate(_id, currentUpdate, {
    new: true,
    runValidators: true,
  });
}

async function deleteUser(_id) {
  return await User.findByIdAndDelete(_id);
}

module.exports = {
  saveUser,
  getOneUserById,
  getOneUserByEmail,
  getOneUserByToken,
  updateMe,
  getAllUsers,
  updateUser,
  deleteUser,
};
