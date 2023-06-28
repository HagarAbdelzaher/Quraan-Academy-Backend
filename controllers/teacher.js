const { Teacher, Course } = require("../models");
const { BaseError } = require("../libs");
const { findById } = require("../models/Session");

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

module.exports = {
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
