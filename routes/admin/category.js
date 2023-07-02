const express = require('express');
const { categoryController } = require('../../controllers');
const { asycnWrapper } = require('../../libs');
const { validation, CategoryValidator } = require('../../middlewares/validation');

const router = express.Router();

/**
 * @DESC Admin can add a category
 * @ROUTE POST /admin/category/add
 * @visibility private
*/

router.post(
  '/add',
  validation(CategoryValidator.addCategory),
  async (req, res, next) => {
    const { name, type } = req.body;
    const createdCategory = categoryController.addCategory(name, type);
    const [error, data] = await asycnWrapper(createdCategory);
    if (error) {
      return next(error);
    }
    res.status(201).json(data);
  },
);

/**
 * @DESC Admin can get category details
 * @ROUTE GET /admin/category/:id/details
 * @visibility public
*/

router.get(
  '/:id/details',
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
 * @DESC Admin can get all category paginated filter by type
 * @ROUTE GET /admin/category/all
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

/**
 * @DESC Admin can get all category not paginated filter by type
 * @ROUTE GET /admin/category/allCategories
 * @visibility public
*/

router.get(
  '/allCategories',
  async (req, res, next) => {
    const { type } = req.query;
    const allCategories = categoryController.getUnpaginated(type);
    const [error, data] = await asycnWrapper(allCategories);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

/**
 * @DESC Admin can delete a category if it isnt associated with question or course
 * @ROUTE DELETE /admin/category/:id
 * @visibility private
*/

router.delete(
  '/:id',
  async (req, res, next) => {
    const { id } = req.params;
    const deletedCategory = categoryController.deleteCategory(id);
    const [error, data] = await asycnWrapper(deletedCategory);
    if (error) {
      return next(error);
    }
    res.status(200).json({ message: 'success', data });
  },
);

/**
 * @DESC Admin can edit a category name
 * @ROUTE PATCH /admin/category/:id
 * @visibility private
*/

router.patch(
  '/:id',
  validation(CategoryValidator.updateCat),
  async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCat = categoryController.updateCategory(id, {
      name,
    });
    const [error, data] = await asycnWrapper(updatedCat);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

module.exports = router;
