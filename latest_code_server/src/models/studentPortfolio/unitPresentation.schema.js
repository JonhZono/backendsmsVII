const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitPresentationSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  unit: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
  topic: {
    type: String,
    require: true,
  },
  url: {
    type: String,
    require: true,
  },
  teacherCmt: {
    type: String,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = {
  UnitPresentationSchema: mongoose.model(
    'UnitPresentation',
    UnitPresentationSchema
  ),
};
