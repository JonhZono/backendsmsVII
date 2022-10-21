const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//https://api.multiavatar.com/

const AdminInstructorProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    birthday: {
      //for birthday wish
      type: Date,
      required: true,
    },
    position: {
      type: String,
      require: true,
    },
    join: {
      type: Date,
    },
    address: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      default: 'Japan',
    },
    experience: {
      type: String,
    },
    bio: {
      type: String, //what do you like to do?
      require: true,
    },
    profileImg: {
      type: String,
      default: 'https://api.multiavatar.com/Binx Bond.svg',
    },
    social: {
      facebook: { type: String },
      lineID: { type: String },
      instagram: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = {
  AdminInstructorProfileSchema: mongoose.model(
    'AdminInstructorProfile',
    AdminInstructorProfileSchema
  ),
};
