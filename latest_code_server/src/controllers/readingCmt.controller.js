const { ReadingSchema } = require('../models/feedback/Reading.schema');

exports.createReading = async (req, res) => {
  try {
    req.body.createdBy = req.userId;
    const { name, parent, createdBy } = req.body;
    const reading = await new ReadingSchema({
      name,
      parent,
      createdBy,
    }).save();
    res.json(reading);
  } catch (err) {
    console.log(err);
    res.status(400).send('Create listening comment failed');
  }
};

exports.listsReading = async (req, res) => {
  res.json(await ReadingSchema.find({}).sort({ createdAt: -1 }).exec());
};

exports.readReading = async (req, res) => {
  const reading = await ReadingSchema.findOne({
    _id: req.params._id,
  }).exec();

  res.json({
    reading,
  });
};

exports.updateReading = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await ReadingSchema.findOneAndUpdate(
      { _id: req.params._id },
      { name, parent },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send('Reading comment update failed');
  }
};

exports.removeReading = async (req, res) => {
  try {
    await ReadingSchema.findOneAndDelete({
      _id: req.params._id,
    });
    res.json('Reading comment deleted');
  } catch (err) {
    res.status(400).send('Reading comment delete failed');
  }
};
