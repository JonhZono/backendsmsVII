const { FeedbackSchema } = require('../models/feedback/Feedback.schema');
const { UserSchema } = require('../models/user/User.schema');

exports.createFeedback = async (req, res) => {
  try {
    const feedback = await new FeedbackSchema({
      receiver: req.body.receiver,
      teacher: req.userId,
      classCodes: req.body.classCodes,
      classroom: req.body.classroom,
      level: req.body.level,
      content: req.body.content,
      note: req.body.note,
      //reviewContent: req.body.reviewContent,
      //ratingsSpeaking: req.body.ratingsSpeaking,
      ratingS: req.body.ratingS,
      speakings: req.body.speakings,
      //ratingsListening: req.body.ratingsListening,
      ratingL: req.body.ratingL,
      listenings: req.body.listenings,
      //ratingsWriting: req.body.ratingsWriting,
      ratingW: req.body.ratingW,
      writings: req.body.writings,
      //ratingsReading: req.body.ratingsReading,
      ratingR: req.body.ratingR,
      readings: req.body.readings,
      send: req.body.send,
      createdAt: req.body.createdAt || Date.now(),
    }).save();
    /**Check if user is an admin both #frontend and #backend
     * NOTE: Once the teacher choose the receiver, will get the fcmToken automatically
     * from user model to perform the push notification but if the send CHECK BOX is not
     * check, notification will be pending until the admin check
     */
    if (req.role === 'admin' && feedback.send) {
      const user = await UserSchema.findById({ _id: req.body.receiver });
      if (user && user.fcmToken) {
        console.log(user.fcmToken, 'Push notification sent');
        //make sure fcmToken is available in user model
        //send push notification to user
        /*
          const res = await sendNotificationToSingleDevice(
            user.fcmToken,
            feedback.content,
            'Class Feedback'
          ); //need fcmToken in order to test the push notification
          console.log(res);
          return res.json({
            status: 'success',
            message: 'The report has been updated',
            report,
          });
        */
      }
      console.log(feedback);
      return res.json({
        feedback,
        message: 'Feedback created along with push notification',
      });
    } else {
      return res.json({ feedback, message: 'Feedback Created' });
    }
  } catch (error) {
    console.log(error.message);
    res.json('Failed to create feedback!');
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const _id = req.params.feedback_id;
    const feedback = await FeedbackSchema.findOneAndUpdate(
      { _id },
      {
        $set: req.body,
      },
      { new: true }
    );

    if (req.role === 'admin' && feedback.send) {
      const user = await UserSchema.findById({ _id: req.body.receiver });
      if (user && user.fcmToken) {
        console.log('Push notification sent');
        /*
            const res = await sendNotificationToSingleDevice(
              user.fcmToken,
              feedback.content,
              'Class Feedback'
            ); //need fcmToken in order to test the push notification
            console.log(res);
            return res.json({
              status: 'success',
              message: 'The report has been updated',
              report,
            });
          */
      }
      return res.json({ feedback, message: 'Feedback Update' });
    } else {
      return res.json({ feedback, message: 'Feedback Updated' });
    }
  } catch (error) {
    console.log(error.message);
    res.json('Failed to update feedback!');
  }
};
exports.updateSendFeedback = async (req, res) => {
  console.log('send = ', req.body.send);
  try {
    await FeedbackSchema.findOneAndUpdate(
      {
        _id: req.params.feedback_id,
        send: false,
      },
      {
        $set: {
          send: req.body.send,
        },
      },
      { new: true }
    ).exec();
    return res.json('Feedback send successfully');
  } catch (error) {
    console.log(error.message);
    return res.json('Failed to update feedback!');
  }
};
exports.updateReviewFeedback = async (req, res) => {
  try {
    await FeedbackSchema.findByIdAndUpdate(
      { _id: req.params.feedback_id },
      {
        $set: {
          'reviewFeedback.teacher': req.userId,
          'reviewFeedback.content': req.body.content,
          'reviewFeedback.updatedAt': Date.now(),
        },
      },
      { new: true }
    ).exec();
    return res.json('Review Feedback Added');
  } catch (error) {
    console.log(error);
    res.json('Failed to add review feedback!');
  }
};
//adding cmt $push
exports.pushComment = async (req, res) => {
  console.log(req.body.text);
  try {
    if (req.body.text === undefined) {
      return res.json('Please enter your comment!');
    }
    const feedback = await FeedbackSchema.findById({
      _id: req.params.feedback_id,
    });
    if (feedback) {
      const comment = {
        text: req.body.text,
        postedBy: req.userId,
      };
      feedback.comments.push(comment);
      await feedback.save();
      return res.json('Comment Added, Thank You');
    } else {
      return res.json('No feedback found');
    }
  } catch (error) {
    console.log(error);
    res.json('Failed to add comment!');
  }
};

