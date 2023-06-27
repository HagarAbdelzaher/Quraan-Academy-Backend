const authController = require('./auth');
const courseController = require('./course');
const teacherController = require('./teacher');
const QAController = require('./QA');
const recordedCourses = require('./recordedCourses');
const recordedCourseCategory = require('./recordedCourseCategory');
const studentController  = require('./student');
module.exports = {
  authController,
  courseController,
  teacherController,
  recordedCourses,
  recordedCourseCategory,
  QAController,
  studentController,
};
