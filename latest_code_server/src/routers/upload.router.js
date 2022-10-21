const express = require('express');
const router = express.Router();
const {
  userAuthorization,
  roleBase,
} = require('../middleware/authorization.middleware');
const {
  uploadProfilePicture,
  removeFile,
  uploadClassStory,
  uploadAudio
} = require('../controllers/upload.controller');

//upload single image
router.post('/profile-pic', userAuthorization, uploadProfilePicture);
//upload multiple filesArray
router.post(
  '/class-story',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  uploadClassStory
);
router.post(
  '/audio',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  uploadAudio
);
router.post('/remove-file', userAuthorization, removeFile);

module.exports = router;
