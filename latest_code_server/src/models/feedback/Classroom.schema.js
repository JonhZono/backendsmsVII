const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassroomSchema = new Schema({
  name: {
    type: String, //GLI Harumi, Online, Hiroo & Musashi Kosugi
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = {
  ClassroomSchema: mongoose.model('Classroom', ClassroomSchema),
};
