const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  level: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
  },
  unit: {
    // type: Schema.Types.ObjectId,
    // ref: 'Unit',
    type: String,
  },
  eiken: {
    type: String,
  },
  difficulty: {
    type: String,
    required: true,
  },
  questionInstruction: {
    type: String,
    required: true,
  },
  img: { type: String }, // store image url
  point: {
    type: Number,
  },
  coin: {
    type: Number,
  },
  explanation: {
    type: String, //explain why it is the correct answer
  },
  hint: {
    type: String,
  },
  questionType: {
    type: String,
    enum: [
      'TRUE_FALSE',
      'MULTIPLE_CHOICES',
      'ESSAY',
      'FILL_BLANKS',
      'MATCHING',
      'SPEAKING',
      'UNSCRAMBLE',
      'SPELLING',
    ],
  },
  isTrue: {
    type: Boolean,
  },
  audio: { type: String }, //listening type of question can be same with multiple MULTIPLE_CHOICES
  choices: [{ type: Schema.Types.ObjectId, ref: 'Options' }],
  essay: {
    text: { type: String },
    minWord: { type: Number }, //answer
    maxWord: { type: Number },
  },
  unscramble: {
    text: { type: String },
    answer: { type: String }, //answer box for compare with student answer
  },
  wordBanks: { type: String }, //use for blanks type question
  blanks: [{ type: String }],
  /**["She like", "*1)=apple", "but her brother", "*2)=doesn't", "like apple."]
   * Note: text start with * will be a variable and without * just a normal text
   */
  spelling: [{ type: String }],
  matching: [{ leftWord: String, rightWord: String }],
  //audio url, can be store in aws or cloudinary or local HDD
  speaking: { type: String }, //speaking section, upload file to cloud S3 and store url in mongodb
});

module.exports = {
  QuestionSchema: mongoose.model('Question', QuestionSchema),
};

//TODO: Question schema for review lesson and learning vocab can be the same since it has coin and question timer 