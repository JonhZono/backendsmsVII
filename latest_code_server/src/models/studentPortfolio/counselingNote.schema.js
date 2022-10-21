const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounselingNoteSchema = new Schema({
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
  note: {
    type: String,
    require: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = {
  CounselingNoteSchema: mongoose.model('CounselingNote', CounselingNoteSchema),
};
