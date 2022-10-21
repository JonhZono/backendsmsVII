const express = require('express');
const router = express.Router();
const {
  userAuthorization,
  roleBase,
} = require('../middleware/authorization.middleware');
const {
  createClassStory,
  getClassStories,
  getClassStory,
  updateClassStory,
  removeClassStory,
  addComment,
  updateComment,
  getComment,
  removeComment,
  likePost,
  unlikePost,
} = require('../controllers/classStory.controller');

router.post(
  '/',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  createClassStory
);
//nested populate comment
router.get('/all', userAuthorization, getClassStories);
router.get('/:cid', userAuthorization, getClassStory);
router.put('/:cid', userAuthorization, roleBase('admin'), updateClassStory);
router.delete('/:cid', userAuthorization, removeClassStory);
/**comment section */
router.post('/comment/:cid', userAuthorization, addComment);
router.put('/comment/:cmt_id', userAuthorization, updateComment);
router.get('/comment/:cmt_id', userAuthorization, getComment);
router.delete('/comment/:cmt_id', userAuthorization, removeComment);
/**like section */
router.put('/like/:_id', userAuthorization, likePost);
router.put('/unlike/:_id', userAuthorization, unlikePost);

module.exports = router;
