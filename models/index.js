const Student = require('./Student');
const Teacher = require('./Teacher');
const Admin = require('./Admin');
const Course = require('./Course');
const Session = require('./Session');
const Question = require('./Question');
const Category = require('./Category');
const RecordedCourseCategory = require("./RecordedCourseCategory");
const RecordedCourses = require("./RecordedCourses");
const StudentRecordedCourses = require("./StudentRecordedCourses");

module.exports = {
  Student,
  Teacher,
  Admin,
  Course,
  Session,
  Question,
  Category,
  RecordedCourseCategory,
  RecordedCourses,
  StudentRecordedCourses
};
