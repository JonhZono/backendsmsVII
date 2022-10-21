const { UserSchema } = require('./User.schema');

const registerUser = (userObj) => {
  return new Promise((resolve, reject) => {
    UserSchema(userObj)
      .save()
      .then((user) => resolve(user))
      .catch((error) => reject(error));
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    if (!email) return false;

    try {
      UserSchema.findOne({ email }, (error, data) => {
        if (error) resolve(error);
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getUserById = ({ _id }) => {
  return new Promise((resolve, reject) => {
    if (!_id) return false;

    try {
      UserSchema.findOne({ _id })
        .populate({
          path: 'createdBy',
          select: { name: 1 },
        })
        .populate({
          path: 'level',
          select: { name: 1 },
        })
        .then((data, error) => {
          if (error) resolve(error);
          resolve(data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

const getUsers = ({ _id }) => {
  return new Promise((resolve, reject) => {
    if (!_id) return false;

    try {
      UserSchema.find({})
        .populate({
          path: 'createdBy',
          select: { name: 1 },
        })
        .populate({
          path: 'level',
          select: { name: 1 },
        })
        .then((data, error) => {
          if (error) resolve(error);
          resolve(data);
        });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = ({ _id }) => {
  return new Promise((resolve, reject) => {
    if (!_id) return false;

    try {
      UserSchema.findByIdAndDelete({ _id }).then((data, error) => {
        if (error) resolve(error);
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const storeRefreshTokenInMongoDB = (_id, token) => {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findOneAndUpdate(
        { _id },
        {
          $set: {
            'refreshToken.token': token,
            'refreshToken.addedAt': Date.now(),
          },
        },
        { new: true }
      )
        .then((error, data) => {
          if (error) resolve(error);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

const updateNewPassword = (email, newHashedPass) => {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findOneAndUpdate(
        { email },
        {
          $set: {
            password: newHashedPass,
            addedAt: Date.now(),
          },
        },
        { new: true }
      )
        .then((error, data) => {
          if (error) resolve(error);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const updateUserInfo = ({ _id, newObj }) => {
  return new Promise((resolve, reject) => {
    try {
      UserSchema.findByIdAndUpdate(
        { _id },
        {
          $set: newObj,
        },
        { new: true }
      )
        .then((user) => resolve(user))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  registerUser,
  getUserByEmail,
  getUserById,
  getUsers,
  deleteUser,
  storeRefreshTokenInMongoDB,
  updateNewPassword,
  updateUserInfo,
};
