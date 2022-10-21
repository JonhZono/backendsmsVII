const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  level: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
    required: true,
  },
  classCodes: {
    type: Schema.Types.ObjectId,
    ref: 'ClassCode',
    required: true,
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 300,
  },
  note: {
    type: String,
    maxlength: 300,
  },
  //TODO: check if the teacher is an online.T & admin will be able to update the reviewFeedback in #frontEnd
  reviewFeedback: {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    //TODO:check if the content.length > 0 ? status= true : status=false
    content: {
      type: String,
      minLength: 100,
      maxlength: 300,
    },
    status: {
      type: Boolean,
      default: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  //TODO:review content should be automatically generated base on selected classCode in #frontend
  // reviewContent: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'ReviewContent',
  // },
  ratingS: {
    type: Number,
  },
  speakings: {
    type: Schema.Types.ObjectId, //speaking
    ref: 'Speaking',
  },
  ratingL: {
    type: Number,
  },
  listenings: {
    type: Schema.Types.ObjectId, //listening
    ref: 'Listening',
  },
  ratingW: {
    type: Number,
  },
  writings: {
    type: Schema.Types.ObjectId, //writing
    ref: 'Writing',
  },
  ratingR: {
    type: Number,
  },
  readings: {
    type: Schema.Types.ObjectId, //reading
    ref: 'Reading',
  },
  send: {
    type: Boolean,
    default: false,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  //cmt between parents and stuff
  comments: [
    {
      text: { type: String, maxlength: 500 },
      postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now() },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = {
  FeedbackSchema: mongoose.model('Feedback', FeedbackSchema),
};
