const { DictionarySchema } = require('./Dictionary.schema');

const insertWord = (wordObj) => {
  return new Promise((resolve, reject) => {
    DictionarySchema(wordObj)
      .save()
      .then((word) => resolve(word))
      .catch((error) => reject(error));
  });
};

const getWords = ({ user }) => {
  return new Promise((resolve, reject) => {
    try {
      DictionarySchema.find({ user })
        .then((words) => {
          resolve(words);
        })
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const getWordById = ({ _id, user }) => {
  return new Promise((resolve, reject) => {
    try {
      DictionarySchema.find({ _id, user }, (error, word) => {
        if (error) {
          console.log(error);
          resolve(error);
        }
        resolve(word);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const updateWord = (_id, word, user) => {
  return new Promise((resolve, reject) => {
    try {
      DictionarySchema.findOneAndUpdate(
        { _id, user },
        {
          $set: word,
        },
        { new: true }
      )
        .then((word) => resolve(word))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const deleteWord = ({ _id, user }) => {
  return new Promise((resolve, reject) => {
    try {
      DictionarySchema.findOneAndDelete({ _id, user })
        .then(() => resolve())
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = { insertWord, getWords, getWordById, updateWord, deleteWord };
