const { LevelSchema } = require('../models/feedback/Level.schema');
const { ClassCodeSchema } = require('../models/feedback/ClassCode.schema');
const { UserSchema } = require('../models/user/User.schema');
const { ListeningSchema } = require('../models/feedback/Listening.schema');
const { WritingSchema } = require('../models/feedback/Writing.schema');
const { ReadingSchema } = require('../models/feedback/Reading.schema');
const { SpeakingSchema } = require('../models/feedback/Speaking.schema');

const createLevel = async (req, res) => {
  try {
    const level = await new LevelSchema({ name: req.body.name }).save();
    res.json(level);
  } catch (err) {
    console.log(err);
    res.status(400).send('Create level failed');
  }
};

const listsLevel = async (req, res) => {
  const levels = await LevelSchema.find().sort({ createdAt: -1 }).exec();
  res.json(levels);
};

const readLevel = async (req, res) => {
  const level = await LevelSchema.findOne({ _id: req.params._id }).exec();
  // const feedback = await Product.find({ category }).populate('category').exec();
  res.json({
    level,
  });
};

const updateLevel = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await LevelSchema.findOneAndUpdate(
      { _id: req.params._id },
      { name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send('Level update failed');
  }
};

const removeLevel = async (req, res) => {
  try {
    await LevelSchema.findOneAndDelete({ _id: req.params._id });
    res.json('Level deleted');
  } catch (err) {
    res.status(400).send('Level delete failed');
  }
};

//TODO:dynamic select dropdown at #frontend
const getChildClassCode = (req, res) => {
  ClassCodeSchema.find({ parent: req.params.parent_id }).exec((err, cc) => {
    if (err) console.log(err);
    res.json(cc);
  });
};
const getChildStudent = (req, res) => {
  UserSchema.find({ level: req.params.parent_id })
    .populate({
      path: 'receiver',
      select: { name: 1 },
    })
    .exec((err, receiver) => {
      if (err) console.log(err);
      res.json(receiver);
    });
};

const getChildListening = (req, res) => {
  ListeningSchema.find({ parent: req.params.parent_id }).exec((err, ls) => {
    if (err) console.log(err);
    res.json(ls);
  });
};

const getChildReading = (req, res) => {
  ReadingSchema.find({ parent: req.params.parent_id }).exec((err, rs) => {
    if (err) console.log(err);
    res.json(rs);
  });
};
const getChildWriting = (req, res) => {
  WritingSchema.find({ parent: req.params.parent_id }).exec((err, rs) => {
    if (err) console.log(err);
    res.json(rs);
  });
};
const getChildSpeaking = (req, res) => {
  SpeakingSchema.find({ parent: req.params.parent_id }).exec((err, ss) => {
    if (err) console.log(err);
    res.json(ss);
  });
};

module.exports = {
  createLevel,
  listsLevel,
  readLevel,
  updateLevel,
  removeLevel,
  getChildClassCode,
  getChildStudent,
  getChildListening,
  getChildReading,
  getChildWriting,
  getChildSpeaking,
  getChildListening,
};
