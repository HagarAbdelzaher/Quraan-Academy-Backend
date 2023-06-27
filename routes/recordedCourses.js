/* eslint-disable consistent-return */
const express = require("express");
const { recordedCourses } = require("../controllers");
const { asycnWrapper } = require("../libs");
const { validation, RecordedCoursesValidator } = require("../middlewares/validation");


const router = express.Router();

/**
 * @DESC User can get recorded course details
 * @ROUTE GET recordedCourses/:id/details
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
 * @DESC User can get all recorded course paginated
 * @ROUTE GET recordedCourses/getAllRecordedCourses
 * @visibility public
*/

router.get(
    "/getAllRecordedCourses",
    validation(RecordedCoursesValidator.getAllRecordedCourses),
    async (req, res, next) => {
        const limit = 6;
        const page = req.query.page ? req.query.page : 1;
        const allRecordedCourses = recordedCourses.getAllRecordedCourses(page, limit);
        const [error, data] = await asycnWrapper(allRecordedCourses);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
);

module.exports = router;