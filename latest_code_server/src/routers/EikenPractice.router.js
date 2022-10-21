const express = require('express');
const router = express.Router();
const {
  userAuthorization,
  roleBase,
} = require('../middleware/authorization.middleware');

//query base on userId & mark_id for each user
router.get(
  '/',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  async (req, res) => {
    try {
      return res.json({ status: 'success' });
    } catch (error) {
      res.json({ status: 'error', message: error.message });
    }
  }
);

module.exports = router;
