const { TestPaperSchema } = require('../models/test/TestPaper.schema');
const { OptionsSchema } = require('../models/test/Options.schema');

exports.addTestPaper = async (req, res) => {
  try {
    const test = new TestPaperSchema({
      createdBy: req.userId,
      title: req.body.title,
      instruction: req.body.instruction,
      level: req.body.level,
      testType: req.body.testType,
      duration: req.body.duration,
      handlingTeacher: req.body.handlingTeacher,
      published: req.body.published,
      totalPoint: req.body.totalPoint,
      passing: req.body.passing,
      goal: req.body.goal,
      questions: req.body.questions,
    });
    test
      .save()
      .then((result) => {
        console.log(result);
        return res.json({
          status: 'success',
          message: 'Test created successfully',
        });
      })
      .catch((err) => {
        return res.json({ status: 'error', message: err.message });
      });
  } catch (err) {
    return res.json({ status: 'error', message: err.message });
  }
};
exports.editTestPaper = async (req, res) => {
  try {
    const test = await TestPaperSchema.findById({
      _id: req.params.tid,
    });
    if (test) {
      await TestPaperSchema.findByIdAndUpdate(
        { _id: req.params.tid },
        { $set: req.body },
        { new: true }
      );

      return res.json({
        status: 'success',
        message: 'Test Paper update successfully',
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: 'error',
      message: 'Unable to add question',
    });
  }
};
exports.getTestPaper = async (req, res) => {
  try {
    TestPaperSchema.findById({ _id: req.params.tid })
      .populate('createdBy', 'name')
      .populate('level', 'name')
      .populate('handlingTeacher', 'name')
      .populate({
        path: 'questions',
        populate: {
          path: 'choices',
          model: OptionsSchema,
        },
      })
      //.populate('instruction')
      .exec(function (err, test) {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: 'error',
            message: 'Unable to fetch data',
          });
        } else {
          console.log('Test', test);
          res.json({
            status: 'success',
            data: test,
          });
        }
      });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
};
exports.getTestPaperDetails = async (req, res) => {
  try {
    TestPaperSchema.findById({ _id: req.params.tid }, { questions: 0 })
      .populate('createdBy', 'name')
      .populate('level', 'name')
      .populate('handlingTeacher', 'name')
      //.populate('instruction')
      .exec(function (err, test) {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: 'error',
            message: 'Unable to fetch data',
          });
        } else {
          console.log('Test', test);
          res.json({
            status: 'success',
            data: test,
          });
        }
      });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
};
exports.getTestPapers = async (req, res) => {
  try {
    TestPaperSchema.find({})
      .populate('createdBy', 'name')
      .populate('level', 'name')
      .populate('handlingTeacher', 'name')
      .exec(function (err, test) {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: 'error',
            message: 'Unable to fetch data',
          });
        } else {
          res.json({
            status: 'success',
            data: test,
          });
        }
      });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
};
exports.removeTestPaper = async (req, res) => {
  try {
    TestPaperSchema.findOneAndDelete({ _id: req.params.qid }).then(() => {
      return res.json({
        status: 'success',
        message: 'Test deleted successfully',
      });
    });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
};
exports.addQuestionToTestPaper = async (req, res) => {
  try {
    if (req.body.questions === undefined) {
      return res.json('Please select your question to add!');
    }
    const test = await TestPaperSchema.findById({
      _id: req.params.tid,
    });

    if (test && !test.published) {
      //prevent adding the same question
      if (test.questions.includes(req.body.questions)) {
        return res.json({
          status: 'error',
          message: 'Question already existed in the test paper',
        });
      } else {
        test.questions.push(req.body.questions);
        await test.save();
        console.log(test.questions);
        return res.json({
          status: 'success',
          message: 'Question added successfully',
        });
      }
    } else {
      return res.json({
        status: 'error',
        message: 'Unable to add question',
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: 'error',
      message: 'Unable to add question',
    });
  }
};
exports.removeQuestionFromTestPaper = async (req, res) => {
  try {
    const test = await TestPaperSchema.findById({
      _id: req.params.tid,
    });

    if (test && !test.published) {
      if (test.questions.includes(req.body.questions)) {
        await TestPaperSchema.findOneAndUpdate(
          { _id: req.params.tid },
          {
            $pull: { questions: req.body.questions },
          }
        );

        return res.json({
          status: 'success',
          message: 'Question remove successfully from test paper',
        });
      } else {
        return res.json({
          status: 'error',
          message: 'Unable to question remove from test paper',
        });
      }
    } else {
      return res.json({
        status: 'error',
        message: 'Unable to remove question from test paper',
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({
      status: 'error',
      message: 'Unable to remove question from test paper',
    });
  }
};
//TODO: students click on start test to render the test paper
exports.studentStartTestPaper = async (req, res) => {};
