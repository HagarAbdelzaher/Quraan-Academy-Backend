const { Course, PaymentToken, StudentCourses, Student } = require('../models');
const { BaseError } = require('../libs');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const checkoutCourse = async (courseId, studentId) => {
    
    const course = await Course.findById(courseId);
    if (!course) {
      throw new BaseError("Course not Found", 404);
    }

    const token = crypto.randomBytes(16).toString('hex');
    const Payment = await PaymentToken.create({
      token,
      studentId,
    });
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data :{
                'currency' : 'usd',  
                'product_data': {
                    'name': course.name,
                },
                'unit_amount': course.price
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url:`${process.env.SERVER_URL}/student/enroll-course?token=${token}&studentId=${studentId}&courseId=${courseId}`,
        cancel_url: `${process.env.SERVER_URL}/student/paymentCancel?token=${token}&studentId=${studentId}`,
      });
    
    return session.url;
  };

  const enrollCourse = async (token, studentId, courseId) => {
    const pToken = await PaymentToken.findOneAndDelete({
      token,
      studentId,
      status:'valid'
    });
    if (!pToken) {
      throw new BaseError("You are not authorized to perform this action", 404);
    }

    let studentCourse = await StudentCourses.create({courseId,studentId});
    if (!studentCourse) {
      throw new BaseError("Adding Course Failed", 500);
    }
    studentCourse = await StudentCourses.populate(studentCourse, [
      { path: 'courseId' },
      { path: 'studentId' }
    ]);
    return studentCourse;
  };

  const paymentCancel = async (token, studentId) => {
    await PaymentToken.findOneAndDelete({
      token,
      studentId,
      status:'valid'
    });
  };


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
  checkoutCourse,
  enrollCourse,
  paymentCancel,
};