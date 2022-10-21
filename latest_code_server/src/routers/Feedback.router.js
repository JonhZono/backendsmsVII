const express = require('express');
const router = express.Router();
const {
  userAuthorization,
  roleBase,
} = require('../middleware/authorization.middleware');

/** controller*/
const {
  createFeedback,
  updateFeedback,
  updateSendFeedback,
  adminTeacherGetNewListsFeedback,
  adminTeacherGetSentListsFeedback,
  adminTeacherFeedbackById,
  adminTeacherGetDetailFeedback,
  getAverageRatingsEachSkillForStudent,
  filterAverageRatingsEachSkillForStudent,
  filterAverageRatingsEachSkillForAStudent,
  getAverageRatingsForEachSkill,
  studentGetListsFeedback,
  studentGetDetailFeedback,
  removeFeedback,
  pushComment,
  updateComment,
  getComment,
  deleteComment,
  updateReviewFeedback,
} = require('../controllers/feedback.controller');
const {
  createLevel,
  readLevel,
  updateLevel,
  removeLevel,
  listsLevel,
  getChildClassCode,
  getChildStudent,
  getChildListening,
  getChildReading,
  getChildWriting,
  getChildSpeaking,
} = require('../controllers/level.controller');
const {
  createClassroom,
  listsClassroom,
  readClassroom,
  updateClassroom,
  removeClassroom,
  getChildStudentBaseLevelClassroom,
} = require('../controllers/classroom.controller');
const {
  createClassCode,
  readClassCode,
  updateClassCode,
  removeClassCode,
  listsClassCode,
  getChildReviewContent,
} = require('../controllers/classCode.controller');
const {
  createReviewContent,
  readReviewContent,
  updateReviewContent,
  removeReviewContent,
  listsReviewContent,
} = require('../controllers/reviewContent.controller');
const {
  createListening,
  readListening,
  updateListening,
  removeListening,
  listsListening,
} = require('../controllers/listeningCmt.controller');
const {
  createSpeaking,
  readSpeaking,
  updateSpeaking,
  removeSpeaking,
  listsSpeaking,
} = require('../controllers/speakingCmt.controller');
const {
  createReading,
  readReading,
  updateReading,
  removeReading,
  listsReading,
} = require('../controllers/readingCmt.controller');
const {
  createWriting,
  readWriting,
  updateWriting,
  removeWriting,
  listsWriting,
} = require('../controllers/writingCmt.controller');

/**FEEDBACK*/
//TODO:_Create 'disable the send checkBox and fcmToken select drop down field in the #frontEnd if user is not an admin' - will show the receiver field
router.post(
  '/create',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  createFeedback
);
//TODO:_Update 'disable the send checkBox and fcmToken select drop down field in the #frontEnd if user is not an admin' - will show the receiver field
//FIXME:_push notification #frontEnd and #backEnd
router.put(
  '/update/:feedback_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  updateFeedback
);
router.patch(
  '/update/:feedback_id',
  userAuthorization,
  roleBase(['admin']),
  updateSendFeedback
);
router.get(
  '/new',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  adminTeacherGetNewListsFeedback
);
router.get(
  '/sent',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  adminTeacherGetSentListsFeedback
);
router.get(
  '/admin-instructor/:_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  adminTeacherFeedbackById
);
router.get(
  '/:feedback_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  adminTeacherGetDetailFeedback
);
router.get('/lists', userAuthorization, studentGetListsFeedback);
router.get('/detail/:_id', userAuthorization, studentGetDetailFeedback);
router.delete('/:_id', userAuthorization, roleBase(['admin']), removeFeedback);
router.put('/comment/:feedback_id', userAuthorization, pushComment);
router.get('/comment/:feedback_id/:comment_id', userAuthorization, getComment);
router.put(
  '/comment/:feedback_id/:comment_id',
  userAuthorization,
  updateComment
);
/**Add Review Feedback for online teacher and admin user */
router.put(
  '/review-feedback/:feedback_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  updateReviewFeedback
);
router.delete(
  '/comment/:feedback_id/:comment_id',
  userAuthorization,
  deleteComment
);
router.get(
  '/average-ratings/:receiver_id',
  userAuthorization,
  getAverageRatingsEachSkillForStudent
);
//for up to two students
router.get(
  '/filter/average-ratings',
  userAuthorization,
  filterAverageRatingsEachSkillForStudent
);
//for one student
router.get(
  '/filter/average-rating',
  userAuthorization,
  filterAverageRatingsEachSkillForAStudent
);
router.get(
  '/average-ratings',
  userAuthorization,
  getAverageRatingsForEachSkill
);
/**Classroom parent of Level Schema */
router.post(
  '/classroom',
  userAuthorization,
  roleBase(['admin']),
  createClassroom
);
router.get('/parent/classrooms', userAuthorization, listsClassroom);
router.get('/classroom/:_id', readClassroom);
router.get(
  '/classroom/child-student/:classroom_id/:level_id',
  getChildStudentBaseLevelClassroom
);
router.put(
  '/classroom/:_id',
  userAuthorization,
  roleBase(['admin']),
  updateClassroom
);
router.delete(
  '/classroom/:_id',
  userAuthorization,
  roleBase(['admin']),
  removeClassroom
);

