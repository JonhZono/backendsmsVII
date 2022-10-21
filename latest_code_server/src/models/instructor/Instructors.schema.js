const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstructorsSchema = new Schema({
  postedBy:{ //populate req.userId from jwt and get email, name of user
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    maxlength: 100,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true, //GLI, Hiro, Masuki
  },
  position: {
    type: String,
    required: true, //full time, part time, admin, online teacher
  },
  experience: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = {
  InstructorsSchema: mongoose.model('Instructors', InstructorsSchema),
};