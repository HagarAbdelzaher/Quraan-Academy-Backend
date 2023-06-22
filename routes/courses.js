/* eslint-disable consistent-return */
const express = require("express");
const { courseController } = require("../controllers");
const { asycnWrapper } = require("../libs");
const { validation, CourseValidator } = require("../middlewares/validation");
const { BaseError } = require("../libs");
const { auth } = require("../middlewares");
const router = express.Router();

// -> get courses // pagination //filter (teacher , level)
//  By Admin
// -> add course /course/
// -> delete course /course/
// -> update course  ( description , teacher , level , add extra sessions to this course)

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
    res.status(200).json({ course: data });
  }
);

module.exports = router;
