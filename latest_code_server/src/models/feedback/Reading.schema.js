const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReadingSchema = new Schema({
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Level', //level array object
  },
  name: {
    type: String,
    required: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = {
  ReadingSchema: mongoose.model('Reading', ReadingSchema),
};
