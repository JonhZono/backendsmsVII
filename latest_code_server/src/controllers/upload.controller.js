require('dotenv').config;
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { UserSchema } = require('../models/user/User.schema');
const {
  StudentProfileSchema,
} = require('../models/user/StudentProfile.schema');
const {
  AdminInstructorProfileSchema,
} = require('../models/user/AdminInstructorProfile.schema');

const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_ACCESS_SECRET_KEY,
  region: process.env.S3_BUCKET_REGION,
  //contentType: 'image/jpeg',
  ACL: 'public-read',
});

/**!file.originalname.match(/\.(png|jpg|gif)$/) ||
            !file.originalname.match(/\.(mp4|MPEG-4|mkv)$/) */
/**Note: all files will compress in the frontend before upload it to the cloud*/
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/heic'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type, only JPEG, GIF, heic, and PNG is allowed!'),
      false
    );
  }
};

const filesFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/heic' ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/mkv'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type, only JPEG, GIF, heic, mp4, mkv, and PNG is allowed!'
      ),
      false
    );
  }
};

const upload = (bucketName) =>
  multer({
    fileFilter,
    limits: { fileSize: 10000000 }, //10Mb
    storage: multerS3({
      s3,
      bucket: bucketName,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `image-${Date.now()}.jpeg`);
      },
    }),
  });

const uploadAudio = (bucketName) =>
  multer({
    limits: { fileSize: 100000000 }, //100Mb
    storage: multerS3({
      s3,
      bucket: bucketName,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `audio-${Date.now()}.mp3`);
      },
    }),
  });

const uploadMultipleFiles = multer({
  fileFilter: filesFilter,
  limits: { fileSize: 1000000000 }, //1000Mb
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_CLASS_STORY,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `story-${Date.now()}`);
    },
  }),
}).array('videos-photos', 3);

exports.uploadProfilePicture = async (req, res) => {
  const uploadSingle = upload(process.env.S3_BUCKET_USER_PROFILE).single(
    'profileImage'
  );
  uploadSingle(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ status: 'error', message: err.message });
    }
    await AdminInstructorProfileSchema.findOneAndUpdate(
      { user: req.userId },
      { $set: { profileImg: req.file.location } },
      { new: true }
    );
    await StudentProfileSchema.findOneAndUpdate(
      { user: req.userId },
      { $set: { profileImg: req.file.location } },
      { new: true }
    );
    await UserSchema.findOneAndUpdate(
      { _id: req.userId },
      { $set: { profileImage: req.file.location } },
      { new: true }
    );
    // if (!staffProfile || !user || !studentProfile) {
    //   return res.status(404).json({
    //     status: 'error',
    //     message: 'Profile not found but image already upload to cloud',
    //   });
    // }
    console.log(req.file);
    return res.status(200).json({
      status: 'success',
      message: 'Image upload successfully',
      data: req.file,
    });
  });
};

exports.uploadAudio = async (req, res) => {
  const uploadSingle = uploadAudio(process.env.S3_BUCKET_TEST_PAPER).single(
    'testAudio'
  );
  uploadSingle(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ status: 'error', message: err.message });
    }

    console.log(req.file);
    return res.status(200).json({
      status: 'success',
      message: 'Audio upload successfully',
      data: req.file,
    });
  });
};

exports.uploadClassStory = async (req, res) => {
  uploadMultipleFiles(req, res, async (err) => {
    console.log('Files', req.files);
    if (err) {
      console.log(err);
      return res.status(400).json({
        status: 'error',
        message: err.message,
        log: 'something went wrong!',
      });
    } else if (req.files === undefined) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No file selected ' });
    } else {
      let filesArray = req.files;
      let fileLocation;
      const images = [];

      for (let i = 0; i < filesArray.length; i++) {
        fileLocation = filesArray[i].location;
        images.push(fileLocation);
      }
      return res.status(200).json({
        status: 'success',
        message: 'Image upload successfully',
        data: req.files,
      });
      //save to database
      // await ClassStorySchema.findOneAndUpdate(
      //   { postedBy: req.userId },
      //   { $set: { filesImgVdo: images } },
      //   { new: true }
      // )
      //   .then(() => {
      //     return res.status(200).json({
      //       status: 'success',
      //       message: 'Image upload successfully',
      //       data: req.files,
      //     });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     return res.status(400).json({
      //       status: 'error',
      //       message: 'Error uploading image',
      //     });
      //   });
      // console.log('Reach here!!!!!!');
      // await ClassStorySchema.create({ filesImgVdo: images });
    }
  });
};

exports.removeFile = async (req, res) => {
  const { key, bucket } = req.body;
  const user = await UserSchema.findById({ _id: req.userId });
  if (!user)
    return res.status(400).json({ status: 'error', message: 'User not found' });

  s3.deleteObject(
    {
      Bucket: bucket,
      Key: `user-profiles/${key}`,
    },
    function (err, data) {
      if (err) console.log(err.message);
      console.log(data);
      return res.status(200).json({
        status: 'success',
        message: 'Image deleted successfully',
        data,
      });
    }
  );
};
