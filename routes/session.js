/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const express = require("express");
const { sessionController } = require("../controllers");
const { asycnWrapper } = require("../libs");
const { validation, SessionValidator } = require("../middlewares/validation");
const { authAdmin, authTeacher } = require("../middlewares");

const router = express.Router();

// Admin -> get all sessions of all courses
// Student -> get sessions of his courses
// Teacher -> get sessions of his courses
router.get(
  "/",
  validation(SessionValidator.getSessions),
  // authAdmin,
  async (req, res, next) => {
    const { month, year } = req.query;
    const sessions = sessionController.getSessions(month, year);
    const [error, data] = await asycnWrapper(sessions);

    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  }
);

router.get(
  "/teacher",
  validation(SessionValidator.getSessions),
  authTeacher,
  async (req, res, next) => {
    const { month, year } = req.query;
    const teacherID = req.teacher._id;
    const sessions = sessionController.getTeacherSessions(
      teacherID,
      month,
      year
    );
    const [error, data] = await asycnWrapper(sessions);

    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  }
);

module.exports = router;
