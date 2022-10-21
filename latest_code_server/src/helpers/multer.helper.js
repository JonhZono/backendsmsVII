/**Image & video upload*/
const multer = require('multer');

//define storage for the images
const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/imagesAndVideos');
  },
  filename: function (request, file, callback) {
    callback(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: {
    fieldSize: 100000000, // 10000000 Bytes = 100 MB,
    fileFilter(req, file, cb) {
      if (
        !file.originalname.match(/\.(png|jpg|gif)$/) ||
        !file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)
      ) {
        return cb(new Error('Please upload a Image or video file'));
      }
      cb(undefined, true);
    },
  },
});

module.exports = {
  upload,
};
