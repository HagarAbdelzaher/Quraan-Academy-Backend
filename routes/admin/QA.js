/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();

const { QAController } = require('../../controllers');
const { asycnWrapper } = require('../../libs');
const { authAdmin } = require('../../middlewares');

router.delete(
  '/:id',
  authAdmin,
  async (req, res, next) => {
    const { params: { id } } = req;
    const deletedQuestion = QAController.deleteQuestion('admin', id);
    const [err, data] = await asycnWrapper(deletedQuestion);
    if (err) return next(err);
    res.status(200).json({ message: 'success', data });
  },
);

router.patch(
  '/:id/remove/answer',
  authAdmin,
  async (req, res, next) => {
    const { params: { id } } = req;
    const deletedAnswer = QAController.deleteAnswer('admin', id);
    const [err, data] = await asycnWrapper(deletedAnswer);
    if (err) return next(err);
    res.status(200).json({ message: 'success', data });
  },
);

module.exports = router;
