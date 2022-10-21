const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LevelSchema = new Schema({
  name: {
    type: String,
    required: true, //[AA, BB...]
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = {
  LevelSchema: mongoose.model('Level', LevelSchema),
};
