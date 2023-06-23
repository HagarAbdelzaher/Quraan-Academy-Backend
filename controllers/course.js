const { Course, Session } = require("../models");
const { BaseError } = require("../libs");

const addCourse = async (data) => {
  const course = await Course.create(data);
  if (!course) {
    throw new BaseError("Adding Course Failed", 500);
  }
  return course;
};

const addCourseSessions = async (course) => {
  const { daysOfWeek, _id, startDate, endDate, startTime, endTime } = course;
  const sessions = [];
  //for Example :  get all dates of sundays and tuesdays during the course duration
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (
      daysOfWeek.includes(
        currentDate.toLocaleDateString("en-US", { weekday: "long" })
      )
    ) {
      let session = {
        courseID: _id,
        startTime,
        endTime,
        date: new Date(currentDate),
      };
      sessions.push(session);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const allSessions = await Session.insertMany(sessions);
  if (!allSessions) {
    throw new BaseError("Adding course sessions failed", 500);
  }
  return allSessions;
};
module.exports = {
  addCourse,
  addCourseSessions,
};
