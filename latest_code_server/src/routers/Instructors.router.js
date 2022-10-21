const express = require('express');
const router = express.Router();

const { userAuthorization, roleBase } = require('../middleware/authorization.middleware');
const { processEmail } = require('../helpers/email.helper');
const {
  insertInstructor,
  getInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor
} = require('../models/instructor/Instructors.model')

router.get('/', userAuthorization, async (req, res) => {
  try {
    const instructors = await getInstructors();
    return res.json({ status: 'success', instructors });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

router.get('/:_id', userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const instructor = await getInstructorById({ _id });
    return res.json({ status: 'success', instructor });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

router.post('/insert', userAuthorization, roleBase('admin'), async (req, res) => {
  try {
    const { name, bio, country, school, position, experience} = req.body;
    const newObj = {
      postedBy: req.userId,
      name, bio, country, school, position, experience,
    }
    const instructor = await insertInstructor(newObj);
    if (instructor._id) {
      //await processEmail({ email, type: 'daily-report' }); //add verification later
      return res.json({
        status: 'success',
        message: 'Instructor Created!',
        instructor,
      });
    }
    return res.json({
      status: 'error',
      message: 'Unable to create instructor',
    });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
});

router.put('/update/:_id', userAuthorization, roleBase('admin'), async (req, res) => {
  try {
    const instructorBody = ({ bio, country, school, position, experience } = req.body);
    const { _id } = req.params;
    const result = await updateInstructor(_id, instructorBody);
    if (result._id) {
      return res.json({
        status: 'success',
        message: 'The instructor has been updated',
      });
    }
    res.json({
      status: 'error',
      message: 'Unable to update instructor',
    });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

router.delete('/:_id', userAuthorization, roleBase('admin'), async (req, res) => {
  const { _id } = req.params;
  await deleteInstructor({ _id });

  return res.json({ status: 'success', message: 'Instructor deleted' });
});

module.exports = router;
