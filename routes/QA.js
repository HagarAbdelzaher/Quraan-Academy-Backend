/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const express = require('express');
const { authStudent, authTeacher } = require('../middlewares');
const { QAController } = require('../controllers');
const { asycnWrapper } = require('../libs');
const { validation, QuestionValidator } = require('../middlewares/validation');

const router = express.Router();

/* Questions */

router.post(
  '/ask',
  validation(QuestionValidator.askQuestion),
  authStudent,
  async (req, res, next) => {
    const { body: { question, categoryID } } = req;
    const studentID = req.student._id;
    const newQuestion = QAController.askQuestion(question, studentID, categoryID);
    const [err, data] = await asycnWrapper(newQuestion);
    if (err) return next(err);
    res.status(201).json({ message: 'success', data });
  },
);
router.patch(
  '/:id',
  validation(QuestionValidator.updateQuestion),
  authStudent,
  async (req, res, next) => {
    const {
      body: { question, categoryID },
      params: { id },
    } = req;
    const studentID = req.student._id;
    const updateQuestion = QAController.updateQuestion(id, question, studentID, categoryID);
    const [err, data] = await asycnWrapper(updateQuestion);
    if (err) return next(err);
    res.status(201).json({ message: 'success', data });
  },
);

router.get(
  '/',
  async (req, res, next) => {
    const {
      query: {
        page, limit, categoryID, teacherID, answered
      },
    } = req;
    const questions = QAController.getAllQuestions(page, limit, { categoryID, teacherID, answered });
    const [err, data] = await asycnWrapper(questions);
    if (err) return next(err);
    res.status(200).json({ message: 'success', data });
  },
);

router.get(
  '/student',
  authStudent,
  async (req, res, next) => {
    const {
      query: {
        page, limit, categoryID,
      },
    } = req;
    const studentID = req.student._id;
    const questions = QAController.getUserQuestions(
      page,
      limit,
      { studentID, categoryID },
    );
    const [err, data] = await asycnWrapper(questions);
    if (err) return next(err);
    res.status(200).json({ message: 'success', data });
  },
);

router.delete(
  '/:id',
  authStudent,
  async (req, res, next) => {
    const { params: { id } } = req;
    const studentID = req.student._id;
    const deletedQuestion = QAController.deleteQuestion('student', id, studentID);
    const [err, data] = await asycnWrapper(deletedQuestion);
    if (err) return next(err);
    res.status(200).json({ message: 'success', data });
  },
);

/* Answers */
router.patch(
  '/:id/answer',
  validation(QuestionValidator.answerQuestion),
  authTeacher,
  async (req, res, next) => {
    const {
      body: { answer },
      params: { id },
    } = req;
    const teacherID = req.teacher._id;
    const newAnswer = QAController.answerQuestion(id, answer, teacherID);
    const [err, data] = await asycnWrapper(newAnswer);
    if (err) return next(err);
    res.status(200).json({ message: 'success', data });
  },
);

// delete answer for specific question by owner teacher
router.patch(
  '/:id/remove/answer',
  authTeacher,
  async (req, res, next) => {
    const { params: { id } } = req;
    const teacherID = req.teacher._id;
    const deletedAnswer = QAController.deleteAnswer('teacher', id, teacherID);
    const [err, data] = await asycnWrapper(deletedAnswer);
    if (err) return next(err);
    res.status(200).json({ message: 'success', data });
  },
);

module.exports = router;
