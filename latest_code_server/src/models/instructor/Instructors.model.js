const { InstructorsSchema } = require('./Instructors.schema');

const insertInstructor = (newObj) => {
  return new Promise((resolve, reject) => {
    InstructorsSchema(newObj)
      .save()
      .then((instructor) => resolve(instructor))
      .catch((error) => reject(error));
  });
};

const getInstructors = () => {
  return new Promise((resolve, reject) => {
    try {
      InstructorsSchema.find()
        .then((instructors) => {
          resolve(instructors);
        })
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const getInstructorById = ({ _id }) => {
  return new Promise((resolve, reject) => {
    try {
      InstructorsSchema.find({ _id }, (error, instructor) => {
        if (error) {
          console.log(error);
          resolve(error);
        }
        resolve(instructor);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const updateInstructor = (_id, instructor) => {
  return new Promise((resolve, reject) => {
    try {
      InstructorsSchema.findOneAndUpdate(
        { _id },
        {
          $set: instructor,
        },
        { new: true }
      )
        .then((instructor) => resolve(instructor))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const deleteInstructor = ({ _id }) => {
  return new Promise((resolve, reject) => {
    try {
      InstructorsSchema.findOneAndDelete({ _id })
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

module.exports = {
  insertInstructor,
  getInstructors,
  getInstructorById,
  updateInstructor,
  deleteInstructor,
};
