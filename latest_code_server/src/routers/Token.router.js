const express = require('express');
const {
  verifyRefreshToken,
  createAccessToken,
} = require('../helpers/jwt.helper');
const { getUserByEmail } = require('../models/user/User.model');
const router = express.Router();

//request for new access token from refresh token
router.get('/', async (req, res) => {
  const { authorization } = req.headers;
  console.log('refreshJWT --> ', authorization);

  try {
    const decoded = await verifyRefreshToken(authorization);
    if (decoded.email) {
      const user = await getUserByEmail(decoded.email);

      if (user._id) {
        let tokenExpired = user.refreshToken.addedAt;
        const refreshTokenDB = user.refreshToken.token;
        //update date by adding number of day for expired token
        //+process.env.REFRESH_TOKEN_EXPIRED_DAY convert string to number
        tokenExpired = tokenExpired.setDate(
          tokenExpired.getDate() + +process.env.REFRESH_TOKEN_EXPIRED_DAY
        );
        const today = new Date();
        if (refreshTokenDB !== authorization && tokenExpired < today) {
          return res.status(403).json({ message: 'Invalid Token, Forbidden!' });
        }

        const accessJWT = await createAccessToken(
          decoded.role,
          decoded.email,
          decoded.name,
          `${user._id}`
        );
        return res.json({ status: 'success', accessJWT });
      }
    }
  } catch (error) {
    console.log('Error -->', error.message);
    res.status(403).json({ message: 'Forbidden!' });
  }
});

module.exports = router;
