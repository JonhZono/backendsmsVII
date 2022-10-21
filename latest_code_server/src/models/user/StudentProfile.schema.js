const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//https://api.multiavatar.com/

const StudentProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    contact: {
      type: Number,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    birthday: {
      //for birthday wish
      type: Date,
      required: true,
    },
    mother: {
      type: String,
      require: true,
    },
    father: {
      type: String,
      require: true,
    },
    admission: {
      type: Date,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    totalCoin: {
      type: Number,
    },
    badge: {
      type: String,
    },
    country: {
      type: String,
      default: 'Japan',
    },
    grade: {
      type: String,
      required: true,
    },
    sns: {
      type: Boolean,
      require: true,
    },
    profileImg: {
      type: String,
      default: 'https://api.multiavatar.com/Binx Bond.svg',
    },
  },
  { timestamps: true }
);

module.exports = {
  StudentProfileSchema: mongoose.model('StudentProfile', StudentProfileSchema),
};
