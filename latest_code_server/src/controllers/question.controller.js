const { QuestionSchema } = require('../models/test/Question.schema');
const { OptionsSchema } = require('../models/test/Options.schema');

exports.addQuestion = async (req, res) => {
  try {
    let createdBy = req.userId;
    let level = req.body.level;
    let unit = req.body.unit;
    let eiken = req.body.eiken;
    let difficulty = req.body.difficulty;
    let questionInstruction = req.body.questionInstruction;
    let img = req.body.img;
    let point = req.body.point;
    let coin = req.body.coin;
    let explanation = req.body.explanation;
    let hint = req.body.hint;
    let questionType = req.body.questionType;
    let choices = req.body.choices;
    let essay = req.body.essay;
    let unscramble = req.body.unscramble;
    let isTrue = req.body.isTrue;
    let spelling = req.body.spelling;
    let speaking = req.body.speaking;
    let matching = req.body.matching;
    let blanks = req.body.blanks;
    let wordBanks = req.body.wordBanks;
    let audio = req.body.audio;

    switch (questionType) {
      case 'TRUE_FALSE':
        const saveTrueFalseQuestion = QuestionSchema({
          createdBy: createdBy,
          level: level,
          unit: unit,
          eiken: eiken,
          difficulty: difficulty,
          questionInstruction: questionInstruction,
          img: img,
          point: point,
          coin: coin,
          explanation: explanation,
          hint: hint,
          questionType: questionType,
          isTrue: isTrue,
        });

        saveTrueFalseQuestion
          .save()
          .then((question) => {
            console.log(question.isTrue);
            return res.json({
              status: 'success',
              message: 'Question added successfully',
              question,
            });
          })
          .catch((err) => {
            return res.json({
              status: 'error',
              message: `Unable to add question ${err.message}`,
            });
          });
        break;
      case 'MULTIPLE_CHOICES':
        OptionsSchema.insertMany(choices, (err, op) => {
          if (err) return res.json({ status: 'error', message: err.message });

          const saveQuestion = QuestionSchema({
            createdBy: createdBy,
            level: level,
            unit: unit,
            eiken: eiken,
            difficulty: difficulty,
            questionInstruction: questionInstruction,
            img: img,
            point: point,
            coin: coin,
            explanation: explanation,
            hint: hint,
            questionType: questionType,
            choices: op,
            audio: audio, //for listening type of question
          });
          saveQuestion
            .save()
            .then((question) => {
              console.log(question);
              return res.json({
                status: 'success',
                message: 'Question added successfully',
                question,
              });
            })
            .catch((err) => {
              return res.json({
                status: 'error',
                message: `Unable to add question ${err.message}`,
              });
            });
        });
        break;
      case 'ESSAY':
        const saveEssayQuestion = QuestionSchema({
          createdBy: createdBy,
          level: level,
          unit: unit,
          eiken: eiken,
          difficulty: difficulty,
          questionInstruction: questionInstruction,
          img: img,
          point: point,
          coin: coin,
          explanation: explanation,
          hint: hint,
          questionType: questionType,
          essay: essay,
        });
        //TODO: need to check if the number of words match with minWord and maxWord, validation can be in front end and also backend
        saveEssayQuestion
          .save()
          .then((question) => {
            console.log(question.essay);
            return res.json({
              status: 'success',
              message: 'Question added successfully',
              question,
            });
          })
          .catch((err) => {
            return res.json({
              status: 'error',
              message: `Unable to add question ${err.message}`,
            });
          });
        break;
      case 'FILL_BLANKS':
        const saveFillBanksQuestion = QuestionSchema({
          createdBy: createdBy,
          level: level,
          unit: unit,
          eiken: eiken,
          difficulty: difficulty,
          questionInstruction: questionInstruction,
          img: img,
          point: point,
          coin: coin,
          explanation: explanation,
          hint: hint,
          questionType: questionType,
          blanks: blanks,
          wordBanks: wordBanks,
        });
        //TODO: use pattern match to find out the correct answer from the student and grade the score
        saveFillBanksQuestion
          .save()
          .then((question) => {
            console.log(question.blanks);
            return res.json({
              status: 'success',
              message: 'Question added successfully',
              question,
            });
          })
          .catch((err) => {
            return res.json({
              status: 'error',
              message: `Unable to add question ${err.message}`,
            });
          });
        break;
      case 'MATCHING':
        const saveMatchingQuestion = QuestionSchema({
          createdBy: createdBy,
          level: level,
          unit: unit,
          eiken: eiken,
          difficulty: difficulty,
          questionInstruction: questionInstruction,
          img: img,
          point: point,
          coin: coin,
          explanation: explanation,
          hint: hint,
          questionType: questionType,
          matching: matching,
        });

        saveMatchingQuestion
          .save()
          .then((question) => {
            console.log(question.matching);
            return res.json({
              status: 'success',
              message: 'Question added successfully',
              question,
            });
          })
          .catch((err) => {
            return res.json({
              status: 'error',
              message: `Unable to add question ${err.message}`,
            });
          });
        break;
      case 'SPELLING':
        const saveSpellingQuestion = QuestionSchema({
          createdBy: createdBy,
          level: level,
          unit: unit,
          eiken: eiken,
          difficulty: difficulty,
          questionInstruction: questionInstruction,
          img: img,
          point: point,
          coin: coin,
          explanation: explanation,
          hint: hint,
          questionType: questionType,
          spelling: spelling,
        });
        //TODO: we will compare each of array index separate by "," ["word1", "word2"]
        saveSpellingQuestion
          .save()
          .then((question) => {
            console.log(question.spelling);
            console.log(question.spelling[0]);
            return res.json({
              status: 'success',
              message: 'Question added successfully',
              question,
            });
          })
          .catch((err) => {
            return res.json({
              status: 'error',
              message: `Unable to add question ${err.message}`,
            });
          });
        break;
      case 'UNSCRAMBLE':
        const saveScrambleQuestion = QuestionSchema({
          createdBy: createdBy,
          level: level,
          unit: unit,
          eiken: eiken,
          difficulty: difficulty,
          questionInstruction: questionInstruction,
          img: img,
          point: point,
          coin: coin,
          explanation: explanation,
          hint: hint,
          questionType: questionType,
          unscramble: unscramble,
        });
        saveScrambleQuestion
          .save()
          .then((question) => {
            console.log(question.unscramble);
            return res.json({
              status: 'success',
              message: 'Question added successfully',
              question,
            });
          })
          .catch((err) => {
            return res.json({
              status: 'error',
              message: `Unable to add question ${err.message}`,
            });
          });
        break;
      case 'SPEAKING':
        const saveAudioQuestion = QuestionSchema({
          createdBy: createdBy,
          level: level,
          unit: unit,
          eiken: eiken,
          difficulty: difficulty,
          questionInstruction: questionInstruction,
          img: img,
          point: point,
          coin: coin,
          explanation: explanation,
          hint: hint,
          questionType: questionType,
          speaking: speaking,
        });
        //TODO: audio will upload to Amazon S3 cloud storage and retrieve url from S3 to store url in mongodb
        saveAudioQuestion
          .save()
          .then((question) => {
            console.log(question.audio);
            return res.json({
              status: 'success',
              message: 'Question added successfully',
              question,
            });
          })
          .catch((err) => {
            return res.json({
              status: 'error',
              message: `Unable to add question ${err.message}`,
            });
          });
        break;

        OptionsSchema.insertMany(mcqs, (err, op) => {
          if (err) return res.json({ status: 'error', message: err.message });

          const saveListeningQuestion = QuestionSchema({
            createdBy: createdBy,
            level: level,
            unit: unit,
            eiken: eiken,
            difficulty: difficulty,
            questionInstruction: questionInstruction,
            img: img,
            point: point,
            coin: coin,
            explanation: explanation,
            hint: hint,
            questionType: questionType,
            audio: audio,
            mcqs: op,
          });
          saveListeningQuestion
            .save()
            .then((question) => {
              console.log(question);
              return res.json({
                status: 'success',
                message: 'Question added successfully',
                question,
              });
            })
            .catch((err) => {
              return res.json({
                status: 'error',
                message: `Unable to add question ${err.message}`,
              });
            });
        });
        break;

      default:
        return res.status(404).json('Question type is not defined');
    }
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
};

exports.editQuestion = async (req, res) => {};
exports.getQuestion = async (req, res) => {
  try {
    QuestionSchema.findOne({ _id: req.params.qid })
      .populate('createdBy', 'name')
      .populate('level', 'name')
      .populate('choices')
      .exec(function (err, question) {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: 'error',
            message: 'Unable to fetch data',
          });
        } else {
          console.log(question.matching.length);
          for (let i = 0; i < question.matching.length; i++) {
            console.log(i, question.matching[i].rightWord);
          }

          res.json({
            status: 'success',
            data: question,
          });
        }
      });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
};
exports.getQuestions = async (req, res) => {
  try {
    QuestionSchema.find({})
      .populate('createdBy', 'name')
      .populate('level', 'name')
      .populate('choices')
      .exec(function (err, question) {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: 'error',
            message: 'Unable to fetch data',
          });
        } else {
          console.log(question.matching);
          res.json({
            status: 'success',
            data: question,
          });
        }
      });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
};
exports.removeQuestion = async (req, res) => {
  try {
    QuestionSchema.findOneAndDelete({ _id: req.params.qid }).then(() => {
      return res.json({
        status: 'success',
        message: 'Question deleted successfully',
      });
    });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
};
