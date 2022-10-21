const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//https://api.multiavatar.com/

const UserSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    maxLength: 40,
  },
  email: {
    type: String,
    required: true,
    //unique: true,
    maxLength: 50,
  },
  gender: {
    type: String,
    default: 'Male',
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  //TODO:get receiver(students) base on the selected level in #frontEnd
  level: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: 'Classroom',
  },
  role: {
    type: String,
    required: true,
    default: 'student',
  },
  profileImage: {
    type: String,
    default:
      'https://s7img.carters.com/is/image/carters/car_Q1_2022_visualfilters_kg',
  },
  send: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  /**earningCoin: {
    type: Number,
    default: 0,
  },*/
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  refreshToken: {
    token: {
      type: String,
      maxlength: 1000,
      default: '',
    },
    addedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  /**retrieve token from each user when the first time they install the mobile app and store it here.
   * IOS use APN: need to ask permission
   * Android: don't need permission
   */
  fcmToken: {
    type: String,
    default: 'lsdkjfle9793fcmTokenFromClientDevicesjlsjfelf3979fsefjlajf',
  },
});

UserSchema.plugin(uniqueValidator);

module.exports = {
  UserSchema: mongoose.model('User', UserSchema),
};
