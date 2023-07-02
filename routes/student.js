/* eslint-disable consistent-return */
const express = require('express');
const {
  studentController,
  studentCoursesController,
  StudentRecordedCoursesController,
} = require('../controllers');
const { asycnWrapper } = require('../libs');
const { validation, StudentValidator } = require('../middlewares/validation');
const { authStudent } = require('../middlewares');

const router = express.Router();

router.get('/recordedCourses', authStudent, async (req, res, next) => {
  const studentId = req.student.id;
  const recordedCourses = StudentRecordedCoursesController.getStudentRecordedCourses(studentId);
  const [error, data] = await asycnWrapper(recordedCourses);
  if (error) {
    return next(error);
  }
  res.status(200).json(data);
});

router.get('/recordedCourse/:id',
  authStudent,
  validation(StudentValidator.studentGetRecordedCourseDetails),
  async (req, res, next) => {
    const studentId = req.student.id;
    const recordedCourseId = req.params.id;
    const course = StudentRecordedCoursesController.getStudentRecordedCourseDetails(studentId, recordedCourseId);
    const [error, data] = await asycnWrapper(course);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  });

router.get(
  '/recordedCourse/:id/chapters',
  authStudent,
  validation(StudentValidator.studentGetRecordedCourseChapters),
  async (req, res, next) => {
    const studentId = req.student.id;
    const recordedCourseId = req.params.id;
    const chapters = StudentRecordedCoursesController.studentGetRecordedCourseChapters(
      studentId,
      recordedCourseId,
    );
    const [error, data] = await asycnWrapper(chapters);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

router.patch(
  '/recordedCourse/:id/chapter/:chapterId',
  authStudent,
  validation(StudentValidator.studentFinishChapter),
  async (req, res, next) => {
    const studentId = req.student.id;
    const recordedCourseId = req.params.id;
    const { chapterId } = req.params;
    const course = StudentRecordedCoursesController.studentFinishChapter(
      studentId,
      recordedCourseId,
      chapterId,
    );
    const [error, data] = await asycnWrapper(course);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

router.get('/courses', authStudent, async (req, res, next) => {
  const studentId = req.student.id;
  const { page = 1 } = req.query;
  if (page < 1 || page > 1000) {
    page = 1;
  }
  const limit = 6;
  const courses = studentCoursesController.getAllStudentCourses(
    page,
    limit,
    studentId
  );
  const [error, data] = await asycnWrapper(courses);
  if (error) next(error);
  res.status(200).json(data);
});

router.get(
  '/checkout-course/:id',
  authStudent,
  validation(StudentValidator.enrollCourse),
  async (req, res, next) => {
    const courseId = req.params.id;
    const studentId = req.student.id;
    const { recorded } = req.query;

    const url = studentController.checkoutCourse(courseId, studentId, recorded);
    const [error, data] = await asycnWrapper(url);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

router.get('/enroll-course', async (req, res, next) => {
  const {
    token, studentId, courseId, recorded,
  } = req.query;

    const course = studentController.enrollCourse(token, studentId, courseId, recorded);
    const [error, data] = await asycnWrapper(course);
    if (error) {
      return next(error);
    }
    if(recorded === 'true') {
      res.status(200).redirect(`${process.env.CLIENT_URL}/student/recordedCourses`);
    }
    else {
      res.status(200).redirect(`${process.env.CLIENT_URL}/student/courses`);
    }
  },
);

router.get('/paymentCancel', async (req, res, next) => {
  const { token, studentId } = req.query;

  const course = studentController.paymentCancel(token, studentId);
  const [error, data] = await asycnWrapper(course);
  if (error) {
    return next(error);
  }
  res.status(200).redirect(`${process.env.CLIENT_URL}/student`);
});

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
  '/updateprofile',
  authStudent,
  async (req, res, next) => {
    const studentId = req.student.id;
    const newData = req.body;
    const student = studentController.updateStudent(studentId, newData);
    const [error, data] = await asycnWrapper(student);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

router.get('/profile',
  authStudent,
  async (req, res, next) => {
    const studentId = req.student.id;
    const [err, data] = await asycnWrapper(studentController.getStudentById(studentId));
    if (err) return next(err);
    res.status(200).json(data);
  },
);

router.delete(
  '/course/:id',
  authStudent,
  validation(StudentValidator.idParam),
  async (req, res, next) => {
    const courseId = req.params.id;
    const studentId = req.student.id;
    const delCourse = studentCoursesController.deleteCourse(
      studentId,
      courseId,
    );
    const [error, data] = await asycnWrapper(delCourse);
    if (error) return next(error);
    res.status(200).json(data);
  },
);

router.get(
  '/course/:id',
  authStudent,
  async (req, res, next) => {
    const courseId = req.params.id;
    const studentId = req.student.id;
    const course = studentCoursesController.getOneStudentCourse(
      studentId,
      courseId,
    );
    const [error, data] = await asycnWrapper(course);
    if (error) return next(error);
    res.status(200).json(data);
  },
);

// get session by id
router.get(
  '/session/:id',
  authStudent,
  async (req, res, next) => {
    const sessionId = req.params.id;
    const studentId = req.student.id;
    const session = studentCoursesController.getSessionById(
      sessionId,
      studentId,
    );
    const [error, data] = await asycnWrapper(session);
    if (error) return next(error);
    res.status(200).json(data);
  },
);

module.exports = router;
