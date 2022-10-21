const { WritingSchema } = require('../models/feedback/Writing.schema');

exports.createWriting = async (req, res) => {
  try {
    req.body.createdBy = req.userId;
    const { name, parent, createdBy } = req.body;
    const writing = await new WritingSchema({
      name,
      parent,
      createdBy,
    }).save();
    res.json(writing);
  } catch (err) {
    console.log(err);
    res.status(400).send('Create writing comment failed');
  }
};

exports.listsWriting = async (req, res) => {
  res.json(await WritingSchema.find({}).sort({ createdAt: -1 }).exec());
};

exports.readWriting = async (req, res) => {
  const writing = await WritingSchema.findOne({
    _id: req.params._id,
  }).exec();

  res.json({
    writing,
  });
};

exports.updateWriting = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await WritingSchema.findOneAndUpdate(
      { _id: req.params._id },
      { name, parent },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send('Writing comment update failed');
  }
};

exports.removeWriting = async (req, res) => {
  try {
    await WritingSchema.findOneAndDelete({
      _id: req.params._id,
    });
    res.json('Writing comment deleted');
  } catch (err) {
    res.status(400).send('Writing comment delete failed');
  }
};
