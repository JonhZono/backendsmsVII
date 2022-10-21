const { randomPinGenerator } = require('../../utils/randomPinGenerator');
const { ResetPinSchema } = require('./ResetPin.schema');

const setPasswordPin = (email) => {
  const pinLength = 6;
  const pinNumber = randomPinGenerator(pinLength);
  const resetPinObj = {
    email,
    pin: pinNumber,
  };
  return new Promise((resolve, reject) => {
    ResetPinSchema(resetPinObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const checkEmailPin = (email, pin) => {
  return new Promise((resolve, reject) => {
    ResetPinSchema.findOne({ email, pin }, (error, data) => {
      try {
        if (error) {
          console.log(error);
          resolve(false);
        }
        resolve(data);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  });
};

const deletePin = (email, pin) => {
  ResetPinSchema.findOneAndDelete({ email, pin }, (error) => {
    try {
      if (error) console.log(error);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  setPasswordPin,
  checkEmailPin,
  deletePin,
};
