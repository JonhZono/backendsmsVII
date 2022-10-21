const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventParticipantHistorySchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
  studentNote: {
    type: String,
    require: true,
  },
  gallery: {
    type: Array,
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
  EventParticipantHistorySchema: mongoose.model(
    'EventParticipantHistory',
    EventParticipantHistorySchema
  ),
};
