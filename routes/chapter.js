/* eslint-disable consistent-return */
const express = require("express");
const { chapterController } = require("../controllers");
const { asycnWrapper } = require("../libs");
const { validation, chapterValidator } = require("../middlewares/validation");


const router = express.Router();


/**
 * @DESC enrolled students can get chapters of recorded course
 * @ROUTE GET /chapters/recordedCourse/:id
 * @visibility private to admin and enrolled students
*/

router.get(
    "/recordedCourse/:id",
    validation(chapterValidator.getAllChapters),
    async (req, res, next) => {
        const { id } = req.params;
        const chapters = chapterController.getChaptersOfRecordedCourse(id);
        const [error, data] = await asycnWrapper(chapters);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
);

/**
 * @DESC enrolled students get a chapter by id
 * @ROUTE GET /chapters/:id
 * @visibility private enrolled student and admin
*/

router.get(
    "/:id",
    validation(chapterValidator.getChapterById),
    async (req, res, next) => {
        const { id } = req.params;
        const chapter = chapterController.getChapterById(id);
        const [error, data] = await asycnWrapper(chapter);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
);


module.exports = router;