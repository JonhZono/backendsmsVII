const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  answers: [
    {
      multipleChoiceAnswer: Number,
      question: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    },
  ],
  percentageAnswer: {
    type: Number, //70% will pass
  },
  /*isPassed: {
    type: Boolean,
    default: false, //70%=true => passed
  },*/
  totalAttempt: {
    type: Number,
    //increment by 1 every time user try to take the quiz, increment happen unless same user_id with same quiz_id with
    //start from 1 if user_id take new quiz_id
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = {
  SubmissionSchema: mongoose.model('Submission', SubmissionSchema),
};
