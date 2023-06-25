const express = require('express');
const { authAdmin, authStudent, authTeacher } = require('../middlewares');
const { QAController } = require('../controllers');
const { asycnWrapper } = require('../libs');

const router = express.Router();

// add category by admin --
// delete category by admin --
// get categories --
// add and update question by student --
// delete question by student and admin
// add and update answer by teacher --
// delete answer by teacher and admin
// get all questions (pagination)

router.post(
  '/category',
  authAdmin,
  async (req, res, next) => {
    const { body: { name } } = req;
    const category = QAController.addCategory(name);
    const [err, data] = await asycnWrapper(category);
    if (err) return next(err);
    res.status(201).json({ message: 'success', category: data });
  }
);
router.delete(
  '/category/:id',
  authAdmin,
  async (req, res, next) => {
    const { params: { id } } = req;
    const category = QAController.deleteCategory(id);
    const [err, data] = await asycnWrapper(category);
    if (err) return next(err);
    res.status(200).json({ message: 'success', deletedCategory: data });
  }
);
router.get(
  '/category',
  async (req, res, next) => {
    const category = QAController.getCategories();
    const [err, data] = await asycnWrapper(category);
    if (err) return next(err);
    res.status(200).json({ message: 'success', data });
  }
);
router.post(
  '/ask',
  authStudent,
  async (req, res, next) => {
    const { body: { question, categoryID } } = req;
    const studentID = req.student._id;
    const newQuestion = QAController.askQuestion(question, studentID, categoryID)
    const [err, data] = await asycnWrapper(newQuestion);
    if (err) return next(err);
    res.status(201).json({ message: 'success', data });
  }
);
router.patch(
  '/:id',
  authStudent,
  async (req, res, next) => {
    const { body: { question, categoryID },
      params: { id } } = req;
    const studentID = req.student._id;
    const updateQuestion = QAController.updateQuestion(id, question, studentID, categoryID)
    const [err, data] = await asycnWrapper(updateQuestion);
    if (err) return next(err);
    res.status(201).json({ message: 'success', data });
  }
);

router.patch(
  '/:id/answer',
  authTeacher,
  async (req, res, next) => {
    const { body: { answer },
      params: { id }
    } = req;
    const teacherID = req.teacher._id;
    const newAnswer = QAController.answerQuestion(id, answer, teacherID);
    const [err, data] = await asycnWrapper(newAnswer);
    if (err) return next(err);
    res.status(200).json({ message: 'success', data })
  }
);

module.exports = router;
