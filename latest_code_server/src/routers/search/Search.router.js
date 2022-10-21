const express = require('express');
const router = express.Router();

const {
  userAuthorization,
  roleBase,
} = require('../../middleware/authorization.middleware');
const userSearchFilter = require('../../controllers/search.controller');

router.post('/user/', userAuthorization, userSearchFilter);
