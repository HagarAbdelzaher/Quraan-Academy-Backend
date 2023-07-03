const { Course, Session, StudentCourses } = require("../models");
const { BaseError } = require("../libs");

const addCourse = async (data) => {

  let date= new Date(data.startDate)
  data.startDate =new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  let date2 = new Date(data.endDate)
  data.endDate =new Date(date2.getTime() - date2.getTimezoneOffset() * 60000)

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

const getCourses = async (page, limit, teacher, level, filter) => {
  const conditions = {};
  if (teacher) {
    conditions.teacher = teacher;
  }
  if (level) {
    conditions.level = level;
  }
  const currentDate = new Date();
  if (filter && filter === "upcoming") {
    conditions.endDate = {
      $gte: currentDate,
    };
  }
  const courses = await Course.paginate(conditions, {
    page: page || 1,
    limit,
    sort: { endDate: -1 },
    populate: [{ path: "teacher", select: "firstName lastName" }],
  });

  if (!courses) {
    throw new BaseError("No Courses found", 404);
  }
  const coursePromises = courses.docs.map(async (course) => {
    const countOfStudents = await StudentCourses.countDocuments({
      courseId: course._id,
    });
    return { ...course.toObject(), countOfStudents };
  });
  const coursesWithCount = await Promise.all(coursePromises);
  courses.docs = coursesWithCount;
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
  if (startDate || endDate || startTime || endTime || daysOfWeek) {
    const deletedSessions = await Session.deleteMany({ courseID: courseId });
    if (!deletedSessions) {
      throw new BaseError("Course sessions Cannot be deleted", 500);
    }
    const newSessions = addCourseSessions(updatedCourse);
    if (!newSessions) {
      throw new BaseError("Course sessions Cannot be added", 500);
    }
  }
  return updatedCourse;
};
const deleteCourse = async (courseId) => {
  // check course is available
  const course = await Course.findById(courseId);
  if (!course) {
    throw new BaseError("Course not Found", 404);
  }
  // check course didn't start
  const courseCurrentStartDate = course.startDate;
  const courseCurrentEndDate = course.endDate;
  const currentDate = Date.now();
  if (
    currentDate > courseCurrentStartDate &&
    currentDate < courseCurrentEndDate
  ) {
    throw new BaseError("Course in progress , cannot delete it ", 400);
  }
  // check that no students are enrolled in course
  const enrolledStudents = await StudentCourses.find({
    courseId: course._id,
  });
  // check that course did end
  if (enrolledStudents && currentDate < courseCurrentEndDate) {
    throw new BaseError("Cannot delete a course with enrolled students", 400);
  }

  // delete the course and its sessions
  const deletedCourse = await Course.findByIdAndDelete(courseId);
  if (!deletedCourse) {
    throw new BaseError("Course cannot be deleted", 500);
  }
  const deletedSessions = await Session.deleteMany({ courseID: courseId });
  if (!deletedSessions) {
    throw new BaseError("Course sessions Cannot be deleted", 500);
  }
  return deletedCourse;
};

const getCourseById = async (id) => {
  let course = await Course.findById(id).lean();
  if (!course) {
    throw new BaseError("Course not Found", 404);
  }
  const sessions = await Session.find({ courseID: id });
  if (sessions) {
    course.sessions = sessions;
  }
  return course;
};
module.exports = {
  addCourse,
  addCourseSessions,
  getCourses,
  updateCourse,
  deleteCourse,
  getCourseById,
};
