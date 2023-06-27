const express = require('express');
const { studentController } = require('../controllers');
const { asycnWrapper } = require('../libs');
const { validation, StudentValidator } = require('../middlewares/validation');
const { authStudent } = require('../middlewares');


const router = express.Router();

router.get(
  '/checkout-course/:id',
  authStudent,
  validation(StudentValidator.enrollCourse),
  async (req, res, next) => {
    const courseId = req.params.id;
    const studentId = req.student.id; 
    const url = studentController.checkoutCourse(courseId, studentId);
    const [error, data] = await asycnWrapper(url);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);


router.get(
  '/enroll-course',
  async (req, res, next) => {
    const { token, studentId, courseId } = req.query;

    const course = studentController.enrollCourse(token, studentId, courseId);
    const [error, data] = await asycnWrapper(course);
    if (error) {
      return next(error);
    }
    res.status(200).redirect(`${process.env.CLIENT_URL}/student/courses`);
  },
);

router.get(
  '/paymentCancel',
  async (req, res, next) => {
    const { token, studentId } = req.query;

    const course = studentController.paymentCancel(token, studentId);
    const [error, data] = await asycnWrapper(course);
    if (error) {
      return next(error);
    }
    res.status(200).redirect(`${process.env.CLIENT_URL}/student`);
  },
);

module.exports = router;
