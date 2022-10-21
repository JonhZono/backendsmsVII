const { MarkSchema } = require('../mark/Mark.schema');

const insertMark = (markObj) => {
  return new Promise((resolve, reject) => {
    MarkSchema(markObj)
      .save()
      .then((mark) => resolve(mark))
      .catch((error) => reject(error));
  });
};

const getMarksByUserId = ({ receiver }) => {
  return new Promise((resolve, reject) => {
    try {
      MarkSchema.find({ receiver })
        .then((marks) => {
          resolve(marks);
        })
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const getMarks = () => {
  return new Promise((resolve, reject) => {
    try {
      MarkSchema.find()
        .then((marks) => {
          resolve(marks);
        })
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const getMarkById = ({ _id, receiver }) => {
  return new Promise((resolve, reject) => {
    try {
      MarkSchema.find({ _id, receiver }, (error, mark) => {
        if (error) {
          console.log(error);
          resolve(error);
        }
        resolve(mark);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const updateMark = (_id, mark) => {
  return new Promise((resolve, reject) => {
    try {
      MarkSchema.findOneAndUpdate(
        { _id },
        {
          $set: mark,
        },
        { new: true }
      )
        .then((mark) => resolve(mark))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const deleteMark = ({ _id }) => {
  return new Promise((resolve, reject) => {
    try {
      MarkSchema.findOneAndDelete({ _id })
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

module.exports = { insertMark, getMarks, getMarksByUserId, getMarkById, updateMark, deleteMark };
