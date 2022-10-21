const { FeeSchema } = require('./Fee.schema');

const insertFee = (feeObj) => {
  return new Promise((resolve, reject) => {
    FeeSchema(feeObj)
      .save()
      .then((fee) => resolve(fee))
      .catch((error) => reject(error));
  });
};

const getFees = () => {
  return new Promise((resolve, reject) => {
    try {
      FeeSchema.find()
        .then((fee) => {
          resolve(fee);
        })
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const updateFee = (_id, fee) => {
  return new Promise((resolve, reject) => {
    try {
      FeeSchema.findOneAndUpdate(
        { _id },
        {
          $set: fee,
        },
        { new: true }
      )
        .then((fee) => resolve(fee))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const deleteFee = ({ _id }) => {
  return new Promise((resolve, reject) => {
    try {
      FeeSchema.findOneAndDelete({ _id })
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
  getFees, 
  insertFee, 
  updateFee, 
  deleteFee
};
