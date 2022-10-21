const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionTestPaperSchema = new Schema({
  startTime: { type: Date, default: Date.now() },
  testId: {
    type: Schema.Types.ObjectId,
    ref: 'TestPaper',
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  answers: [
    {
      isTrueAnswer: Boolean,
      essayAnswer: String,
      multipleChoiceAnswer: Number, //compare an index number in array
      fillBlanksAnswer: {
        variable: String,
        value: String,
      },

      speakingAnswer: String,
      unscrambleAnswer: String,
      spellingAnswer: {
        variable: String,
        value: String,
      },
      matchingRightWordAnswer: String, //TODO: not sure, rightWord can be an array of string return from frontend
      question: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    },
  ],
});

module.exports = {
  SubmissionTestPaperSchema: mongoose.model(
    'SubmissionTestPaper',
    SubmissionTestPaperSchema
  ),
};
