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

router.get(
  '/create-meeting/:id',
  validation(SessionValidator.createMeeting),
  authTeacher,
  async (req, res, next) => {
    const sessionId = req.params.id;
    const { teacher } = req;
    const sessions = sessionController.setMeeting(sessionId, teacher);
    const [error, data] = await asycnWrapper(sessions);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

router.patch(
  '/:id/comment',
  authTeacher,
  validation(SessionValidator.addComment),
  async (req, res, next) => {
    const { id } = req.params
    const { progressComment } = req.body;
    const teacher = req.teacher;
    const updatedSession = sessionController.setProgressComment(id, teacher, progressComment);
    const [err, data] = await asycnWrapper(updatedSession);
    if (err) {
      return next(err);
    }
    res.status(200).json(data);
  }
)
module.exports = router;
