const express = require('express');
const router = express.Router();
const { upload } = require('../helpers/multer.helper');
const {
  registerUser,
  getUserByEmail,
  getUserById,
  deleteUser,
  updateNewPassword,
  storeRefreshTokenInMongoDB,
  updateUserInfo,
} = require('../models/user/User.model');
const { hashedPassword, comparePassword } = require('../helpers/bcrypt.helper');
const {
  createAccessToken,
  createRefreshToken,
} = require('../helpers/jwt.helper');
const {
  userAuthorization,
  roleBase,
} = require('../middleware/authorization.middleware');
const {
  setPasswordPin,
  checkEmailPin,
  deletePin,
} = require('../models/resetPin/ResetPin.model');
const { UserSchema } = require('../models/user/User.schema');
const {
  StudentProfileSchema,
} = require('../models/user/StudentProfile.schema');
const {
  AdminInstructorProfileSchema,
} = require('../models/user/AdminInstructorProfile.schema');
const { processEmail } = require('../helpers/email.helper');
const { deleteJWT } = require('../helpers/redis.helper');
const {
  updatePassValidation,
  reqPinValidation,
  loginValidation,
  registerValidation,
} = require('../middleware/formValidation.middleware');

/**@EachUser detail information*/
router.get('/', userAuthorization, async (req, res) => {
  try {
    const _id = req.userId;
    const getUser = await getUserById({ _id });
    if (!getUser) {
      return res.json({ message: 'No Users' });
    }
    res.json(getUser);
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
});
/**@admin get detail information of each user*/
router.get(
  '/:user_id',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    const _id = req.params.user_id;
    try {
      const user = await getUserById({ _id });
      if (!user) {
        res.status(404).send('User not found!');
      }
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error!');
    }
  }
);
/**@admin */
router.post(
  '/register',
  userAuthorization,
  roleBase('admin'),
  registerValidation,
  async (req, res) => {
    req.body.createdBy = req.userId;
    const {
      createdBy,
      name,
      email,
      gender,
      password,
      confirmPassword,
      active,
      role,
      send,
      level,
      classroom,
    } = req.body;
    try {
      const user = await UserSchema.findOne({ email: email.toLowerCase() });
      if (user) {
        return res
          .status(200)
          .json({ status: 'error', message: 'User is already registered' });
      }

      const hashedPass = await hashedPassword(password);
      const newObj = {
        name,
        email,
        gender,
        password: hashedPass,
        confirmPassword,
        role,
        active,
        send,
        level,
        classroom,
        createdBy,
      };
      const newUser = await registerUser(newObj);

      console.log('send email', send);
      if (send) await processEmail({ email, type: 'user-register' });
      console.log(newUser);
      return res.json({
        status: 'success',
        message: 'User Created Successfully!',
        newUser,
      });
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);
//student get profile
router.get('/student/profile', userAuthorization, async (req, res) => {
  try {
    const profile = await StudentProfileSchema.findOne({
      user: req.userId,
    }).populate({
      path: 'user',
      populate: [{ path: 'level' }, { path: 'classroom' }],
    });
    if (!profile) {
      return res
        .status(404)
        .json({ status: 'error', message: 'There is no profile found' });
    }
    return res.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json('Server Error');
  }
});
//create and update student profile
router.post('/student/profile', userAuthorization, async (req, res) => {
  const {
    country,
    firstname,
    lastname,
    father,
    mother,
    birthday,
    admission,
    address,
    contact,
    sns,
    profileImg,
    grade,
  } = req.body;

  let profileField = {};
  profileField.user = req.userId;

  if (contact) profileField.contact = contact;
  if (birthday) profileField.birthday = birthday;
  if (address) profileField.address = address;
  if (mother) profileField.mother = mother;
  if (firstname) profileField.firstname = firstname;
  if (lastname) profileField.lastname = lastname;
  if (father) profileField.father = father;
  if (admission) profileField.admission = admission;
  if (country) profileField.country = country;
  if (sns) profileField.sns = sns;
  if (profileImg) profileField.profileImg = profileImg;
  if (grade) profileField.grade = grade;

  try {
    let profile = await StudentProfileSchema.findOne({ user: req.userId });
    if (profile) {
      //update
      let profile = await StudentProfileSchema.findOneAndUpdate(
        { user: req.userId },
        { $set: profileField },
        { new: true }
      );
      let userProfile = await UserSchema.findOneAndUpdate(
        { user: req.userId },
        { $set: { profileImage: profileField.profileImg } },
        { new: true }
      );
      console.log(userProfile.profileImage);
      return res.json(profile);
    }
    //add new profile

    await new StudentProfileSchema(profileField).save();
    await UserSchema.findOneAndUpdate(
      { user: req.userId },
      { $set: { profileImage: profileField.profileImg } },
      { new: true }
    );

    return res.json('New profile added successfully');
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Unable to update the profile', err: err.message });
  }
});

//stuff get profile
router.get('/stuff/profile', userAuthorization, async (req, res) => {
  try {
    const profile = await AdminInstructorProfileSchema.findOne({
      user: req.userId,
    }).populate({
      path: 'user',
      populate: [{ path: 'level' }, { path: 'classroom' }],
    });
    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'There is no profile found, please create your profile.',
      });
    }
    return res.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: 'error', message: 'Server error!' });
  }
});

