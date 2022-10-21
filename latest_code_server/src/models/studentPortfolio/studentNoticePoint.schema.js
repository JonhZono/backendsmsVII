const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentNoticePointSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  enrollmentPurpose: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
  personality: {
    type: String,
    require: true,
  },
  englishLevel: {
    type: String,
    require: true,
  },
  homePolicyEdu: {
    type: String,
  },
  pointConsiderParents: {
    type: String,
  },
  entranceExamPlan: {
    type: String,
    require: true,
  },
});

module.exports = {
  StudentNoticePointSchema: mongoose.model(
    'StudentNoticePoint',
    StudentNoticePointSchema
  ),
};
