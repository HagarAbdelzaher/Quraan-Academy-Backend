/* eslint-disable consistent-return */
const express = require("express");
const { recordedCourses } = require("../../controllers");
const { asycnWrapper } = require("../../libs");
const { validation, RecordedCoursesValidator } = require("../../middlewares/validation");


const router = express.Router();

/**
 * @DESC Admin can add a recorded course
 * @ROUTE POST /admin/recordedCourses/add
 * @visibility private
 */

router.post(
    "/add",
    validation(RecordedCoursesValidator.addRecordedCourse),
    async (req, res, next) => {
        const { name, price, category } = req.body;
        const recordedCourse = recordedCourses.addRecordedCourse({
            name, price, category
        });
        const [error, data] = await asycnWrapper(recordedCourse);
        if (error) {
            return next(error);
        }
        res.status(201).json(data);
    }
);

/**
 * @DESC admin can get recorded course details
 * @ROUTE GET /admin/recordedCourses/:id/details
 * @visibility public
*/

router.get(
    "/:id/details",
    validation(RecordedCoursesValidator.getRecordedCourseById),
    async (req, res, next) => {
        const { id } = req.params;
        const RecordedCourse = recordedCourses.getRecordedCourseById(id);
        const [error, data] = await asycnWrapper(RecordedCourse);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
)

/**
 * @DESC Admin can get all recorded course paginated
 * @ROUTE GET /admin/recordedCourses/getAllRecordedCourses
 * @visibility public
 */

router.get(
    "/getAllRecordedCourses",
    validation(RecordedCoursesValidator.getAllRecordedCourses),
    async (req, res, next) => {
        const limit = 6;
        const category = req.query.category ? req.query.category : null;
        const page = req.query.page ? req.query.page : 1;
        const allRecordedCourses = recordedCourses.getAllRecordedCourses(page, limit, category);
        const [error, data] = await asycnWrapper(allRecordedCourses);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
);

/**
 * @DESC Admin can delete a recorded course
 * @ROUTE DELETE /admin/recordedCourses/:id
 * @visibility private
 */

router.delete(
    "/:id",
    validation(RecordedCoursesValidator.deleteRecordedCourse),
    async (req, res, next) => {
        const { id } = req.params;
        const recordedCourse = recordedCourses.deleteRecordedCourse(id);
        const [error, data] = await asycnWrapper(recordedCourse);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
);

/**
 * @DESC Admin can edit a recorded course
 * @ROUTE PATCH /admin/recordedCourses/:id
 * @visibility private
 */

router.patch(
    "/:id",
    validation(RecordedCoursesValidator.updateRecordeCourses),
    async (req, res, next) => {
        const { id } = req.params;
        const { name, price, category } = req.body;
        const recordedCourse = recordedCourses.updateRecordedCourse(id, {
            name, price, category
        });
        const [error, data] = await asycnWrapper(recordedCourse);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
);

module.exports = router;