const { StudentCourses } = require("../models");

const deleteCourse = async (studentId, courseId) => {
  const deletedCourse = await StudentCourses.findOneAndDelete({
    studentId: studentId,
    courseId: courseId,
  });
  if (!deletedCourse) {
    throw new BaseError("Course not Found", 404);
  }
  return deletedCourse;
};

const getAllStudentCourses = async (page, limit, studentId) => {
  const courses = await StudentCourses.paginate(
    { studentId: studentId },
    {
      page: page || 1,
      limit,
      populate: [
        { path: "studentId", select: "firstName lastName" },
        {
          path: "courseId",
          select: "name level description startDate endDate daysOfWeek",
        },
      ],
    }
  );
  return courses;
};
const getNumberOfStudents = async (courseId) => {
  const count = await StudentCourses.countDocuments({ courseId: courseId });
  return count;
};
const getOneStudentCourse = async (studentId, courseId) => {
  console.log("studentId:", studentId);
  const course = await StudentCourses.findOne({
    studentId: studentId,
    courseId: courseId,
  }).populate([
    { path: "studentId", select: "firstName lastName" },
    { path: "courseId", select: "name level" },
  ]);
  if (!course) {
    throw new BaseError("Course not Found", 404);
  }
  return course;
};
module.exports = {
  getOneStudentCourse,
  deleteCourse,
  getAllStudentCourses,
  getNumberOfStudents,
};