//create and update stuff profile
router.post('/stuff/profile', userAuthorization, async (req, res) => {
  const {
    bio,
    country,
    firstname,
    lastname,
    position,
    experience,
    join,
    birthday,
    address,
    contact,
    profileImg,
    facebook,
    instagram,
    lineID,
  } = req.body;

  let profileField = {};
  profileField.user = req.userId;

  if (contact) profileField.contact = contact;
  if (birthday) profileField.birthday = birthday;
  if (firstname) profileField.firstname = firstname;
  if (lastname) profileField.lastname = lastname;
  if (address) profileField.address = address;
  if (join) profileField.join = join;
  if (country) profileField.country = country;
  if (bio) profileField.bio = bio;
  if (position) profileField.position = position;
  if (experience) profileField.experience = experience;
  if (profileImg) profileField.profileImg = profileImg;

  profileField.social = {};
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  if (lineID) profileFields.social.lineID = lineID;

  try {
    let profile = await AdminInstructorProfileSchema.findOne({
      user: req.userId,
    });
    if (profile) {
      //update
      let profile = await AdminInstructorProfileSchema.findOneAndUpdate(
        { user: req.userId },
        { $set: profileField },
        { new: true }
      );
      console.log('Profile update successfully');
      return res.json({
        status: 'success',
        data: profile,
        message: 'Profile update successfully',
      });
    }
    //add new profile
    const newProfile = await new AdminInstructorProfileSchema(
      profileField
    ).save();

    return res.json({
      status: 'success',
      message: 'New profile added successfully',
      data: newProfile,
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .json({ msg: 'Unable to update the profile', err: err.message });
  }
});

//get all students profile
router.get(
  '/student/profiles',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  async (req, res) => {
    try {
      const profile = await StudentProfileSchema.find({})
        .populate('user')
        .sort({ createdAt: -1 })
        .exec();
      return res.json(profile);
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);

//get all stuffs profile
router.get('/stuff/profiles', userAuthorization, async (req, res) => {
  try {
    const profile = await AdminInstructorProfileSchema.find({})
      .sort({ createdAt: -1 })
      .exec();
    return res.json(profile);
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
});

//get student profile by id
router.get(
  '/student/profile/:user_id',
  userAuthorization,
  roleBase(['admin', 'instructor']),
  async (req, res) => {
    try {
      const user = await UserSchema.findOne({
        _id: req.params.user_id,
      });
      console.log('User', user);
      if (!user) {
        return res.status(404).send('No User Found');
      }
      console.log('User _id', user._id);
      const profile = await StudentProfileSchema.find({
        user: user._id,
      })
        .populate('user')
        .sort({ createdAt: -1 })
        .exec();
      console.log('Profile', profile);
      return res.json(profile);
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);

//get stuff profile by id
router.get('/stuff/profile/:user_id', userAuthorization, async (req, res) => {
  try {
    const user = await UserSchema.findOne({
      _id: req.params.user_id,
    });
    console.log('User', user);
    if (!user) {
      return res.status(404).send('No User Found');
    }
    console.log('User _id', user._id);
    const profile = await AdminInstructorProfileSchema.find({
      user: user._id,
    })
      .populate('user')
      .sort({ createdAt: -1 })
      .exec();
    console.log('Profile', profile);
    return res.json(profile);
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
});

/**@admin */
router.get(
  '/get/all',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const _id = req.userId; //security to make sure they are login
      if (!_id) return false;

      const users = await UserSchema.find({})
        .populate({
          path: 'createdBy',
          select: { name: 1 },
        })
        .populate({
          path: 'level',
          select: { name: 1 },
        })
        .populate({
          path: 'classroom',
          select: { name: 1 },
        })
        .sort({ createdAt: -1 })
        .exec();
      return res.json(users);
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);
router.get(
  '/get/instructor',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const _id = req.userId; //security to make sure they are login
      if (!_id) return false;

      const users = await UserSchema.find({ role: 'instructor' })
        .populate({
          path: 'createdBy',
          select: { name: 1 },
        })
        .populate({
          path: 'level',
          select: { name: 1 },
        })
        .populate({
          path: 'classroom',
          select: { name: 1 },
        })
        .sort({ createdAt: -1 })
        .exec();
      res.json(users);
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);
router.get(
  '/get/student',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const _id = req.userId; //security to make sure they are login
      if (!_id) return false;

      const users = await UserSchema.find({ role: 'student' })
        .populate({
          path: 'createdBy',
          select: { name: 1 },
        })
        .populate({
          path: 'level',
          select: { name: 1 },
        })
        .populate({
          path: 'classroom',
          select: { name: 1 },
        })
        .sort({ createdAt: -1 })
        .exec();
      console.log(users.data);
      res.json(users);
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);
//go to mongo shell and change all the classrooms to type objectId
router.get(
  '/get/admin',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const _id = req.userId; //security to make sure they are login
      if (!_id) return false;

      const users = await UserSchema.find({ role: 'admin' })
        .populate({
          path: 'createdBy',
          select: { name: 1 },
        })
        .populate({
          path: 'level',
          select: { name: 1 },
        })
        .populate({
          path: 'classroom',
          select: { name: 1 },
        })
        .sort({ createdAt: -1 })
        .exec();
      res.json(users);
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);

router.post('/login', loginValidation, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.json({
      status: 'error',
      message: 'Email and password are require',
    });

  const user = await UserSchema.findOne({ email });
  if (user && user.active) {
    const user = await getUserByEmail(email);
    const passFromDB = user && user._id ? user.password : null;

    if (!passFromDB)
      return res.json({ status: 'error', message: 'Wrong Email or Password' });

    const result = await comparePassword(password, passFromDB);
    if (!result) {
      return res.json({ status: 'error', message: 'Wrong Email or Password' });
    }

    //access token change every 2h & refreshToken=20days
    const accessJWT = await createAccessToken(
      user.role,
      user.email,
      user.name,
      `${user._id}`
    );
    const refreshJWT = await createRefreshToken(
      user.role,
      user.email,
      user.name,
      `${user._id}`
    );

    res.json({
      status: 'success',
      message: 'Login successfully',
      role: user.role,
      name: user.name,
      accessJWT,
      refreshJWT,
    });
  } else {
    return res.json({
      status: 'error',
      message:
        'Sorry, your account have been deactivated. Please contact our staff!',
    });
  }
});

//deactivate and activate user accounts
router.patch(
  '/account',
  userAuthorization,
  roleBase(['admin']),
  async (req, res) => {
    await UserSchema.findOneAndUpdate(
      { _id: req.userId },
      { $set: { active: req.body.active } },
      { new: true }
    )
      .then((account) => {
        if (account)
          return res.json({ msg: 'User account deactivate successfully!' });
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ msg: 'Unable to deactivate account', error: err.message });
      });
  }
);

router.delete('/logout', userAuthorization, async (req, res) => {
  const { authorization } = req.headers;
  try {
    const _id = req.userId;
    //delete access token from redis db & refresh token from mongo db
    deleteJWT(authorization);
    const clearRefreshToken = await storeRefreshTokenInMongoDB(_id, '');
    if (clearRefreshToken._id) {
      return res.json({ status: 'success', message: 'Logout successfully' });
    }
    res.json({ status: 'error', message: 'Unable to logout' });
  } catch (error) {
    return res.json({ status: 'error', message: error.message });
  }
});

router.post('/reset_password', reqPinValidation, async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (user && user._id) {
    const setPin = await setPasswordPin(email);
    //send pin number to user
    console.log('here!!!');
    await processEmail({ email, pin: setPin.pin, type: 'request-pin' });

    return res.json({
      status: 'success',
      message: 'If email exist in database, email will send shortly!',
    });
  }
  res.json({
    status: 'error',
    message: 'If email exist in database, email will send shortly!',
  });
});

router.patch('/reset_password', updatePassValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body;

  //Check if the pin & password are exist
  const getPin = await checkEmailPin(email, pin);
  if (getPin && getPin?._id) {
    const dbDate = getPin.addedAt;
    const numExpiredDay = process.env.PIN_EXPIRED_DAY;
    let expDay = dbDate.setDate(dbDate.getDate() + numExpiredDay);
    const today = new Date();
    if (today > expDay) {
      return res.json({ status: 'error', message: 'Invalid or pin expired' });
    }

    //encrypt new password
    const encryptNewPass = await hashedPassword(newPassword);
    const updatePassUser = await updateNewPassword(email, encryptNewPass);
    if (updatePassUser?._id) {
      //send email to user
      await processEmail({ email, type: 'update-password' });
      deletePin(email, pin);
      return res.json({
        status: 'success',
        message: 'password updated!',
      });
    }
  }
  res.json({
    status: 'error',
    message: 'unable to update password!',
  });
});

/**@users*/
router.patch('/setting/password', userAuthorization, async (req, res) => {
  try {
    const _id = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (newPassword.length <= 6) {
      return res.json({
        status: 'error',
        message: 'Your password should have at least 6 characters',
      });
    }

    const user = await UserSchema.findById({ _id }).select('+password');
    const isPassword = await comparePassword(currentPassword, user.password);

    if (!isPassword) {
      return res.json({
        status: 'error',
        message: 'Invalid password',
      });
    }

    user.password = await hashedPassword(newPassword);
    await user.save();

    return res.json({
      status: 'success',
      message: 'Your password has been updated',
    });
  } catch (error) {
    console.log(error);
    return res.json({ status: 'error', message: error.message });
  }
});

/**@admin */
router.patch(
  '/update_info/admin/:user_id/',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const _id = req.params.user_id;
      const {
        name,
        email,
        gender,
        classroom,
        role,
        active,
        level,
        send,
        password,
        confirmPassword,
      } = req.body;
      console.log('Send = ', send);
      const user = await getUserById({ _id });

      if (user._id) {
        const newHashedPass = await hashedPassword(password);
        const newObj = {
          name,
          email,
          gender,
          classroom,
          role,
          active,
          level,
          send,
          password: newHashedPass,
          confirmPassword,
        };
        const updateUser = await updateUserInfo({ _id, newObj });
        if (updateUser._id) {
          if (send) await processEmail({ email, type: 'user-update' });
          return res.json({
            status: 'success',
            message: 'User has been updated',
            password: updateUser.password,
          });
        }
      } else {
        return res.json({
          status: 'error',
          message: 'Unable to update the user',
        });
      }
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);

/**@admin */
router.delete(
  '/delete/admin/:user_id/',
  userAuthorization,
  roleBase('admin'),
  async (req, res) => {
    try {
      const _id = req.params.user_id;
      const user = await getUserById({ _id });
      if (user._id) {
        await deleteUser({ _id });
        return res.json({
          status: 'success',
          message: 'User delete successfully',
        });
      } else {
        return res.json({ message: 'User does not exist' });
      }
    } catch (error) {
      return res.json({ status: 'error', message: error.message });
    }
  }
);

module.exports = router;
