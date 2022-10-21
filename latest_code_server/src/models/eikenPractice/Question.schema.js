const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questionType: {
    type: String,
    required: true,
    default: 'Eiken Grade 5', //drop down from front end 'Eiken Grade 5, 4, 3, pre 2, 2, pre 1, 1'
  },
  description: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 1,
  },
  choices: [
    {
      text: String,
      required: true,
      isCorrect: Boolean,
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = {
  QuestionSchema: mongoose.model('Question', QuestionSchema),
};
