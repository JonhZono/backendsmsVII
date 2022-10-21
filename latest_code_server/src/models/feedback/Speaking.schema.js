const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpeakingSchema = new Schema({
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
  SpeakingSchema: mongoose.model('Speaking', SpeakingSchema),
};

//
