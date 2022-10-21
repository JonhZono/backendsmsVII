const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeeSchema = new Schema({
  gmail_lists: [{ //lists of email or single email
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  month: {
    type: String,
    required: true,
  },
  fee_template: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = {
  FeeSchema: mongoose.model('Fee', FeeSchema),
};
