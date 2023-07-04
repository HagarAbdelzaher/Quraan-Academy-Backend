const { Teacher, Course, Session } = require("../models");
const { BaseError } = require("../libs");

const getTeachers = async (page, limit, gender) => {
  const conditions = {};
  if (gender) {
    conditions.gender = gender;
  }
  const skip = (page - 1) * limit;
  const teachers = await Teacher.find(conditions)
    .skip(skip)
    .limit(limit)
    .exec();
  if (!teachers) {
    throw new BaseError("No teachers found", 404);
  }
  return teachers;
};

const getTeachersNotPaginated = async () => {
  const teachers = await Teacher.find().exec();
  if (!teachers) {
    throw new BaseError("No teachers found", 404);
  }
  return teachers;
};

const getTeacherById = async (teacherId) => {
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new BaseError("No teacher found", 404);
  }
  return teacher;
};
const updateTeacher = async (teacherId, newData) => {
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new BaseError("Teacher not Found", 404);
  }
  const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, newData, {
    returnOriginal: false,
  });
  return updatedTeacher;
};

const deleteTeacher = async (teacherId) => {
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new BaseError("Teacher not Found", 404);
  }
  const courses = await Course.find({ teacher: teacherId });
  if (courses.length > 0) {
    throw new BaseError("Teacher was assigned to courses", 404);
  }
  const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
  return deletedTeacher;
};

const getTeacherCourse = async (courseId, teacherId) => {
  const course = await Course.findOne({
    _id: courseId,
    teacher: teacherId
  }).lean();
  if (!course) throw new BaseError('Teacher not associated with this course', 404);

  const sessions = await Session.find({ courseID: courseId });
  if (!sessions) { throw new BaseError('Session not Found', 404); }

  course.sessions = sessions;

  return course;
}

const getSessionById = async (id, teacherID) => {
  const session = await Session.findById(id).populate('courseID');
  const courseId = session.courseID._id;
  const teachesCourse = await Course.findOne({ teacher: teacherID, _id: courseId });
  if (!teachesCourse) { throw new BaseError('You are not authorized to get this session', 400); }
  return session;
};

module.exports = {
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeachersNotPaginated,
  getTeacherCourse,
  getSessionById
};
