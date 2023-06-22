const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { asycnWrapper } = require('../libs');
const { Student, Teacher, Admin } = require('../models');

const asyncJwtVerify = promisify(jwt.verify);
const { JWT_SECRET } = process.env;

const authStudent = async (req, res, next) => {
  const { headers: { authorization } } = req;
  const payload = asyncJwtVerify(authorization, JWT_SECRET);
  const [error, data] = await asycnWrapper(payload);
  if (error) {
    return next(error);
  }
  const student = await Student.findById(data.id);
  if (!student) {
    return next(new Error('Student not found'));
  }
  req.student = student;
  return next();
};

const authTeacher = async (req, res, next) => {
  const { headers: { authorization } } = req;
  const payload = asyncJwtVerify(authorization, JWT_SECRET);
  const [error, data] = await asycnWrapper(payload);
  if (error) {
    return next(error);
  }
  const teacher = await Teacher.findById(data.id);
  if (!teacher) {
    return next(new Error('Teacher not found'));
  }
  req.teacher = teacher;
  return next();
};

const authAdmin = async (req, res, next) => {
  const { headers: { authorization } } = req;
  const payload = asyncJwtVerify(authorization, JWT_SECRET);
  const [error, data] = await asycnWrapper(payload);
  if (error) {
    return next(error);
  }
  const admin = await Admin.findById(data.id);
  if (!admin) {
    return next(new Error('Admin not found'));
  }
  req.admin = admin;
  return next();
};

module.exports = {
  authStudent,
  authTeacher,
  authAdmin,
};
