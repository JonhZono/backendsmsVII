const { ListeningSchema } = require('../models/feedback/Listening.schema');

exports.createListening = async (req, res) => {
  try {
    req.body.createdBy = req.userId;
    const { name, parent, createdBy } = req.body;
    const listening = await new ListeningSchema({
      name,
      parent,
      createdBy,
    }).save();
    res.json(listening);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Create listening comment failed');
  }
};

exports.listsListening = async (req, res) => {
  return res.json(
    await ListeningSchema.find({}).sort({ createdAt: -1 }).exec()
  );
};

exports.readListening = async (req, res) => {
  const listening = await ListeningSchema.findOne({
    _id: req.params._id,
  }).exec();

  res.json({
    listening,
  });
};

exports.updateListening = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await ListeningSchema.findOneAndUpdate(
      { _id: req.params._id },
      { name, parent },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send('Listening comment update failed');
  }
};

exports.removeListening = async (req, res) => {
  try {
    await ListeningSchema.findOneAndDelete({
      _id: req.params._id,
    });
    res.json('Listening comment deleted');
  } catch (err) {
    res.status(400).send('Listening comment delete failed');
  }
};
