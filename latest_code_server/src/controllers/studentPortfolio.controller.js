const {
  CounselingNoteSchema,
} = require('../models/studentPortfolio/counselingNote.schema');
const {
  EventParticipantHistorySchema,
} = require('../models/studentPortfolio/eventParticipantHistory.schema');
const {
  UnitPresentationSchema,
} = require('../models/studentPortfolio/unitPresentation.schema');
const {
  StudentNoticePointSchema,
} = require('../models/studentPortfolio/studentNoticePoint.schema');

/**Counseling Note Controller*/
exports.addCounselingNote = async (req, res) => {
  try {
    const note = await new CounselingNoteSchema({
      student: req.body.student,
      createdBy: req.userId,
      title: req.body.title,
      date: req.body.date,
      note: req.body.note,
    }).save();
    console.log(note);
    return res.json({ msg: 'Note add successfully' });
  } catch (err) {
    return res.json({ msg: 'Unable to add note', error: err.message });
  }
};

exports.editCounselingNote = async (req, res) => {
  try {
    const note = await CounselingNoteSchema.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: req.body },
      { new: true }
    );
    console.log(note);
    return res.json({ msg: 'Note update successfully' });
  } catch (err) {
    return res.json({ msg: 'Unable to update note', error: err.message });
  }
};

exports.getCounselingNotes = async (req, res) => {
  try {
    console.log(req.userId);
    const note = await CounselingNoteSchema.find({
      student: req.userId,
    }).populate('createdBy', 'name');
    return res.json(note);
  } catch (err) {
    return res.json({ msg: 'Unable to get notes', error: err.message });
  }
};
exports.getCounselingNote = async (req, res) => {
  try {
    const note = await CounselingNoteSchema.findOne({
      _id: req.params.id,
    }).populate('createdBy', 'name');
    return res.json(note);
  } catch (err) {
    return res.json({ msg: 'Unable to get notes', error: err.message });
  }
};
exports.removeCounselingNote = async (req, res) => {
  try {
    await CounselingNoteSchema.findOneAndDelete({
      _id: req.params.id,
    });
    return res.json({ msg: 'Note remove successfully' });
  } catch (err) {
    return res.json({ msg: 'Unable to remove note', error: err.message });
  }
};

