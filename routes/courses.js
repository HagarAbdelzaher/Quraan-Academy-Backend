/* eslint-disable consistent-return */
const express = require("express");
const { courseController } = require("../controllers");
const { asycnWrapper } = require("../libs");
const { validation, CourseValidator } = require("../middlewares/validation");
const router = express.Router();

// -> get courses // pagination //filter (teacher , level) //DONE
//  By Admin
// -> add course /course/ DONE
// -> delete course /course/ // with all of its sessions
// -> update course  ( description , teacher , level )
// -> add extra session to course

router.get(
  "/",
  validation(CourseValidator.getCourses),
  async (req, res, next) => {
    const { teacher, level, page = 1 } = req.query;
    if (page < 1 || page > 1000) {
      page = 1;
    }
    const limit = 6;
    const courses = courseController.getCourses(page, limit, teacher, level);
    const [error, data] = await asycnWrapper(courses);

    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  }
);
router.post(
  "/",
  validation(CourseValidator.addCourse),
  async (req, res, next) => {
    const {
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
module.exports = router;
