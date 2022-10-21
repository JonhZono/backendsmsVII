const redis = require('redis');
require('dotenv').config();
const client = redis.createClient({
  host: process.env.REDIS_URL,
  no_ready_check: true,
  auth_pass: process.env.REDIS_PASSWORD,
});

client.on('connect', () => {
  console.log('Connected to redis instance!');
});
client.on('error', (err) => {
  console.log(err.message);
});

//insert access token to redis db
const setJWT = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      client.set(key, value, (error, res) => {
        if (error) reject(error);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
};

//get accessToken from redis db, key=authorization, value=objectId
const getJWT = (key) => {
  return new Promise((resolve, reject) => {
    try {
      client.get(key, (error, data) => {
        if (error) reject(error);
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

//delete accessToken from redis db, key=authorization
const deleteJWT = (key) => {
  try {
    client.del(key);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { setJWT, getJWT, deleteJWT };
