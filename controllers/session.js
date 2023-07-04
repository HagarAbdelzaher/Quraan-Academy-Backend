/* eslint-disable no-return-await */
const { Session, Course } = require("../models");
const { BaseError } = require("../libs");
const { createMeeting } = require("./zoom");

//admin
const getSessions = async (month, year) => {
  const currentDate = new Date();
  month = month || currentDate.getMonth() + 1;
  year = year || currentDate.getFullYear();
  const sessions = await Session.find({
    $expr: {
      $and: [
        { $eq: [{ $month: "$date" }, month] },
        { $eq: [{ $year: "$date" }, year] },
      ],
    },
  })
    .sort({ date: 1, startTime: 1 })
    .populate({ path: "courseID", select: "name" })
    .exec();
  if (!sessions) {
    throw new BaseError("No Sessions found", 404);
  }
  return sessions;
};

const getTeacherSessions = async (teacherID, month, year) => {
  const currentDate = new Date();
  month = month || currentDate.getMonth() + 1;
  year = year || currentDate.getFullYear();

  let teacherSessions;

  await Course.find({ teacher: teacherID })
    .then((courses) => {
      const courseIds = courses.map((course) => course._id);
      // Find sessions that have a courseID matching the retrieved course IDs
      return Session.find({
        courseID: { $in: courseIds },
        $expr: {
          $and: [
            { $eq: [{ $month: "$date" }, month] },
            { $eq: [{ $year: "$date" }, year] },
          ],
        },
      })
        .populate({ path: "courseID", select: "name" })
        .sort({ date: 1, startTime: 1 });
    })
    .then((sessions) => {
      teacherSessions = sessions;
    })
    .catch((err) => {
      throw new BaseError(err, 400);
    });
  return teacherSessions;
};

const getSessionById = async (id) =>
  await Session.findById(id).populate("courseID");

const setMeeting = async (sessionId, teacher) => {
  let session = await getSessionById(sessionId);
  const currentDate = Date.now();
  if (session.date < currentDate) {
    throw new BaseError("The session date has expired", 404);
  }
  if (session.courseID.teacher.toString() !== teacher.id.toString()) {
    throw new BaseError("You are not authorized to perform this action", 404);
  }
  const topic = `${session.courseID.name} session 1 `;
  const meeting = await createMeeting(teacher.email, topic);
  if (!meeting) {
    throw new BaseError("failed to create meeting!", 400);
  }
  session = await Session.findByIdAndUpdate(
    sessionId,
    {
      startUrl: meeting.start_url,
      joinUrl: meeting.join_url,
    },
    {
      returnOriginal: false,
    }
  );
  return session;
};

const setProgressComment = async (sessionId, teacherId, progressComment) => {
  const session = await Session.findOne({ _id: sessionId })
  if(!session) throw new BaseError('Session not found', 404);
  const course = await Course.findOne({ _id: session.courseID, teacher: teacherId })
  if (!course) throw new BaseError('You are not authorized to perform this action', 401);
  session.progressComment = progressComment;
  session.save();
  return session;
}

module.exports = {
  getSessions,
  getTeacherSessions,
  getSessionById,
  setMeeting,
  setProgressComment,
};
