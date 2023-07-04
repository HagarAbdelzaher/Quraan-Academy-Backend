const { BaseError } = require('../libs');
const { StudentCourses, Session, Course } = require('../models');

const deleteCourse = async (studentId, courseId) => {
  const deletedCourse = await StudentCourses.findOneAndDelete({
    studentId,
    courseId,
  });
  if (!deletedCourse) {
    throw new BaseError('Course not Found', 404);
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
  const count = await StudentCourses.countDocuments({ courseId });
  return count;
};
const getOneStudentCourse = async (studentId, courseId) => {
  const course = await StudentCourses.findOne({
    studentId,
    courseId,
  }).populate([
    { path: 'studentId', select: 'firstName lastName' },
    { path: 'courseId', select: 'name level numberOfSessions description daysOfWeek' },
  ]).lean();
  if (!course) {
    throw new BaseError('Course not Found', 404);
  }
  const sessions = await Session.find({ courseID: courseId });
  if (!sessions) { throw new BaseError('Session not Found', 404); }

  course.sessions = sessions;

  return course;
};
const getSessionById = async (id, studentId) => {
  const session = await Session.findById(id).populate({
    path: 'courseID',
    populate: {
      path: 'teacher',
      select: 'firstName lastName',
      model: 'Teacher'
    }
  });
  const courseId = session.courseID._id;
  const studentEnrolled = await StudentCourses.findOne({ studentId, courseId });
  if (!studentEnrolled) { throw new BaseError('You are not authorized to get this session', 400); }
  return session;
};


const studentsCourse = async (courseId, teacherId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new BaseError("Course not Found", 404);
  }
  if (course.teacher.toString() !== teacherId.toString()) {
    throw new BaseError("You are not authorized to perform this action", 404);
  }
  const students = await StudentCourses.find({ courseId }).populate('studentId courseId');

  return students ;
}

const updateTeacherComment = async (courseId, teacherId ,studentId ,comment) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new BaseError("Course not Found", 404);
  }
  if (course.teacher.toString() !== teacherId.toString()) {
    throw new BaseError("You are not authorized to perform this action", 404);
  }
  const Updatedcourse = await StudentCourses.findOneAndUpdate({courseId, studentId} ,
  {
    teacherComment:comment,
  },
  {
    returnOriginal: false,
  }).populate('studentId courseId');

  return Updatedcourse ;
}
module.exports = {
  getOneStudentCourse,
  deleteCourse,
  getAllStudentCourses,
  getNumberOfStudents,
  getSessionById,
  studentsCourse,
  updateTeacherComment,
};
