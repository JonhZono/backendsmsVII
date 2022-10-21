const {AnnouncementSchema} = require('./Announcement.schema');

const insertAnnouncement = (announcementObj) => {
  return new Promise((resolve, reject) => {
    AnnouncementSchema(announcementObj)
      .save()
      .then((announcement) => resolve(announcement))
      .catch((error) => reject(error));
  });
};

const getAnnouncements = () => {
  return new Promise((resolve, reject) => {
    try {
      AnnouncementSchema.find()
        .then((announcement) => {
          resolve(announcement);
        })
        .catch((error) => reject(error));
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const updateAnnouncement = (_id, announcement) => {
  return new Promise((resolve, reject) => {
    try {
      AnnouncementSchema.findOneAndUpdate(
        { _id },
        {
          $set: announcement,
        },
        { new: true }
      )
        .then((announcement) => resolve(announcement))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

const deleteAnnouncement = ({ _id }) => {
  return new Promise((resolve, reject) => {
    try {
      AnnouncementSchema.findOneAndDelete({ _id })
        .then(() => resolve())
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = {
  getAnnouncements, 
  insertAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement
};
