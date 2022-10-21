const { verifyAccessToken } = require('../helpers/jwt.helper');
const { getJWT, deleteJWT } = require('../helpers/redis.helper');

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  const decoded = await verifyAccessToken(authorization);
  if (decoded.email) {
    const role = decoded.role;
    const username = decoded.name;
    const email = decoded.email;
    const userId = await getJWT(authorization);
    if (!userId) {
      return res.status(403).json({ message: 'Forbidden!' });
    }
    req.role = role;
    req.userId = userId;
    req.username = username;
    req.email = email;
    return next();
  }
  //delete access token when it expired from redis db
  deleteJWT(authorization);
  res.status(403).json({ message: 'Forbidden!' });
};

const roleBase = (permission) => {
  return (req, res, next) => {
    const role = req.role;
    if (permission.includes(role)) {
      return next();
    } else {
      return res.status(401).json({ message: 'Unauthorized Access!' });
    }
  };
};

module.exports = { userAuthorization, roleBase };
