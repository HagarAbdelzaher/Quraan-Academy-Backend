const { Session, Course } = require("../models");
const { BaseError } = require("../libs");

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
    .then(courses => {
      const courseIds = courses.map(course => course._id);
      // Find sessions that have a courseID matching the retrieved course IDs
      return Session.find({
        courseID: { $in: courseIds }, $expr: {
          $and: [
            { $eq: [{ $month: "$date" }, month] },
            { $eq: [{ $year: "$date" }, year] },
          ],
        },
      })
        .populate({ path: 'courseID', select: 'name' })
        .sort({ date: 1, startTime: 1 });
    })
    .then(sessions => {
      teacherSessions = sessions;
    })
    .catch(err => {
      throw new BaseError(err, 400);
    });
  return teacherSessions;
};

module.exports = {
  getSessions,
  getTeacherSessions
};
