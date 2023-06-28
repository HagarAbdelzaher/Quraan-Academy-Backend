const authController = require('./auth');
const courseController = require('./course');
const teacherController = require('./teacher');
const QAController = require('./QA');
const recordedCourses = require('./recordedCourses');
const recordedCourseCategory = require('./recordedCourseCategory');
const studentController  = require('./student');
const studentCoursesController  = require('./studentCourses');
const chapterController = require('./chapter');
const sessionController = require("./session");

module.exports = {
  authController,
  courseController,
  teacherController,
  recordedCourses,
  recordedCourseCategory,
  QAController,
  studentController,
  chapterController,
  sessionController,
  studentController,
  studentCoursesController 
};
