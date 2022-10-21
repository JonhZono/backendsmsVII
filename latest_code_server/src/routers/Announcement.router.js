const express = require('express');
const router = express.Router();

const {
  userAuthorization,
  roleBase,
} = require('../middleware/authorization.middleware');
const {
  getAnnouncements,
  insertAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../models/announcement/Announcement.model');

router.get('/', userAuthorization, roleBase('admin'), async (req, res) => {
  try {
    const announcements = await getAnnouncements();
    return res.json({ status: 'success', announcements });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});

router.post(
  '/insert',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const announcement = await insertAnnouncement(req.body);
      if (announcement._id) {
        /*make sure fcmToken is available in user model
        if(report.receiver.fcmToken){
          const res = await sendNotificationToSingleDevice({report.receiver.fcmToken, report.content, 'Class Feedback'}); //need fcmToken in order to test the push notification
        }*/
        return res.json({
          status: 'success',
          message: 'Announcement Created!',
          announcement,
        });
      }
      return res.json({
        status: 'error',
        message: 'Unable to create announcement',
      });
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);

router.put(
  '/update/:_id',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const announcementBody = ({ descriptions, day } = req.body);
      const { _id } = req.params;
      const announcement = await updateAnnouncement(_id, announcementBody);
      if (announcement._id) {
        return res.json({
          status: 'success',
          message: 'The announcement has been updated',
        });
      }
      res.json({
        status: 'error',
        message: 'Unable to update announcement',
      });
    } catch (error) {
      res.json({ status: 'error', message: error.message });
    }
  }
);

//admin
router.delete(
  '/:_id',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    const { _id } = req.params;
    await deleteAnnouncement({ _id });

    return res.json({ status: 'success', message: 'Announcement deleted' });
  }
);

module.exports = router;
