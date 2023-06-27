/* eslint-disable consistent-return */
const express = require("express");
const { recordedCourseCategory } = require("../controllers");
const { asycnWrapper } = require("../libs");
const { validation, RecordedCourseCategoryValidator } = require("../middlewares/validation");


const router = express.Router();


/**
 * @DESC User can get recorded course category details
 * @ROUTE GET /recordedCourseCategory/:id/details
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
 * @DESC User can get all recorded course category paginated
 * @ROUTE GET /recordedCourseCategory/getAllRecordedCourseCategory
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
 * @DESC User can get all recorded course by category paginated
 * @ROUTE GET /recordedCourseCategory/:id/getRecordedCourses
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

module.exports = router;