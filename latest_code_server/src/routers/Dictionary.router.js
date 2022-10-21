const express = require('express');
const router = express.Router();
const {
  insertWord,
  getWords,
  getWordById,
  updateWord,
  deleteWord,
} = require('../models/dictionary/Dictionary.model');
const { userAuthorization, roleBase } = require('../middleware/authorization.middleware');

router.get('/', userAuthorization, async (req, res) => {
  try {
    const user = req.userId;
    const words = await getWords({ user });
    return res.json({ status: 'success', words });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

//query base on userId & dictionary_id for each user
router.get('/:_id', userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const user = req.userId;
    const word = await getWordById({ _id, user });
    console.log(word);
    return res.json({ status: 'success', word });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

//student only
router.post('/insert', userAuthorization, async (req, res) => {
  try {
    const { word, pronounce, description, example } = req.body;
    const user = req.userId;
    const newWordObj = {
      user,
      word,
      pronounce,
      description,
      example,
    };
    const newWord = await insertWord(newWordObj);
    if (newWord._id) {
      return res.json({
        status: 'success',
        message: 'Word Created!',
        newWord,
      });
    }
    return res.json({
      status: 'error',
      message: 'Unable to create word',
    });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
});

//update word student
router.put('/update/:_id', userAuthorization, async (req, res) => {
  try {
    const wordObj = ({ word, pronounce, description, example } = req.body);
    const { _id } = req.params;
    const user = req.userId;
    const wordEdited = await updateWord(_id, wordObj, user);
    if (wordEdited._id) {
      return res.json({
        status: 'success',
        message: 'The word has been updated',
      });
    }
    res.json({
      status: 'error',
      message: 'Unable to update the word',
    });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

//student & admin
router.delete('/:_id', userAuthorization, roleBase(['admin', 'student']),async (req, res) => {
  const { _id } = req.params;
  const user = req.userId;
  await deleteWord({ _id, user });

  return res.json({ status: 'success', message: 'Word deleted' });
});

module.exports = router;
