const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionsSchema = new Schema({
  text: { type: String, required: true },
  optImg: { type: String },
  correct: { type: Boolean, required: true },
});

module.exports = {
  OptionsSchema: mongoose.model('Options', OptionsSchema),
};
