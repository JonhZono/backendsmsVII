const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListeningSchema = new Schema({
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
  },
  name: {
    type: String,
    required: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = {
  ListeningSchema: mongoose.model('Listening', ListeningSchema),
};

//level parent -> AA, BB, CC, DD, EE, FF, G1, G2, G3, G4, G5, G6
//     stars ***** -   speaking
//     stars ***** -   listening
//     stars ***** -   writing
//     stars ***** -   reading

//why don't we just write down only the specific point that students need to improve
