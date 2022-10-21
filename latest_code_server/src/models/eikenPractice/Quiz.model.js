const {QuizSchema} = require('./Quiz.schema')

const createQuiz = (quizObj) => {
  return new Promise((resolve, reject) => {
    QuizSchema(quizObj)
      .save()
      .then((quiz) => resolve(quiz))
      .catch((error) => reject(error));
  });
};

//list of quizzes that took by specific user, this quiz
const getQuizzesById = ({ receiver }) => {
  return new Promise((resolve, reject) => {
    try {
      QuizSchema.find({ receiver })
        .then((quiz) => {
          resolve(quiz);
        })
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const getQuizzes = () => {
  return new Promise((resolve, reject) => {
    try {
      QuizSchema.find()
        .then((quizzes) => {
          resolve(quizzes);
        })
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const getQuizById = ({ _id }) => {
  return new Promise((resolve, reject) => {
    try {
        QuizSchema.findById({ _id })
          .then((quiz) => {
            resolve(quiz);
          })
          .catch((error) => reject(error));
      } catch (error) {
        console.log(error);
        reject(error);
      }
  });
};
const updateQuiz = (_id, quiz) => {
  return new Promise((resolve, reject) => {
    try {
      QuizSchema.findOneAndUpdate(
        { _id },
        {
          $set: quiz,
        },
        { new: true }
      )
        .then((quiz) => resolve(quiz))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

//insert question to the quiz
const insertQuestionToQuiz = (_id, questionId) => {
    return new Promise((resolve, reject) => {
      if (!_id) return false;
  
      try {
        QuizSchema.findByIdAndUpdate(
          { _id },
          {
            $push: {question: questionId},
          },
          { new: true }
        )
          .then((quiz) => resolve(quiz))
          .catch((error) => reject(error));
      } catch (error) {
        reject(error);
      }
    });
  };

const deleteQuiz = ({ _id }) => {
  return new Promise((resolve, reject) => {
    try {
      QuizSchema.findOneAndDelete({ _id })
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
  createQuiz,
  getQuizById,
  getQuizzes,
  getQuizzesById,
  updateQuiz,
  insertQuestionToQuiz,
  deleteQuiz
};
