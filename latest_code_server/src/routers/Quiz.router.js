const express = require('express');
const router = express.Router();

const {
  userAuthorization,
  roleBase,
} = require('../middleware/authorization.middleware');
const { processEmail } = require('../helpers/email.helper');
const {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  insertQuestionToQuiz,
} = require('../models/eikenPractice/Quiz.model');
const QuizSchema = require('../models/eikenPractice/Quiz.schema');

router.get('/', userAuthorization, async (req, res) => {
  try {
    const quizzes = await getQuizzes();
    return res.json({ status: 'success', quizzes });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

router.get('/:_id', userAuthorization, async (req, res) => {
  try {
    QuizSchema.findById(req.param._id)
      .populate('questions', 'description')
      .exec()
      .then((quiz) => {
        if (!quiz) {
          return res.json({
            status: 'error',
            message: 'Quiz Not Found',
          });
        }
        res.json({
          status: 'success',
          quiz,
        });
      });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

router.post(
  '/create',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const quiz = await createQuiz(req.body);
      if (quiz._id) {
        //await processEmail({ email, type: 'daily-report' }); //add verification later
        return res.json({
          status: 'success',
          message: 'Quiz Created!',
          quiz,
        });
      }
      return res.json({
        status: 'error',
        message: 'Unable to create quiz',
      });
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);

router.put(
  '/update/:_id',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const quizBody = ({ tittle, question } = req.body);
      const { _id } = req.params;
      const quiz = await updateQuiz(_id, quizBody);
      if (quiz._id) {
        return res.json({
          status: 'success',
          message: 'The quiz has been updated',
        });
      }
      res.json({
        status: 'error',
        message: 'Unable to update quiz',
      });
    } catch (error) {
      res.json({ status: 'error', message: error.message });
    }
  }
);

router.put(
  '/insert/:_id/question/:question_id',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const { _id, question_id } = req.params;
      const quiz = await insertQuestionToQuiz(_id, question_id);

      return res.json({
        status: 'success',
        message: 'The question added to quiz successfully',
        quiz,
      });
    } catch (error) {
      res.json({ status: 'error', message: error.message });
    }
  }
);

//admin
router.delete(
  '/:_id',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    const { _id } = req.params;
    await deleteQuiz({ _id });

    return res.json({ status: 'success', message: 'Quiz deleted' });
  }
);

module.exports = router;
