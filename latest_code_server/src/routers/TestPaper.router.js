const express = require('express');
const router = express.Router();
const {
  userAuthorization,
  roleBase,
} = require('../middleware/authorization.middleware');
const {
  addQuestion,
  editQuestion,
  getQuestion,
  getQuestions,
  removeQuestion,
} = require('../controllers/question.controller');
const {
  addTestPaper,
  editTestPaper,
  getTestPaperDetails,
  getTestPaper,
  getTestPapers,
  removeTestPaper,
  addQuestionToTestPaper,
  removeQuestionFromTestPaper,
  studentStartTestPaper,
} = require('../controllers/testPaper.controller');
const {
  studentSubmitTestPaper,
  editSubmission,
  getAllSubmissions,
  getAllSubmissionsForStudent,
  getAllSubmissionsForTestPaper,
  removeSubmission,
} = require('../controllers/submissionTestPaper.controller');

/**Question */
router.post(
  '/question',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  addQuestion
);
router.put(
  '/question',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  editQuestion
);
router.get(
  '/question/:qid',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  getQuestion
);
router.get(
  '/questions',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  getQuestions
);
router.delete(
  '/question/:qid',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  removeQuestion
);

/**Test Paper */
router.post(
  '/',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  addTestPaper
);
router.put(
  '/:tid',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  editTestPaper
);
router.get(
  '/:tid',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  getTestPaper
);
//use for update the test paper
router.get(
  '/test_details/:tid',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  getTestPaperDetails
);
router.get(
  '/',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  getTestPapers
);
router.delete(
  '/:tid',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  removeTestPaper
);
router.put(
  '/:tid/question',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  addQuestionToTestPaper
);
router.delete(
  '/:tid/question',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  removeQuestionFromTestPaper
);
router.post('/start/:tid', userAuthorization, studentStartTestPaper);

/**Student Submission TestPaper*/
//TODO: we will require student to login and system will generate list of test papers his/her level, then student click on view the test, then start the test
//the test paper show to the students if the teacher published the test to prevent student see the test paper before the test started
router.post(
  '/submission', 
  userAuthorization,
  studentSubmitTestPaper
);
router.get(
  '/submissions',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  getAllSubmissions
);
//TODO: how to edit the submission paper by giving a point to essay & speaking type question
router.put(
  '/submission/:sid/test/:tid',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  editSubmission
);
router.get(
  '/submissions/student/:studentId',
  userAuthorization,
  getAllSubmissionsForStudent
);
router.get(
  '/submissions/:tid',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  getAllSubmissionsForTestPaper
);
router.delete(
  '/submission/:sid',
  userAuthorization,
  roleBase(['admin']),
  removeSubmission
);

module.exports = router;
