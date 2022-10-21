const { ClassCodeSchema } = require('../models/feedback/ClassCode.schema');
const {
  ReviewContentSchema,
} = require('../models/feedback/ReviewContent.schema');

exports.createClassCode = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const classCode = await new ClassCodeSchema({ name, parent }).save();
    res.json(classCode);
  } catch (err) {
    console.log(err);
    res.status(400).send('Create class code failed');
  }
};

exports.listsClassCode = async (req, res) => {
  res.json(await ClassCodeSchema.find({}).sort({ createdAt: -1 }).exec());
};

exports.readClassCode = async (req, res) => {
  const classCode = await ClassCodeSchema.findOne({
    _id: req.params._id,
  }).exec();
  // const feedback = await Product.find({ category }).populate('category').exec();

  res.json({
    classCode,
  });
};

exports.updateClassCode = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await ClassCodeSchema.findOneAndUpdate(
      { _id: req.params._id },
      { name, parent },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).send('Level update failed');
  }
};

exports.removeClassCode = async (req, res) => {
  try {
    await ClassCodeSchema.findOneAndDelete({
      _id: req.params._id,
    });
    res.json('CLass code deleted');
  } catch (err) {
    res.status(400).send('Class code delete failed');
  }
};

//TODO:dynamic select dropdown at #frontend
exports.getChildReviewContent = (req, res) => {
  ReviewContentSchema.find({ parent: req.params.parent_id }).exec((err, rc) => {
    if (err) console.log(err);
    res.json(rc);
  });
};
