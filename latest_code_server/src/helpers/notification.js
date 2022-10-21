const admin = require('firebase-admin');
const serviceAccount = require('../../gli-system-firebase-adminsdk-v6cgs-4af08f4cd9.json');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotificationToSingleDevice = async (fcmToken, content, type) => {
  // This registration token comes from the client FCM SDKs.
  // findUserById and get the fcmToken from user model
  switch (type) {
    case 'Class Feedback':
      const registrationToken = fcmToken;
      const message = {
        notification: {
          title: type,
          body: content,
        },
        data: {},
        token: registrationToken,
      };

      // Send a message to the device corresponding to the provided registration token.
      admin
        .messaging()
        .send(message)
        .then((response) => {
          // Response is a message ID string.
          console.log('Notification successfully sent:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    case 'Announcement':
    /** */
    case 'Eiken Pre-Test Practice':
    /** */
    case 'Unit Test':
    /** */
    case 'Term Test':
    /** */
    case 'Review Lesson':
    /** */
    case 'Class Story':
    /** */
    case 'Comment':
    /** */
  }
};

module.exports = {
  sendNotificationToSingleDevice,
};
