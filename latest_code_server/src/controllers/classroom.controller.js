const { ClassroomSchema } = require('../models/feedback/Classroom.schema');
const { UserSchema } = require('../models/user/User.schema');

const createClassroom = async (req, res) => {
  try {
    const classroom = await new ClassroomSchema({ name: req.body.name }).save();
    res.json(classroom);
  } catch (err) {
    console.log(err);
    res.status(400).send('Create classroom failed');
  }
};

const listsClassroom = async (req, res) => {
  const classrooms = await ClassroomSchema.find()
    .sort({ createdAt: -1 })
    .exec();
  res.json(classrooms);
};

const readClassroom = async (req, res) => {
  const classroom = await ClassroomSchema.findOne({
    _id: req.params._id,
  }).exec();
  res.json(classroom);
};

const updateClassroom = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await ClassroomSchema.findOneAndUpdate(
      { _id: req.params._id },
      { name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send('Classroom update failed');
  }
};

const removeClassroom = async (req, res) => {
  try {
    await ClassroomSchema.findOneAndDelete({ _id: req.params._id });
    res.json('Classroom deleted');
  } catch (err) {
    res.status(400).send('Classroom delete failed');
  }
};

const getChildStudentBaseLevelClassroom = (req, res) => {
  UserSchema.find({
    level: req.params.level_id,
    classroom: req.params.classroom_id,
  })
    .populate({
      path: 'receiver',
      select: { name: 1 },
    })
    .populate({
      path: 'classroom',
      select: { name: 1 },
    })
    .exec((err, receiver) => {
      if (err) console.log(err);
      res.json(receiver);
    });
};

module.exports = {
  createClassroom,
  listsClassroom,
  readClassroom,
  updateClassroom,
  removeClassroom,
  getChildStudentBaseLevelClassroom,
};
