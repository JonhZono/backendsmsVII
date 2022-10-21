const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const hashedPassword = (plainPassword) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(plainPassword, salt));
  });
};

const comparePassword = (plainPassword, hashedPassFromDB) => {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.compare(plainPassword, hashedPassFromDB, (err, result) => {
        if (err) resolve(err);
        resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { hashedPassword, comparePassword };
