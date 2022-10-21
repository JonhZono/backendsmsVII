const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewContentSchema = new Schema({
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'ClassCode',
    require: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = {
  ReviewContentSchema: mongoose.model('ReviewContent', ReviewContentSchema),
};

//