/**Event Controller*/
exports.addEvent = async (req, res) => {
  try {
    const event = await new EventParticipantHistorySchema({
      student: req.body.student,
      createdBy: req.userId,
      title: req.body.title,
      date: req.body.date,
      studentNote: req.body.studentNote,
      gallery: req.body.gallery,
      url: req.body.url,
      teacherCmt: req.body.teacherCmt,
    }).save();
    console.log(event);
    return res.json({ msg: 'Event add successfully' });
  } catch (err) {
    return res.json({ msg: 'Unable to add event', error: err.message });
  }
};
//TODO: Multiple images upload
exports.editEvent = async (req, res) => {
  try {
    const event = await EventParticipantHistorySchema.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: req.body },
      { new: true }
    );
    console.log(event);
    return res.json({ msg: 'Event update successfully' });
  } catch (err) {
    return res.json({ msg: 'Unable to update event', error: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const event = await EventParticipantHistorySchema.find({
      student: req.userId,
    }).populate('createdBy', 'name');
    return res.json(event);
  } catch (err) {
    return res.json({ msg: 'Unable to get events', error: err.message });
  }
};
exports.getEvent = async (req, res) => {
  try {
    const event = await EventParticipantHistorySchema.findOne({
      _id: req.params.id,
    }).populate('createdBy', 'name');
    return res.json(event);
  } catch (err) {
    return res.json({ msg: 'Unable to get event', error: err.message });
  }
};
exports.removeEvent = async (req, res) => {
  try {
    await EventParticipantHistorySchema.findOneAndDelete({
      _id: req.params.id,
    });
    return res.json({ msg: 'Event remove successfully' });
  } catch (err) {
    return res.json({ msg: 'Unable to remove event', error: err.message });
  }
};

/**Unit Presentation Controller */
exports.addPresentation = async (req, res) => {
  try {
    const pre = await new UnitPresentationSchema({
      student: req.body.student,
      createdBy: req.userId,
      unit: req.body.unit,
      date: req.body.date,
      topic: req.body.topic,
      url: req.body.url,
      teacherCmt: req.body.teacherCmt,
    }).save();
    console.log(pre);
    return res.json({ msg: 'Presentation add successfully' });
  } catch (err) {
    return res.json({ msg: 'Unable to add presentation', error: err.message });
  }
};
exports.editPresentation = async (req, res) => {
  try {
    const pre = await UnitPresentationSchema.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: req.body },
      { new: true }
    );
    console.log(pre);
    return res.json({ msg: 'Presentation update successfully' });
  } catch (err) {
    return res.json({
      msg: 'Unable to update presentation',
      error: err.message,
    });
  }
};
//TODO: we might need to create another route to get all the lists of the presentations for Admin & stuff able to view
exports.getPresentations = async (req, res) => {
  try {
    const pre = await UnitPresentationSchema.find({
      student: req.userId,
    }).populate('createdBy', 'name');
    return res.json(pre);
  } catch (err) {
    return res.json({ msg: 'Unable to get presentations', error: err.message });
  }
};
exports.getPresentation = async (req, res) => {
  try {
    const pre = await UnitPresentationSchema.findOne({
      _id: req.params.id,
    }).populate('createdBy', 'name');
    return res.json(pre);
  } catch (err) {
    return res.json({ msg: 'Unable to get presentation', error: err.message });
  }
};
exports.removePresentation = async (req, res) => {
  try {
    await UnitPresentationSchema.findOneAndDelete({
      _id: req.params.id,
    });
    return res.json({ msg: 'Presentation remove successfully' });
  } catch (err) {
    return res.json({
      msg: 'Unable to remove presentation',
      error: err.message,
    });
  }
};

/**Notice Point Controller */
exports.addNoticePoint = async (req, res) => {
  try {
    const pre = await new StudentNoticePointSchema({
      student: req.body.student,
      enrollmentPurpose: req.body.enrollmentPurchase,
      date: req.body.date,
      personality: req.body.personality,
      englishLevel: req.body.englishLevel,
      homePolicyEdu: req.body.homePolicyEdu,
      pointConsiderParents: req.body.pointConsiderParents,
      entranceExamPlan: req.body.entranceExamPlan,
    }).save();
    console.log(pre);
    return res.json({ msg: 'NoticePoint add successfully' });
  } catch (err) {
    return res.json({ msg: 'Unable to add NoticePoint', error: err.message });
  }
};
exports.editNoticePoint = async (req, res) => {
  try {
    const pre = await StudentNoticePointSchema.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $set: req.body },
      { new: true }
    );
    console.log(pre);
    return res.json({ msg: 'NoticePoint update successfully' });
  } catch (err) {
    return res.json({
      msg: 'Unable to update NoticePoint',
      error: err.message,
    });
  }
};

exports.getNoticePoints = async (req, res) => {
  try {
    const pre = await StudentNoticePointSchema.find({
      student: req.userId,
    }).populate('createdBy', 'name');
    return res.json(pre);
  } catch (err) {
    return res.json({ msg: 'Unable to get NoticePoints', error: err.message });
  }
};
exports.getNoticePoint = async (req, res) => {
  try {
    const pre = await StudentNoticePointSchema.findOne({
      _id: req.params.id,
    }).populate('createdBy', 'name');
    return res.json(pre);
  } catch (err) {
    return res.json({ msg: 'Unable to get noticePoint', error: err.message });
  }
};
exports.removeNoticePoint = async (req, res) => {
  try {
    await StudentNoticePointSchema.findOneAndDelete({
      _id: req.params.id,
    });
    return res.json({ msg: 'NoticePoint remove successfully' });
  } catch (err) {
    return res.json({
      msg: 'Unable to remove noticePoint',
      error: err.message,
    });
  }
};
