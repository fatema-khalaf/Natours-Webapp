const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, // to not send the password in the response
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only eork on CREATE or SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordCahngedAt: Date,
  PasswordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Encrypt (hash) password
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost on CPU of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next(); // when the password dosen't modified or the document is newly created don't do any thing
  this.passwordCahngedAt = Date.now() - 1000; // -1000 as the token takes more time to be created Video-136 17:00
  next();
});

// Check if user active
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Check the password
// this is an instance method, so it can be used in all db document Video-129 18:30
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordCahngedAt) {
    const changeTimeStamp = parseInt(
      this.passwordCahngedAt.getTime() / 1000,
      10
    );
    //console.log(changeTimeStamp, JWTTimestamp);
    return JWTTimestamp < changeTimeStamp;
  }
  // False means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  // encrypt token then store it in the DB (security majors)
  this.PasswordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.PasswordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expire after 10 minutes

  return resetToken;
};

// Create model
const User = mongoose.model('User', userSchema);
module.exports = User;
