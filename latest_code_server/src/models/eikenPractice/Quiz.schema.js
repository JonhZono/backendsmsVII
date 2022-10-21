const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  quizType: {
    type: String,
    required: true,
    default: 'Eiken Grade 5', //drop down from front end 'Eiken Grade 5, 4, 3, pre 2, 2, pre 1, 1'
  },

  title: {
    type: String,
    required: true,
  },
  totalAttempt: {
    type: Number,
    default: 0,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],

  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = {
  QuizSchema: mongoose.model('Quiz', QuizSchema),
};
