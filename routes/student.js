/* eslint-disable consistent-return */
const express = require('express');
const { studentController, studentCoursesController } = require('../controllers');
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

router.get(
  '/',
  validation(StudentValidator.getStudents),
  async (req, res, next) => {
    const { gender, DOB, page = 1 } = req.query;
    if (page < 1 || page > 1000) {
      page = 1;
    }
    const limit = 6;
    const students = studentController.getStudents(page, limit, gender, DOB);
    const [error, data] = await asycnWrapper(students);

    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

router.patch(
  '/:id',
  validation(StudentValidator.updateStudent),
  async (req, res, next) => {
    const studentId = req.params.id;
    const newData = req.body;
    const student = studentController.updateStudent(studentId, newData);
    const [error, data] = await asycnWrapper(student);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

router.get('/:id',
  validation(StudentValidator.idParam),
  async (req, res, next) => {
    const { id } = req.params;
    const [err, data] = await asycnWrapper(studentController.getStudentById(id));
    if (err) return next(err);
    res.status(200).json(data);
  });

router.delete('/course/:id',
  authStudent,
  validation(StudentValidator.idParam),
  async (req, res, next) => {
    const courseId = req.params.id;
    const studentId = req.student.id;
    const delCourse = studentCoursesController.deleteCourse(studentId, courseId);
    const [error, data] = await asycnWrapper(delCourse);
    if (error) next(error);
    res.status(200).json(data);
  });

router.get('/course/:id',
  authStudent,
  validation(StudentValidator.idParam),
  async (req, res, next) => {
    const courseId = req.params.id;
    const studentId = req.student.id;
    const course = studentCoursesController.getOneStudentCourse(studentId, courseId);
    const [error, data] = await asycnWrapper(course);
    if (error) next(error);
    res.status(200).json(data);
  });

router.get('/courses/',
  authStudent,
  async (req, res, next) => {
    const studentId = req.student.id;
    const courses = studentCoursesController.getAllStudentCourses(studentId);
    const [error, data] = await asycnWrapper(courses);
    if (error) next(error);
    res.status(200).json(data);
  });


module.exports = router;
