/* eslint-disable consistent-return */
const express = require('express');
const { categoryController } = require('../controllers');
const { asycnWrapper } = require('../libs');
const { validation, CategoryValidator } = require('../middlewares/validation');

const router = express.Router();

/**
 * @DESC User can get category details
 * @ROUTE GET /category/:id/details
 * @visibility public
*/

router.get(
  '/:id/details',
  // validation(RecordedCourseCategoryValidator.getRecordedCourseCategoryById),
  async (req, res, next) => {
    const { id } = req.params;
    const category = categoryController.getCategoryDetails(id);
    const [error, data] = await asycnWrapper(category);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

/**
 * @DESC User can get all category paginated
 * @ROUTE GET /category/all
 * @visibility public
*/

router.get(
  '/all',
  validation(CategoryValidator.getAll),
  async (req, res, next) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const { type } = req.query;
    const allCategories = categoryController.getAllCategories(page, limit, type);
    const [error, data] = await asycnWrapper(allCategories);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

module.exports = router;
