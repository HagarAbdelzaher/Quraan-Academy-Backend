/* eslint-disable consistent-return */
const express = require("express");
const { recordedCourseCategory } = require("../../controllers");
const { asycnWrapper } = require("../../libs");
const { validation, RecordedCourseCategoryValidator } = require("../../middlewares/validation");


const router = express.Router();

/**
 * @DESC Admin can add a recorded course category
 * @ROUTE POST /admin/recordedCourseCategory/add
 * @visibility private
*/

router.post(
    "/add",
    validation(RecordedCourseCategoryValidator.createCategory),
    async (req, res, next) => {
        const { name } = req.body;
        const createdCategory = recordedCourseCategory.createRecordedCourseCategory({
            name
        });
        const [error, data] = await asycnWrapper(createdCategory);
        if (error) {
            return next(error);
        }
        res.status(201).json(data);
    }
);

/**
 * @DESC Admin can get recorded course category details
 * @ROUTE GET /admin/recordedCourseCategory/:id/details
 * @visibility public
*/

router.get(
    "/:id/details",
    validation(RecordedCourseCategoryValidator.getRecordedCourseCategoryById),
    async (req, res, next) => {
        const { id } = req.params;
        const category = recordedCourseCategory.getRecordedCourseCategoryById(id);
        const [error, data] = await asycnWrapper(category);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
)


/**
 * @DESC Admin can get all recorded course category paginated
 * @ROUTE GET /admin/recordedCourseCategory/getAllRecordedCourseCategory
 * @visibility public
*/

router.get(
    "/getAllRecordedCourseCategory",
    validation(RecordedCourseCategoryValidator.getAllCategories),
    async (req, res, next) => {
        const limit = 6;
        const page = req.query.page ? req.query.page : 1;
        const allCategories = recordedCourseCategory.getAllRecordedCourseCategories(page, limit);
        const [error, data] = await asycnWrapper(allCategories);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
);

/**
 * @DESC Admin can get all recorded course by category paginated
 * @ROUTE GET /admin/recordedCourseCategory/:id/getRecordedCourses
 * @visibility public
*/

router.get(
    "/:id/getRecordedCourses",
    validation(RecordedCourseCategoryValidator.getRecordedCoursesByCategory),
    async (req, res, next) => {
        const limit = 6;
        const page = req.query.page ? req.query.page : 1;
        const { id } = req.params;
        const recordedCourses = recordedCourseCategory.getRecordedCoursesByCategory(id, page, limit);
        const [error, data] = await asycnWrapper(recordedCourses);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
)

/**
 * @DESC Admin can delete a recorded course category
 * @ROUTE DELETE /admin/recordedCourseCategory/:id
 * @visibility private
*/

router.delete(
    "/:id",
    validation(RecordedCourseCategoryValidator.deleteCategory),
    async (req, res, next) => {
        const { id } = req.params;
        const deletedCategory = recordedCourseCategory.deleteRecordedCourseCategory(id);
        const [error, data] = await asycnWrapper(deletedCategory);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
);

/**
 * @DESC Admin can edit a recorded course category
 * @ROUTE PATCH /admin/recordedCourseCategory/:id
 * @visibility private
*/

router.patch(
    "/:id",
    validation(RecordedCourseCategoryValidator.updateCategory),
    async (req, res, next) => {
        const { id } = req.params;
        const { name } = req.body;
        const updatedRecordedCourseCategory = recordedCourseCategory.updateRecordedCourseCategory(id, {
            name
        });
        const [error, data] = await asycnWrapper(updatedRecordedCourseCategory);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
);


module.exports = router;
