const authController = require("./auth");
const courseController = require("./course");
const teacherController = require("./teacher");
const recordedCourses = require("./recordedCourses");
const recordedCourseCategory = require("./recordedCourseCategory");
module.exports = {
  authController,
  courseController,
  teacherController,
  recordedCourses,
  recordedCourseCategory
};
