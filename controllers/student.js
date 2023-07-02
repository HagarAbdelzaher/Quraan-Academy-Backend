const crypto = require('crypto');
const {
  Course, PaymentToken, StudentCourses, Student, RecordedCourses, StudentRecordedCourses
} = require('../models');
const { BaseError } = require('../libs');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const checkoutCourse = async (courseId, studentId, recorded) => {
  let course;
  let pervCourse;
  if (recorded === 'true') {
    course = await RecordedCourses.findById(courseId);
    pervCourse = await StudentRecordedCourses.findOne({ courseID: courseId, studentId })
  } else {
    course = await Course.findById(courseId);
    pervCourse = await StudentCourses.findOne({ courseId, studentId })
  }
  if (!course) {
    throw new BaseError('Course not Found', 404);
  }
  if (pervCourse) {
    throw new BaseError(`you already enroll in this course`, 400);
  }

  const token = crypto.randomBytes(16).toString('hex');
  await PaymentToken.create({
    token,
    studentId,
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: course.name,
          },
          unit_amount: course.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.SERVER_URL}/student/enroll-course?token=${token}&studentId=${studentId}&courseId=${courseId}&recorded=${recorded}`,
    cancel_url: `${process.env.SERVER_URL}/student/paymentCancel?token=${token}&studentId=${studentId}`,
  });

  return session.url;
};

const enrollCourse = async (token, studentId, courseId, recorded) => {
  const pToken = await PaymentToken.findOneAndDelete({
    token,
    studentId,
    status: 'valid',
  });
  if (!pToken) {
    throw new BaseError('You are not authorized to perform this action', 404);
  }
  let studentCourse;
  if (recorded === 'true') {
    studentCourse = await StudentRecordedCourses.create({ courseID: courseId, studentId });
    if (!studentCourse) {
      throw new BaseError('Adding Course Failed', 500);
    }
    studentCourse = await StudentRecordedCourses.populate(studentCourse, [
      { path: 'courseID' },
      { path: 'studentId' },
    ]);
  } else {
    studentCourse = await StudentCourses.create({ courseId, studentId });
    if (!studentCourse) {
      throw new BaseError('Adding Course Failed', 500);
    }
    studentCourse = await StudentCourses.populate(studentCourse, [
      { path: 'courseId' },
      { path: 'studentId' },
    ]);
  }
  return studentCourse;
};

const paymentCancel = async (token, studentId) => {
  await PaymentToken.findOneAndDelete({
    token,
    studentId,
    status: 'valid',
  });
};

const getStudents = async (page, limit, gender, DOB) => {
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
  const updatedStudent = await Student.findByIdAndUpdate(studentId, newData, {
    returnOriginal: false,
  });
  return updatedStudent;
};

const getStudentById = async (id) => {
  const student = await Student.findById(id);
  if (!student) {
    throw new BaseError('Student not Found', 404);
  }
  return student;
};

module.exports = {
  getStudents,
  updateStudent,
  getStudentById,
  checkoutCourse,
  enrollCourse,
  paymentCancel,
};
