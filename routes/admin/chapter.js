/* eslint-disable consistent-return */
const express = require("express");
const { chapterController } = require("../../controllers");
const { asycnWrapper } = require("../../libs");
const { validation, chapterValidator } = require("../../middlewares/validation");


const router = express.Router();


/**
 * @DESC Admin can add chapters of recorded course
 * @ROUTE POST /admin/chapters/:id
 * @visibility private
*/

router.post(
    "/:id",
    validation(chapterValidator.addChapter),
    async (req, res, next) => {
        const chapters = chapterController.createChapter(req.params.id, req.body);
        const [error, data] = await asycnWrapper(chapters);
        if (error) {
            return next(error);
        }
        res.status(201).json(data);
    }
);

/**
 * @DESC admin can get chapters of recorded course
 * @ROUTE GET /admin/chapters/recordedCourse/:id
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
 * @DESC admin get a chapter by id
 * @ROUTE GET /admin/chapters/:id
 * @visibility private
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


/**
 * @DESC admin delete a chapter by id
 * @ROUTE DELETE /admin/chapters/:id
 * @visibility private
*/

router.delete(
    "/:id",
    validation(chapterValidator.deleteChapter),
    async (req, res, next) => {
        const { id } = req.params;
        const deletedChapter = chapterController.deleteChapter(id);
        const [error, data] = await asycnWrapper(deletedChapter);
        if (error) {
            return next(error);
        }
        res.status(200).json(data);
    }
);

/**
 * @DESC admin  update a chapter by id
 * @ROUTE PATCH /admin/chapters/:id
 * @visibility private
*/

router.patch(
    "/:id",
    validation(chapterValidator.updateChapter),
    async (req, res, next) => {
        const { id } = req.params;
        const {title, description, media} = req.body;
        const updatedChapter = chapterController.updateChapter(id, {title, description, media});
        const [error, result] = await asycnWrapper(updatedChapter);
        if (error) {
            return next(error);
        }
        res.status(200).json(result);
    }
);


module.exports = router;
