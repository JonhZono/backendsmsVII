const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  descriptions: {
    type: String,
    required: true,
  },
  expired: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = {
  AnnouncementSchema: mongoose.model('Announcement', AnnouncementSchema),
};
