const { Student} = require('../models');
const { BaseError } = require('../libs');

const getStudents = async (page, limit, gender,DOB) => {
  const conditions = {};
  if (gender) {
    conditions.gender = gender;
  }
  if (DOB) {
    conditions.DOB = DOB;
  }
  const skip = (page - 1) * limit;
  const students = await Student.find(conditions)
    .skip(skip)
    .limit(limit)
    .exec();
  if (!students) {
    throw new BaseError('No students found', 404);
  }
  return students;
};

const updateStudent = async (studentId, newData) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new BaseError('Student not Found', 404);
  }
  const updatedStudent= await Student.findByIdAndUpdate(studentId, newData, {
    returnOriginal: false,
  });
  return updatedStudent;
};

const getStudentById = async (id) => {
    const student = await Student.findById(id);
    if (!student) {
        throw new BaseError('Student not Found', 404);
      }
    return  student;
  }

module.exports = {
  getStudents,
  updateStudent,
  getStudentById,
};
