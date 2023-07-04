/* eslint-disable consistent-return */
const express = require("express");
const { courseController , studentCoursesController} = require("../controllers");
const { asycnWrapper } = require("../libs");
const { validation, CourseValidator } = require("../middlewares/validation");
const { authAdmin, authTeacher } = require("../middlewares/auth");
const router = express.Router();

router.get(
  "/",
  validation(CourseValidator.getCourses),
  async (req, res, next) => {
    const { teacher, level, filter, page = 1 } = req.query;
    if (page < 1 || page > 1000) {
      page = 1;
    }
    const limit = 6;
    const courses = courseController.getCourses(
      page,
      limit,
      teacher,
      level,
      filter
    );
    const [error, data] = await asycnWrapper(courses);

    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  }
);
router.post(
  "/",
  authAdmin,
  validation(CourseValidator.addCourse),
  async (req, res, next) => {
    let {
      body: {
        name,
        level,
        description,
        numberOfSessions,
        startDate,
        endDate,
        startTime,
        endTime,
        daysOfWeek,
        teacher,
        price,
      },
    } = req;
    const course = courseController.addCourse({
      name,
      level,
      description,
      numberOfSessions,
      startDate,
      endDate,
      startTime,
      endTime,
      daysOfWeek,
      teacher,
      price,
    });
    const [error, data] = await asycnWrapper(course);

    if (error) {
      return next(error);
    }
    const sessions = courseController.addCourseSessions(data);
    const [errorOfSessions, dataOfSessions] = await asycnWrapper(sessions);
    if (errorOfSessions) {
      return next(errorOfSessions);
    }
    res.status(200).json({ course: data, sessions: dataOfSessions });
  }
);
router.patch(
  "/:id",
  authAdmin,
  validation(CourseValidator.updateCourse),
  async (req, res, next) => {
    const courseId = req.params.id;
    const course = courseController.updateCourse(courseId, req.body);
    const [error, data] = await asycnWrapper(course);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  }
);
router.delete(
  "/:id",
  authAdmin,
  validation(CourseValidator.deleteCourse),
  async (req, res, next) => {
    const course = courseController.deleteCourse(req.params.id);
    const [error, data] = await asycnWrapper(course);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  }
);
router.get(
  "/:id",
  validation(CourseValidator.idParam),
  async (req, res, next) => {
    const { id } = req.params;
    const [err, data] = await asycnWrapper(courseController.getCourseById(id));
    if (err) return next(err);
    res.status(200).json(data);
  }
);

router.get(
  "/:id/students",
  authTeacher,
  validation(CourseValidator.idParam),
  async (req, res, next) => {
    const { id } = req.params;
    const teacherId = req.teacher.id;
    const [err, data] = await asycnWrapper(studentCoursesController.studentsCourse(id, teacherId));
    if (err) return next(err);
    res.status(200).json(data);
  }
);

router.patch(
  "/:id/studentComment",
  authTeacher,
  validation(CourseValidator.idParam),
  async (req, res, next) => {
    const { id } = req.params;
    const {studentId, comment } = req.body;
    const teacherId = req.teacher.id;
    const [err, data] = await asycnWrapper(studentCoursesController.updateTeacherComment(id, teacherId,studentId,comment));
    if (err) return next(err);
    res.status(200).json(data);
  }
);
module.exports = router;