/** LEVEL parents*/
router.post('/level', userAuthorization, roleBase(['admin']), createLevel);
router.get('/parent/levels', userAuthorization, listsLevel);
router.get('/level/:_id', readLevel);
router.get('/child-class-code/:parent_id', getChildClassCode);
router.get('/child-receiver/:parent_id', getChildStudent);
router.get('/child-listening/:parent_id', getChildListening);
router.get('/child-reading/:parent_id', getChildReading);
router.get('/child-writing/:parent_id', getChildWriting);
router.get('/child-speaking/:parent_id', getChildSpeaking);
router.put('/level/:_id', userAuthorization, roleBase(['admin']), updateLevel);
router.delete(
  '/level/:_id',
  userAuthorization,
  roleBase(['admin']),
  removeLevel
);

/* CLASS CODE*/
router.post(
  '/class-code',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  createClassCode
);
router.get('/class-codes', listsClassCode);
router.get('/class-code/:_id', readClassCode);
router.get('/child-review-content/:parent_id', getChildReviewContent);
router.put(
  '/class-code/:_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  updateClassCode
);
router.delete(
  '/class-code/:_id',
  userAuthorization,
  roleBase(['admin']),
  removeClassCode
);
/*Review Content Base on Class Code*/
router.post(
  '/review-content',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  createReviewContent
);
router.get('/review-contents', listsReviewContent);
router.get('/review-content/:_id', readReviewContent);
router.put(
  '/review-content/:_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  updateReviewContent
);
router.delete(
  '/review-content/:_id',
  userAuthorization,
  roleBase(['admin']),
  removeReviewContent
);

/*Listening */
router.post(
  '/listening',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  createListening
);
router.get('/listenings', listsListening);
router.get('/listening/:_id', readListening);
router.put(
  '/listening/:_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  updateListening
);
router.delete(
  '/listening/:_id',
  userAuthorization,
  roleBase(['admin']),
  removeListening
);

/*Speaking */
router.post(
  '/speaking',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  createSpeaking
);
router.get('/speakings', listsSpeaking);
router.get('/speaking/:_id', readSpeaking);
router.put(
  '/speaking/:_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  updateSpeaking
);
router.delete(
  '/speaking/:_id',
  userAuthorization,
  roleBase(['admin']),
  removeSpeaking
);

/*Reading */
router.post(
  '/reading',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  createReading
);
router.get('/readings', listsReading);
router.get('/reading/:_id', readReading);
router.put(
  '/reading/:_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  updateReading
);
router.delete(
  '/reading/:_id',
  userAuthorization,
  roleBase(['admin']),
  removeReading
);

/*Writing */
router.post(
  '/writing',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  createWriting
);
router.get('/writings', listsWriting);
router.get('/writing/:_id', readWriting);
router.put(
  '/writing/:_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  updateWriting
);
router.delete(
  '/writing/:_id',
  userAuthorization,
  roleBase(['admin']),
  removeWriting
);

module.exports = router;
