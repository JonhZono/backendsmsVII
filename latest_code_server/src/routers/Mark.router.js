const express = require('express');
const router = express.Router();
const {
  insertMark,
  getMarks,
  getMarksByUserId,
  getMarkById,
  updateMark,
  deleteMark,
} = require('../models/mark/Mark.model');
const {
  userAuthorization,
  roleBase,
} = require('../middleware/authorization.middleware');

router.get(
  '/all',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  async (req, res) => {
    try {
      const marks = await getMarks();
      return res.json({ status: 'success', marks });
    } catch (error) {
      res.json({ status: 'error', message: error.message });
    }
  }
);

//each student get all marks
router.get('/', userAuthorization, async (req, res) => {
  try {
    const receiver = req.userId;
    const marks = await getMarksByUserId({ receiver });
    return res.json({ status: 'success', marks });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

//query base on userId & mark_id for each user
router.get('/:_id', userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const receiver = req.userId;
    const mark = await getMarkById({ _id, receiver });
    return res.json({ status: 'success', mark });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

//admin & teacher
router.post(
  '/insert',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  async (req, res) => {
    try {
      req.body.teacher = req.userId;
      const markObj = ({
        teacher,
        receiver, //will be fcmToken to push notification to user
        level,
        term,
        school,
        writing,
        reading,
        listening,
        speaking,
        comments,
        dateTaken,
      } = req.body);
      const newMark = await insertMark(markObj);
      if (newMark._id) {
        return res.json({
          status: 'success',
          message: 'Mark successfully created!',
          newMark,
        });
      }
      return res.json({
        status: 'error',
        message: 'Unable to create mark',
      });
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);

//update mark, teacher & admin
router.patch(
  '/update/:_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  async (req, res) => {
    try {
      const markObj = ({
        writing,
        reading,
        listening,
        speaking,
        comment,
        createdAt,
      } = req.body);
      const { _id } = req.params;
      //const user = req.userId;
      const markEdited = await updateMark(_id, markObj);
      console.log(markEdited);
      if (markEdited._id) {
        return res.json({
          status: 'success',
          message: 'The mark has been updated',
        });
      }
      res.json({
        status: 'error',
        message: 'Unable to update the mark',
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
    await deleteMark({ _id });
    return res.json({ status: 'success', message: 'Mark deleted' });
  }
);

module.exports = router;
