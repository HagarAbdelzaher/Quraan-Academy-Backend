const authController = require('./auth');
const courseController = require('./course');
const teacherController = require('./teacher');
const QAController = require('./QA');
const recordedCourses = require('./recordedCourses');
const recordedCourseCategory = require('./recordedCourseCategory');
const studentController  = require('./student');
const chapterController = require('./chapter');
const sessionController = require("./session");
const studentCoursesController  = require('./student');
const zommController = require('./zoom');

module.exports = {
  authController,
  courseController,
  teacherController,
  recordedCourses,
  recordedCourseCategory,
  QAController,
  chapterController,
  sessionController,
  studentController,
  studentCoursesController,
  zommController,
};
