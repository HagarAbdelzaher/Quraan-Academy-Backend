const authController = require('./auth');
const courseController = require('./course');
const teacherController = require('./teacher');
const QAController = require('./QA');
const recordedCourses = require('./recordedCourses');
const studentController = require('./student');
const chapterController = require('./chapter');
const sessionController = require("./session");
const studentCoursesController = require('./student');
const zommController = require('./zoom');
const StudentRecordedCoursesController = require('./studentRecordedCourses');
const categoryController = require('./category');
module.exports = {
  authController,
  courseController,
  teacherController,
  recordedCourses,
  QAController,
  chapterController,
  sessionController,
  studentController,
  studentCoursesController,
  zommController,
  StudentRecordedCoursesController,
  categoryController
};
