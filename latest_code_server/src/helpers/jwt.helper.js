const jwt = require('jsonwebtoken');
const { setJWT } = require('../helpers/redis.helper');
const { storeRefreshTokenInMongoDB } = require('../models/user/User.model');

const createAccessToken = async (role, email, name, _id) => {
  return new Promise((resolve, reject) => {
    try {
      const accessJWT = jwt.sign(
        { role, email, name },
        process.env.JWT_ACCESS_TOKEN,
        {
          expiresIn: '2d',
        }
      );
      setJWT(accessJWT, _id);
      resolve(accessJWT);
    } catch (error) {
      reject(error);
    }
  });
};

const createRefreshToken = async (role, email, name, _id) => {
  return new Promise((resolve, reject) => {
    try {
      const refreshJWT = jwt.sign(
        { role, email, name },
        process.env.JWT_REFRESH_TOKEN,
        {
          expiresIn: '20d',
        }
      );
      storeRefreshTokenInMongoDB(_id, refreshJWT);
      resolve(refreshJWT);
    } catch (error) {
      reject(error);
    }
  });
};

const verifyAccessToken = async (authorization) => {
  try {
    return Promise.resolve(
      jwt.verify(authorization, process.env.JWT_ACCESS_TOKEN)
    );
  } catch (error) {
    console.log(error.message);
    return Promise.resolve(error);
  }
};

const verifyRefreshToken = async (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, process.env.JWT_REFRESH_TOKEN));
  } catch (error) {
    return Promise.resolve(error);
  }
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
