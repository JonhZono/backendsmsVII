const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarkSchema = new Schema({
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  //Note: level, school & term will be implement a static drop information, no api call
  level: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  writing: {
    type: Number,
    max: 100,
    required: true,
  },
  reading: {
    type: Number,
    max: 100,
    required: true,
  },
  listening: {
    type: Number,
    max: 100,
    required: true,
  },
  speaking: {
    type: Number,
    max: 100,
    required: true,
  },
  comments: {
    type: String,
    required: true,
  },
  dateTaken: {
    type: String,
    required: true,
    default: Date.now(),
  },
  createdAt: {
    type: String,
    default: Date.now(),
  },
});

module.exports = {
  MarkSchema: mongoose.model('Mark', MarkSchema),
};
