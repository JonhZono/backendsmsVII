const express = require('express');
const router = express.Router();
const {
  userAuthorization,
  roleBase,
} = require('../middleware/authorization.middleware');

const {
  addCounselingNote,
  editCounselingNote,
  getCounselingNotes,
  getCounselingNote,
  removeCounselingNote,
  addEvent,
  editEvent,
  getEvent,
  getEvents,
  removeEvent,
  addPresentation,
  editPresentation,
  getPresentation,
  getPresentations,
  removePresentation,
  addNoticePoint,
  editNoticePoint,
  getNoticePoint,
  getNoticePoints,
  removeNoticePoint,
} = require('../controllers/studentPortfolio.controller');

/**Route counseling note*/
router.post(
  '/counseling',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  addCounselingNote
);
router.put(
  '/counseling/:id',
  userAuthorization,
  roleBase(['admin']),
  editCounselingNote
);
router.get('/counselings', userAuthorization, getCounselingNotes);
router.get('/counseling/:id', userAuthorization, getCounselingNote);
router.delete(
  '/counseling/:id',
  userAuthorization,
  roleBase(['admin']),
  removeCounselingNote
);

/**Route event participant history*/
router.post(
  '/event',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  addEvent
);
router.put(
  '/event/:id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  editEvent
);
router.get('/event', userAuthorization, getEvents);
router.get('/event/:id', userAuthorization, getEvent);
router.delete(
  '/event/:id',
  userAuthorization,
  roleBase(['admin']),
  removeEvent
);

/**Route unit presentation*/
router.post(
  '/presentation',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  addPresentation
);
router.put(
  '/presentation/:id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  editPresentation
);
router.get('/presentations', userAuthorization, getPresentations);
router.get('/presentation/:id', userAuthorization, getPresentation);
router.delete(
  '/presentation/:id',
  userAuthorization,
  roleBase(['admin']),
  removePresentation
);
/**Route Notice Point*/
router.post('/notice_point', userAuthorization, addNoticePoint);
router.put('/notice_point/:id', userAuthorization, editNoticePoint);
router.get('/notice_points', userAuthorization, getNoticePoints);
router.get('/notice_point/:id', userAuthorization, getNoticePoint);
router.delete(
  '/notice_point/:id',
  userAuthorization,
  roleBase(['admin']),
  removeNoticePoint
);
module.exports = router;