exports.updateComment = async (req, res) => {
  console.log('feedback id ', req.params.feedback_id);
  console.log('comment id ', req.params.comment_id);
  try {
    const feedback = await FeedbackSchema.findById({
      _id: req.params.feedback_id,
    });
    if (!feedback) return res.status(404).send('Feedback not found');

    const comment = feedback.comments.find(
      (comment) => comment._id.toString() == req.params.comment_id
    );
    if (!comment) return res.status(404).send('Comment not found');

    const existingCommentObject = await feedback.comments.find(
      (comment) => comment.postedBy.toString() === req.userId
    );

    await FeedbackSchema.updateOne(
      { comments: { $elemMatch: existingCommentObject } },
      {
        $set: {
          'comments.$.text': req.body.text,
          'comments.$.date': Date.now(),
        },
      },
      { new: true }
    );
    return res.json('Comment Updated');
  } catch (error) {
    console.log(error);
    res.json('Failed to update comment!');
  }
};
//delete :feedback_id :cmt_id 💯
exports.deleteComment = async (req, res) => {
  try {
    const feedback = await FeedbackSchema.findById({
      _id: req.params.feedback_id,
    });
    if (!feedback) return res.status(404).send('Feedback not found');
    /**
     * but if use == need comment._id.toString()
     */
    const comment = feedback.comments.find(
      (comment) => comment._id.toString() == req.params.comment_id
    );
    if (!comment) return res.status(404).send('Comment not found');

    const deleteComment = async () => {
      const removeIndexOf = feedback.comments
        .map((comment) => comment._id)
        .indexOf(req.params.comment_id);
      await feedback.comments.splice(removeIndexOf, 1);
      await feedback.save();
      return res.json('Comment deleted');
    };
    if (comment.postedBy.toString() == req.userId) {
      await deleteComment();
    } else {
      return res.json('You can not delete this comment!');
    }
    /**
     * if (comment.postedBy.toString() !== req.userId) {
     *     console.log('Comment', comment.postedBy, req.role);
      if (req.role === 'admin') {
        await deleteComment();
      }
    } else if (comment.postedBy.toString() == req.userId) {
      await deleteComment();
    } else {
      return res.status(401).send('Unauthorized');
    }
     */
  } catch (error) {
    console.log(error);
    res.json('Failed to delete comment!');
  }
};

exports.getComment = async (req, res) => {
  try {
    const feedback = await FeedbackSchema.findOne({
      _id: req.params.feedback_id,
      comments: { $in: [req.params.comment_id] },
    });
    if (!feedback) return res.status(404).send('Feedback not found');

    return res.json(feedback.comments);
  } catch (error) {
    console.log(error.message);
    return res.json(error.message);
  }
};

