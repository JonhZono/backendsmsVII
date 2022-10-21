const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassCodeSchema = new Schema({
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
    require: true,
  },
  name: {
    type: String, //G1T1U1W1C1
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = {
  ClassCodeSchema: mongoose.model('ClassCode', ClassCodeSchema),
};
