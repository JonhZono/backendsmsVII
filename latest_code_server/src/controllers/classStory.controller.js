const ClassStorySchema = require('../models/class_stories/ClassStory.schema');
const CommentSchema = require('../models/class_stories/Comment.schema');

exports.createClassStory = async (req, res) => {
  /* Image upload process
  1. resize image in frontend  
  2. call upload API route and upload image to S3 cloud
  3. get image url from cloud and pass from frontend and store in database
  */
  const story = new ClassStorySchema({
    filesImgVdo: req.body.filesImgVdo,
    postedBy: req.userId,
    level: req.body.level,
    title: req.body.title,
    caption: req.body.caption,
  });
  try {
    await story.save().then((data) => {
      if (data._id) {
        console.log(data);
        /*make sure fcmToken is available in user model
          if(event.postedBy.fcmToken){
            const res = await sendNotificationToSingleDevice({report.postedBy.fcmToken, report.classroom, 'Article'}); //need fcmToken in order to test the push notification
          }
        */
      }
      return res.status(200).json({
        status: 'success',
        message: 'Class story uploaded successfully',
        data,
      });
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      status: 'error',
      message: error.message,
    });
  }
};
exports.updateClassStory = async (req, res) => {
  try {
    const { cid } = req.params;
    const story = await ClassStorySchema.findById({ _id: cid });

    if (story) {
      await ClassStorySchema.findOneAndUpdate({ _id: cid }, req.body, {
        new: true,
      });
      return res.json({
        status: 'success',
        message: 'Class story has been updated',
      });
    } else {
      return res.json({ status: 'false', message: 'Class story not found' });
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};
exports.getClassStory = async (req, res) => {
  try {
    await ClassStorySchema.findById(
      { _id: req.params.cid },
      { comments: 0, likes: 0 }
    )
      .populate({ path: 'level', select: { name: 1 } })
      .populate({ path: 'postedBy', select: { name: 1 } })
      .then((story) => {
        console.log(story);
        return res.json({ status: 'success', data: story });
      });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};
exports.getClassStories = async (req, res) => {
  try {
    await ClassStorySchema.find()
      .populate({
        path: 'comments',
        populate: { path: 'writer', select: { name: 1 } },
      })
      .populate({ path: 'level', select: { name: 1 } })
      .populate({ path: 'postedBy', select: { name: 1 } })
      .populate({ path: 'likes', select: { name: 1 } })
      .sort({ createdAt: -1 })
      .then((story) => {
        return res.json({ status: 'success', data: story });
      });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};
exports.removeClassStory = async (req, res) => {
  try {
    if (req.role === 'admin') {
      await ClassStorySchema.findByIdAndDelete({ _id: req.params.cid });
      return res.json({
        status: 'success',
        message: 'Class Story deleted successfully',
      });
    } else {
      const story = await ClassStorySchema.findOne({
        $and: [{ _id: req.params.cid }, { postedBy: req.userId }],
      });

      if (story) {
        await ClassStorySchema.findByIdAndDelete({ _id: req.params.cid });
        return res.json({
          status: 'success',
          message: 'Class Story deleted successfully',
        });
      } else {
        return res.json({
          status: 'false',
          message: 'Class Story not found',
        });
      }
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { cid } = req.params;
    const comment = new CommentSchema({
      writer: req.userId,
      text: req.body.text,
    });
    await comment.save();
    //push comment to post
    const classRelated = await ClassStorySchema.findById({ _id: cid });
    if (classRelated) {
      //might implement push notification or socket.io
      classRelated.comments.push(comment);
      await classRelated
        .save()
        .then(() => {
          return res.json({
            status: 'success',
            message: 'You have been commented',
          });
        })
        .catch((error) => reject(error));
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};
exports.updateComment = async (req, res) => {
  try {
    const { cmt_id } = req.params;
    const postedBy = req.userId;
    const comment = await CommentSchema.findOne({
      $and: [{ _id: cmt_id }, { writer: postedBy }],
    });

    if (comment) {
      await CommentSchema.findByIdAndUpdate({ _id: cmt_id }, req.body, {
        new: true,
      });
      return res.json({
        status: 'success',
        message: 'Comment updated successfully',
      });
    } else {
      return res.json({ status: 'false', message: 'Comment not found' });
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};
//for update single comment
exports.getComment = async (req, res) => {
  try {
    const { cmt_id } = req.params;
    await CommentSchema.findOne({
      _id: cmt_id,
    })
      .then((comment) => {
        return res.json({ status: 'success', data: comment });
      })
      .catch((error) => {
        console.log(error.message);
        return res.json({ status: 'error', message: error.message });
      });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};
exports.removeComment = async (req, res) => {
  try {
    const { cmt_id } = req.params;
    const postedBy = req.userId;
    if (req.role === 'admin') {
      await CommentSchema.findByIdAndDelete({ _id: cmt_id });
      return res.json({
        status: 'success',
        message: 'Comment deleted successfully',
      });
    } else {
      const comment = await CommentSchema.findOne({
        $and: [{ _id: cmt_id }, { writer: postedBy }],
      });

      if (comment) {
        await CommentSchema.findByIdAndDelete({ _id: cmt_id });
        return res.json({
          status: 'success',
          message: 'Comment deleted successful',
        });
      } else {
        return res.json({ status: 'false', message: 'Comment not found' });
      }
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { _id } = req.params;
    const postedBy = req.userId;
    const story = await ClassStorySchema.findById({ _id });
    console.log(story.likes);
    //POST ALREADY LIKE
    if (
      story.likes &&
      story.likes.filter((like) => like._id.toString() === req.userId).length >
        0
    ) {
      return res.status(400).json({ message: 'Post already liked' });
    } else {
      await ClassStorySchema.findByIdAndUpdate(
        { _id },
        {
          $push: { likes: postedBy },
        },
        { new: true }
      )
        .populate('likes', '_id name')
        .then(() => {
          return res.json({
            status: 'success',
            message: 'You like...',
          });
        });
    }
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};
exports.unlikePost = async (req, res) => {
  try {
    const { _id } = req.params;
    const postedBy = req.userId;
    await ClassStorySchema.findByIdAndUpdate(
      { _id },
      {
        $pull: { likes: postedBy },
      },
      { new: true }
    ).then(() => {
      return res.json({
        status: 'success',
        message: 'You unlike...',
      });
    });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};
