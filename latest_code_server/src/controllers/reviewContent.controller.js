const {
  ReviewContentSchema,
} = require('../models/feedback/ReviewContent.schema');

exports.createReviewContent = async (req, res) => {
  try {
    const { parent, text } = req.body;
    const content = await new ReviewContentSchema({
      text,
      parent,
    }).save();
    res.json(content);
  } catch (err) {
    console.log(err);
    res.status(400).send('Create review content failed');
  }
};

exports.listsReviewContent = async (req, res) =>
  res.json(await ReviewContentSchema.find({}).sort({ createdAt: -1 }).exec());

exports.readReviewContent = async (req, res) => {
  const content = await ReviewContentSchema.findOne({
    _id: req.params._id,
  }).exec();
  // const feedback = await Product.find({ category }).populate('category').exec();

  res.json({
    content,
  });
};

exports.updateReviewContent = async (req, res) => {
  const { parent, text } = req.body;
  try {
    const updated = await ReviewContentSchema.findOneAndUpdate(
      { _id: req.params._id },
      { parent, text },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send('Review content update failed');
  }
};

exports.removeReviewContent = async (req, res) => {
  try {
    await ReviewContentSchema.findOneAndDelete({ _id: req.params._id });
    res.json('Review content deleted');
  } catch (err) {
    res.status(400).send('Review content delete failed');
  }
};
