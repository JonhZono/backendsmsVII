const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EikenResultSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  grade: {
    type: String,
    require: true,
  },
  examDate: {
    type: Date,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  teacherCmt: {
    type: String,
  },
  imageCertificate: {
    type: String,
  },
  listening: {
    type: Number,
    require: true,
  },
  reading: {
    type: Number,
    require: true,
  },
  writing: {
    type: Number,
    require: true,
  },
  interview: {
    type: Number,
  },
  total: {
    type: Number,
    require: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = {
  EikenResultSchema: mongoose.model('EikenResult', EikenResultSchema),
};
