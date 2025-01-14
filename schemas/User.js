const { string } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactsSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  avatarURL: String,
  token: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
});

const User = mongoose.model('User', contactsSchema);

module.exports = { User };
