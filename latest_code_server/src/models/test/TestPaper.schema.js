const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestPaperSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      require: true,
    },
    instruction: {
      // type: Schema.Types.ObjectId,
      // ref: 'Instruction',
      type: String,
    },
    level: {
      type: Schema.Types.ObjectId,
      ref: 'Level',
    },
    testType: {
      type: String, //unit test or term test
      require: true,
    },
    duration: {
      type: Number,
    },
    handlingTeacher: [
      {
        type: Schema.Types.ObjectId, //implement multi-select dropdown or tags in frontend
        ref: 'User',
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    totalPoint: {
      type: Number,
      require: true,
    },
    passing: {
      type: Number,
      require: true,
    },
    goal: {
      //can be inside the student submission schema instead
      type: Number,
      require: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
  },
  { timestamps: true }
);

module.exports = {
  TestPaperSchema: mongoose.model('TestPaper', TestPaperSchema),
};
