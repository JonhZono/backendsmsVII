const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResetPinSchema = new Schema({
  email: {
    type: String,
    required: true,
    maxLength: 50,
  },
  pin: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 6,
  },
  addedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = {
  ResetPinSchema: mongoose.model('ResetPin', ResetPinSchema),
};
