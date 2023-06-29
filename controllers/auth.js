const jwt = require('jsonwebtoken');
const { Student, Teacher, Admin } = require('../models');
const { BaseError } = require('../libs');
const { createUser } = require('./zoom')
const { JWT_SECRET } = process.env;

const signUpStudent = async (data) => {
  const student = await Student.create(data);
  if (!student) {
    throw new BaseError('SignUp failed', 500);
  }
};

const signUpTeacher = async (data) => {
  const teacher = await Teacher.create(data);
  if (!teacher) {
    throw new BaseError('SignUp failed', 500);
  }
  const zoomUser = await createUser(teacher);
  if (!zoomUser) {
    throw new BaseError('teacher not add to zoom', 500);
  }
};

const loginStudent = async (email, password) => {
  const student = await Student.findOne({ email }).exec();
  if (!student) {
    throw new BaseError('Authentication failed', 401);
  }
  const valid = student.verfiyPassword(password);
  if (!valid) {
    throw new BaseError('Authentication failed', 401);
  }
  const token = jwt.sign({ id: student.id, email: student.email, role: 'student' }, JWT_SECRET, {
    expiresIn: '7d',
  });
  return {
    token,
  };
};

const loginTeacher = async (email, password) => {
  const teacher = await Teacher.findOne({ email }).exec();
  if (!teacher) {
    throw new BaseError('Authentication failed', 401);
  }
  const valid = teacher.verfiyPassword(password);
  if (!valid) {
    throw new BaseError('Authentication failed', 401);
  }
  const token = jwt.sign({ id: teacher.id, email: teacher.email, role: 'teacher' }, JWT_SECRET, {
    expiresIn: '7d',
  });
  return {
    token,
  };
};

const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email }).exec();
  if (!admin) {
    throw new BaseError('Authentication failed', 401);
  }
  const valid = admin.verfiyPassword(password);
  if (!valid) {
    throw new BaseError('Authentication failed', 401);
  }
  const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, {
    expiresIn: '7d',
  });
  return {
    token,
  };
};

module.exports = {
  signUpStudent,
  signUpTeacher,
  loginStudent,
  loginTeacher,
  loginAdmin,
};