exports.adminTeacherGetNewListsFeedback = async (req, res) => {
  try {
    //const feedbacks = await FeedbackSchema.find({}, {seen: 0}) "seen" field will not return
    //const feedbacks = await FeedbackSchema.find({}, {seen: 1}) return only field "seen" and field with ObjectId
    const feedbacks = await FeedbackSchema.find({ send: false })
      .sort({ createdAt: -1 })
      .populate({
        path: 'receiver',
        select: { name: 1 },
      })
      .populate({
        path: 'teacher',
        select: { name: 1 },
      })
      .populate({
        path: 'level',
        select: { name: 1 },
      })
      .populate({
        path: 'classCodes',
        select: { name: 1 },
      })
      .populate({
        path: 'classroom',
        select: { name: 1 },
      })
      .populate({
        path: 'reviewFeedback',
        populate: { path: 'teacher', select: 'name' },
      })
      .populate({
        path: 'reviewContent',
        select: { text: 1 },
      })
      .populate({
        path: 'listenings',
        select: { cmt: 1 },
      })
      .populate({
        path: 'speakings',
        select: { cmt: 1 },
      })
      .populate({
        path: 'writings',
        select: { cmt: 1 },
      })
      .populate({
        path: 'readings',
        select: { cmt: 1 },
      });
    //might need to populate cmt too
    return res.json(feedbacks);
  } catch (error) {
    console.log(error);
    res.json({ status: 'error', message: error.message });
  }
};
exports.adminTeacherGetSentListsFeedback = async (req, res) => {
  try {
    //const feedbacks = await FeedbackSchema.find({}, {seen: 0}) "seen" field will not return
    //const feedbacks = await FeedbackSchema.find({}, {seen: 1}) return only field "seen" and field with ObjectId
    const feedbacks = await FeedbackSchema.find({ send: true })
      .sort({ createdAt: -1 })
      .populate({
        path: 'receiver',
        select: { name: 1 },
      })
      .populate({
        path: 'teacher',
        select: { name: 1 },
      })
      .populate({
        path: 'level',
        select: { name: 1 },
      })
      .populate({
        path: 'classCodes',
        select: { name: 1 },
      })
      .populate({
        path: 'classroom',
        select: { name: 1 },
      })
      .populate({
        path: 'reviewFeedback',
        populate: { path: 'teacher', select: 'name' },
      })
      .populate({
        path: 'reviewContent',
        select: { text: 1 },
      })
      .populate({
        path: 'listenings',
        select: { cmt: 1 },
      })
      .populate({
        path: 'speakings',
        select: { cmt: 1 },
      })
      .populate({
        path: 'writings',
        select: { cmt: 1 },
      })
      .populate({
        path: 'readings',
        select: { cmt: 1 },
      });
    //might need to populate cmt too
    return res.json(feedbacks);
  } catch (error) {
    console.log(error);
    res.json({ status: 'error', message: error.message });
  }
};

