const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassStorySchema = new Schema({
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  level: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
  },
  filesImgVdo: {
    //either image or video type
    type: Array,
  },
  caption: {
    type: String,
    required: true,
  }, //will be implement rich text editor in front end
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('ClassStory', ClassStorySchema);
