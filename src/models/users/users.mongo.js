const crypto = require('crypto');

const { Schema, model } = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide us your first name!'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address!'],
  },
  employeeId: {
    type: String,
    required: [true, 'Please provide your employee id!'],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number!'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: [8, 'Password must be at least 8 characters long!'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      // This only work on save method and create method !this
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  verifyToken: Number,
  role: { type: String, default: 'Employee' },
  isActive: { type: Boolean, default: false },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Document middleware => pre save hook
// This only work on save method and create method !this
userSchema.pre('save', async function (next) {
  // Only run this function if password modified
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Pre save hook runs before a document is saved in the database
userSchema.pre('save', function (next) {
  // Only run this function if password modified and document is not new
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 3000;
  next();
});

// Instance method available in all documents created with the model
userSchema.methods.createJWT = async function () {
  return await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTime) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTime < changedTime;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // Generate a token with crypto
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the token using crypto
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model('User', userSchema);
module.exports = User;
