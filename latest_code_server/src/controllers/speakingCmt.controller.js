const { SpeakingSchema } = require('../models/feedback/Speaking.schema');

exports.createSpeaking = async (req, res) => {
  try {
    req.body.createdBy = req.userId;
    const { name, parent, createdBy } = req.body;
    const speaking = await new SpeakingSchema({
      name,
      parent,
      createdBy,
    }).save();
    res.json(speaking);
  } catch (err) {
    console.log(err);
    res.status(400).send('Create speaking comment failed');
  }
};

exports.listsSpeaking = async (req, res) => {
  res.json(await SpeakingSchema.find({}).sort({ createdAt: -1 }).exec());
};

exports.readSpeaking = async (req, res) => {
  const speaking = await SpeakingSchema.findOne({
    _id: req.params._id,
  }).exec();

  res.json({
    speaking,
  });
};

exports.updateSpeaking = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await SpeakingSchema.findOneAndUpdate(
      { _id: req.params._id },
      { name, parent },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send('Speaking comment update failed');
  }
};

exports.removeSpeaking = async (req, res) => {
  try {
    await SpeakingSchema.findOneAndDelete({
      _id: req.params._id,
    });
    res.json('Speaking comment deleted');
  } catch (err) {
    res.status(400).send('Speaking comment delete failed');
  }
};
