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

const getCourses = async (page, limit, teacher, level) => {
  const conditions = {};
  if (teacher) {
    conditions.teacher = teacher;
  }
  if (level) {
    conditions.level = level;
  }
  const skip = (page - 1) * limit;
  const courses = await Course.find(conditions).skip(skip).limit(limit).exec();
  if (!courses) {
    throw new BaseError("No Courses found", 404);
  }
  return courses;
};

const updateCourse = async (courseId, newData) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new BaseError("Course not Found", 404);
  }
  const courseCurrentStartDate = course.startDate;
  const {
    name,
    description,
    level,
    teacher,
    numberOfSessions,
    startDate,
    endDate,
    startTime,
    endTime,
    daysOfWeek,
    price,
  } = newData;
  const currentDate = Date.now();
  const timeAndPriceUpdate =
    startDate ||
    endDate ||
    startTime ||
    endTime ||
    price ||
    daysOfWeek ||
    numberOfSessions;
  if (currentDate > courseCurrentStartDate && timeAndPriceUpdate) {
    throw new BaseError(
      "Cannot update time or price for a course that already started",
      400
    );
  }
  const updatedCourse = await Course.findByIdAndUpdate(courseId, newData, {
    returnOriginal: false,
  });
  if (!updatedCourse) {
    throw new BaseError("Cannot update course", 500);
  }
  return updatedCourse;
};
module.exports = {
  addCourse,
  addCourseSessions,
  getCourses,
  updateCourse,
};
