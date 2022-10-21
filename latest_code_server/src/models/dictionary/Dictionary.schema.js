const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DictionarySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  word: {
    type: String,
    maxlength: 40,
    required: true,
  },
  pronounce: {
    type: String,
    maxlength: 20,
    required: true,
    default: ' '
  },
  description: {
    type: String,
    maxlength: 1000,
    required: true,
  },
  example: {
    type: String,
    maxlength: 300,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = {
  DictionarySchema: mongoose.model('Dictionary', DictionarySchema),
};