exports.adminTeacherFeedbackById = async (req, res) => {
  try {
    const feedback = await FeedbackSchema.findById({ _id: req.params._id });
    return res.json(feedback);
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

exports.adminTeacherGetDetailFeedback = async (req, res) => {
  try {
    const feedback = await FeedbackSchema.findById({
      _id: req.params.feedback_id,
    })
      .populate({
        path: 'receiver',
        select: { name: 1, profileImage: 1 },
      })
      .populate({
        path: 'teacher',
        select: { name: 1 },
      })
      .populate({ path: 'level', select: { name: 1 } })
      .populate({
        path: 'classCodes',
        select: { name: 1 },
      })
      .populate({
        path: 'classroom',
        select: { name: 1 },
      })
      .populate({
        path: 'reviewFeedback',
        populate: { path: 'teacher', select: 'name' },
      })
      .populate({
        path: 'reviewContent',
        select: { text: 1 },
      })
      .populate({
        path: 'listenings',
        select: { name: 1 },
      })
      .populate({
        path: 'speakings',
        select: { name: 1 },
      })
      .populate({
        path: 'writings',
        select: { name: 1 },
      })
      .populate({
        path: 'readings',
        select: { name: 1 },
      })
      .populate('comments.postedBy');
    return res.json(feedback);
  } catch (error) {
    console.log(error.message);
    res.json({ status: 'error', message: error.message });
  }
};

exports.studentGetListsFeedback = async (req, res) => {
  try {
    const reports = await FeedbackSchema.find({
      receiver: req.userId,
      send: true,
    });
    return res.json(reports);
  } catch (error) {
    console.log(error.message);
    res.json({ status: 'error', message: 'Unable to find reports' });
  }
};

exports.studentGetDetailFeedback = async (req, res) => {
  try {
    const report = await FeedbackSchema.find({
      _id: req.params._id,
      receiver: req.userId,
    });
    return res.json(report);
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
};

exports.removeFeedback = async (req, res) => {
  try {
    await FeedbackSchema.findOneAndDelete({ _id: req.params._id });
    return res.json('Feedback deleted');
  } catch (error) {
    console.log(error.message);
    res.json('Fail to delete feedback!');
  }
};

exports.getAverageRatingsForEachSkill = async (req, res) => {
  try {
    //some code go here
  } catch (error) {
    console.log(error.message);
  }
};

exports.getAverageRatingsEachSkillForStudent = async (req, res) => {
  try {
    const findRating = await FeedbackSchema.find({
      receiver: req.params.receiver_id,
      //will add level query later
    }).select('ratingL ratingS ratingR ratingW');
    console.log('Rating Length', findRating.length);
    let totalSpeaking = 0;
    let totalWriting = 0;
    let totalListening = 0;
    let totalReading = 0;
    let lengthS = findRating.length;
    let lengthR = findRating.length;
    let lengthL = findRating.length;
    let lengthW = findRating.length;

    findRating.forEach((rating) => {
      console.log('Speaking star = ', rating.ratingS);
      totalSpeaking += rating.ratingS;
    });
    console.log('Total speaking', totalSpeaking);
    console.log('lengthS = ', lengthS);
    let highestS = lengthS * 5;
    let resultOfSpeakingRate = (totalSpeaking * 5) / highestS;
    console.log('Average Speaking Rate ---> ', resultOfSpeakingRate);

    findRating.forEach((rating) => {
      totalWriting += rating.ratingW;
    });
    let highestW = lengthW * 5;
    let resultOfWritingRate = (totalWriting * 5) / highestW;

    findRating.forEach((rating) => {
      totalReading += rating.ratingR;
    });
    let highestR = lengthR * 5;
    let resultOfReadingRate = (totalReading * 5) / highestR;

    findRating.forEach((rating) => {
      totalListening += rating.ratingL;
    });
    let highestL = lengthL * 5;
    let resultOfListeningRate = (totalListening * 5) / highestL;

    return res.json({
      writing: resultOfWritingRate.toFixed(1),
      speaking: resultOfSpeakingRate.toFixed(1),
      listening: resultOfListeningRate.toFixed(1),
      reading: resultOfReadingRate.toFixed(1),
    });
    //return res.json(totalRating);
  } catch (error) {
    console.log(error.message);
  }
};

// /filter-average-ratings?receiver=AA&receiver=BB
exports.filterAverageRatingsEachSkillForStudent = async (req, res) => {
  let receiver = req.query.receiver;
  try {
    let result = [];
    for (let id of receiver) {
      const user = await UserSchema.findById({ _id: id })
        .select('name classroom profileImage level')
        .populate({ path: 'level', select: { name: 1 } });
      const findRating = await FeedbackSchema.find({
        receiver: id,
        //will add level query later
      })
        .select('ratingL ratingS ratingR ratingW level classroom')
        .populate({
          path: 'level',
          select: { name: 1 },
        })
        .populate({
          path: 'classname',
          select: { name: 1 },
        });

      let totalSpeaking = 0;
      let totalWriting = 0;
      let totalListening = 0;
      let totalReading = 0;
      let lengthS = findRating.length;
      let lengthR = findRating.length;
      let lengthL = findRating.length;
      let lengthW = findRating.length;

      findRating.forEach((rating) => {
        totalSpeaking += rating.ratingS;
      });
      let highestS = lengthS * 5;
      let resultOfSpeakingRate = (totalSpeaking * 5) / highestS;
      let roundedS =
        Math.round((resultOfSpeakingRate + Number.EPSILON) * 10) / 10;

      findRating.forEach((rating) => {
        totalWriting += rating.ratingW;
      });
      let highestW = lengthW * 5;
      let resultOfWritingRate = (totalWriting * 5) / highestW;
      let roundedW =
        Math.round((resultOfWritingRate + Number.EPSILON) * 10) / 10;

      findRating.forEach((rating) => {
        totalReading += rating.ratingR;
      });
      let highestR = lengthR * 5;
      let resultOfReadingRate = (totalReading * 5) / highestR;
      let roundedR =
        Math.round((resultOfReadingRate + Number.EPSILON) * 10) / 10;

      findRating.forEach((rating) => {
        totalListening += rating.ratingL;
      });
      let highestL = lengthL * 5;
      let resultOfListeningRate = (totalListening * 5) / highestL;
      let roundedL =
        Math.round((resultOfListeningRate + Number.EPSILON) * 10) / 10;

      result.push({
        writing: roundedW,
        speaking: roundedS,
        listening: roundedL,
        reading: roundedR,
        ratingData: findRating,
        userData: user,
      });
    }
    /**calculate it in the frontend for each  result and sort it base on the highest average rating star */
    // for (let i = 0; i < result.length; i++) {
    //   const values = Object.values(result[i]);
    //   const sum = values.reduce((acc, value) => {
    //     return acc + value;
    //   });

    //   sumObjValue.push(sum);
    //   console.log(sumObjValue);
    // }

    return res.json(result);
  } catch (error) {
    console.log(error.message);
  }
};

exports.filterAverageRatingsEachSkillForAStudent = async (req, res) => {
  let receiver = req.query.receiver;
  console.log('receiver id', receiver);
  try {
    let result = [];
    const user = await UserSchema.findById({ _id: receiver })
      .select('name classroom profileImage level')
      .populate({ path: 'level', select: { name: 1 } })
      .populate({
        path: 'classroom',
        select: { name: 1 },
      });
    const findRating = await FeedbackSchema.find({
      receiver,
      //will add level query later
    })
      .select('ratingL ratingS ratingR ratingW level classroom')
      .populate({
        path: 'level',
        select: { name: 1 },
      })
      .populate({
        path: 'classroom',
        select: { name: 1 },
      });

    let totalSpeaking = 0;
    let totalWriting = 0;
    let totalListening = 0;
    let totalReading = 0;
    let lengthS = findRating.length;
    let lengthR = findRating.length;
    let lengthL = findRating.length;
    let lengthW = findRating.length;

    findRating.forEach((rating) => {
      totalSpeaking += rating.ratingS;
    });
    let highestS = lengthS * 5;
    let resultOfSpeakingRate = (totalSpeaking * 5) / highestS;
    let roundedS =
      Math.round((resultOfSpeakingRate + Number.EPSILON) * 10) / 10;

    findRating.forEach((rating) => {
      totalWriting += rating.ratingW;
    });
    let highestW = lengthW * 5;
    let resultOfWritingRate = (totalWriting * 5) / highestW;
    let roundedW = Math.round((resultOfWritingRate + Number.EPSILON) * 10) / 10;

    findRating.forEach((rating) => {
      totalReading += rating.ratingR;
    });
    let highestR = lengthR * 5;
    let resultOfReadingRate = (totalReading * 5) / highestR;
    let roundedR = Math.round((resultOfReadingRate + Number.EPSILON) * 10) / 10;

    findRating.forEach((rating) => {
      totalListening += rating.ratingL;
    });
    let highestL = lengthL * 5;
    let resultOfListeningRate = (totalListening * 5) / highestL;
    let roundedL =
      Math.round((resultOfListeningRate + Number.EPSILON) * 10) / 10;

    result.push({
      writing: roundedW,
      speaking: roundedS,
      listening: roundedL,
      reading: roundedR,
      ratingData: findRating,
      userData: user,
      test: 'testing',
    });

    return res.json(result);
  } catch (error) {
    console.log(error.message);
  }
};

/**query base on level will do it later*/

/**Ratings 1->5
 * Calculate the average rating for each user base on all of their feedbacks
 * that match with their id
 */
// exports.ratingsWriting = async (req, res) => {
//   try {
//     const feedback = await FeedbackSchema.findById({
//       _id: req.params.feedback_id,
//     });
//     if (!feedback) return res.status(404).send('Feedback not found');

//     //Who is updating
//     const existingRatingObject = await feedback.ratingsWriting.find(
//       (rating) => rating.postedBy.toString() === req.userId
//     );

//     //Push rating
//     if (existingRatingObject === undefined) {
//       const addedRating = await FeedbackSchema.findByIdAndUpdate(
//         { _id: req.params.feedback_id },
//         {
//           $push: {
//             ratingsWriting: {
//               writingStar: req.body.writingStar,
//               postedBy: req.userId,
//             },
//           },
//         },
//         { new: true }
//       ).exec();
//       console.log('Rating Added', addedRating);
//       return res.json(addedRating);
//     } else {
//       //update rating
//       await FeedbackSchema.updateOne(
//         { ratingsWriting: { $elemMatch: existingRatingObject } },
//         {
//           $set: {
//             'ratingsWriting.$.writingStar': req.body.writingStar,
//           },
//         },
//         { new: true }
//       ).exec();
//       return res.json('Writing Rating Updated');
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.json('Fail to rating');
//   }
// };
// exports.getTotalRatingsForEachSkill = async (req, res) => {
//   try {
//     const findRatings = await FeedbackSchema.find({
//       receiver: req.params.receiver_id,
//     });
//     let totalSpeaking = 0;
//     let totalWriting = 0;
//     let totalListening = 0;
//     let totalReading = 0;
//     let lengthS = 0;
//     let lengthR = 0;
//     let lengthL = 0;
//     let lengthW = 0;

//     findRatings.forEach((rating) => {
//       console.log('Speaking star = ', rating.ratingsSpeaking[0]);
//       totalSpeaking += rating.ratingsSpeaking[0].speakingStar;
//       lengthS += rating.ratingsSpeaking.length;
//     });
//     let highestS = lengthS * 5;
//     let resultOfSpeakingRate = (totalSpeaking * 5) / highestS;
//     console.log('Average Speaking Rate ---> ', resultOfSpeakingRate);

//     findRatings.forEach((rating) => {
//       totalWriting += rating.ratingsWriting[0].writingStar;
//       lengthW += rating.ratingsWriting.length;
//     });
//     let highestW = lengthW * 5;
//     let resultOfWritingRate = (totalWriting * 5) / highestW;
//     console.log('Average Writing Rate ---> ', resultOfWritingRate);

//     findRatings.forEach((rating) => {
//       totalListening += rating.ratingsListening[0].listeningStar;
//       lengthL += rating.ratingsListening.length;
//     });
//     let highestL = lengthL * 5;
//     let resultOfListeningRate = (totalListening * 5) / highestL;
//     console.log('Average Listening Rate ---> ', resultOfListeningRate);

//     findRatings.forEach((rating) => {
//       totalReading += rating.ratingsReading[0].readingStar;
//       lengthR += rating.ratingsReading.length;
//     });
//     let highestR = lengthR * 5;
//     let resultOfReadingRate = (totalReading * 5) / highestR;
//     console.log('Average Reading Rate ---> ', resultOfReadingRate);

//     return res.json({
//       writing: resultOfWritingRate,
//       speaking: resultOfSpeakingRate,
//       listening: resultOfListeningRate,
//       reading: resultOfReadingRate,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.json('Fail to get calculate ratings');
//   }
// };

// exports.ratingsSpeaking = async (req, res) => {
//   try {
//     const feedback = await FeedbackSchema.findById({
//       _id: req.params.feedback_id,
//     });
//     if (!feedback) return res.status(404).send('Feedback not found');

//     //Who is updating
//     const existingRatingObject = await feedback.ratingsSpeaking.find(
//       (rating) => rating.postedBy.toString() === req.userId
//     );

//     //Push rating
//     if (existingRatingObject === undefined) {
//       const addedRating = await FeedbackSchema.findByIdAndUpdate(
//         { _id: req.params.feedback_id },
//         {
//           $push: {
//             ratingsSpeaking: {
//               speakingStar: req.body.speakingStar,
//               postedBy: req.userId,
//             },
//           },
//         },
//         { new: true }
//       ).exec();
//       console.log('Rating Added', addedRating);
//       return res.json(addedRating);
//     } else {
//       //update rating
//       await FeedbackSchema.updateOne(
//         { ratingsSpeaking: { $elemMatch: existingRatingObject } },
//         {
//           $set: {
//             'ratingsSpeaking.$.speakingStar': req.body.speakingStar,
//           },
//         },
//         { new: true }
//       ).exec();
//       return res.json('Speaking Rating Updated');
//     }
//   } catch (error) {
//     console.log(error);
//     res.json('Fail to rating');
//   }
// };

// exports.ratingsListening = async (req, res) => {
//   try {
//     const feedback = await FeedbackSchema.findById({
//       _id: req.params.feedback_id,
//     });
//     if (!feedback) return res.status(404).send('Feedback not found');

//     //Who is updating
//     const existingRatingObject = await feedback.ratingsListening.find(
//       (rating) => rating.postedBy.toString() === req.userId
//     );

//     //Push rating
//     if (existingRatingObject === undefined) {
//       const addedRating = await FeedbackSchema.findByIdAndUpdate(
//         { _id: req.params.feedback_id },
//         {
//           $push: {
//             ratingsListening: {
//               listeningStar: req.body.listeningStar,
//               postedBy: req.userId,
//             },
//           },
//         },
//         { new: true }
//       ).exec();
//       console.log('Rating Added', addedRating);
//       return res.json(addedRating);
//     } else {
//       //update rating
//       await FeedbackSchema.updateOne(
//         { ratingsListening: { $elemMatch: existingRatingObject } },
//         {
//           $set: {
//             'ratingsListening.$.listeningStar': req.body.listeningStar,
//           },
//         },
//         { new: true }
//       ).exec();
//       return res.json('Listening Rating Updated');
//     }
//   } catch (error) {
//     console.log(error);
//     res.json('Fail to rating');
//   }
// };

// exports.ratingsReading = async (req, res) => {
//   try {
//     const feedback = await FeedbackSchema.findById({
//       _id: req.params.feedback_id,
//     });
//     if (!feedback) return res.status(404).send('Feedback not found');

//     //Who is updating
//     const existingRatingObject = await feedback.ratingsReading.find(
//       (rating) => rating.postedBy.toString() === req.userId
//     );

//     //Push rating
//     if (existingRatingObject === undefined) {
//       const addedRating = await FeedbackSchema.findByIdAndUpdate(
//         { _id: req.params.feedback_id },
//         {
//           $push: {
//             ratingsReading: {
//               readingStar: req.body.readingStar,
//               postedBy: req.userId,
//             },
//           },
//         },
//         { new: true }
//       ).exec();
//       console.log('Rating Added', addedRating);
//       return res.json(addedRating);
//     } else {
//       //update rating
//       await FeedbackSchema.updateOne(
//         { ratingsReading: { $elemMatch: existingRatingObject } },
//         {
//           $set: {
//             'ratingsReading.$.readingStar': req.body.readingStar,
//           },
//         },
//         { new: true }
//       ).exec();
//       return res.json('Reading Rating Updated');
//     }
//   } catch (error) {
//     console.log(error);
//     res.json('Fail to rating');
//   }
// };
