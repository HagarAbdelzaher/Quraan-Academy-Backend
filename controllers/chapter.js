const { Chapter, RecordedCourses } = require('../models');
const { BaseError } = require("../libs");

const createChapter = async (recordedCourseId, dataArr) => {
    const recordedCourse = await RecordedCourses.findById(recordedCourseId);
    if (!recordedCourse) {
        throw new BaseError('Recorded course not found', 404);
    }
    const numberOfChapters = recordedCourse.numberOfChapters;
    if (dataArr.length !== numberOfChapters) {
        throw new BaseError(`Expected ${numberOfChapters} chapter data objects, but received ${dataArr.length}`, 400);
    }
    const chapters = [];
    for (let i = 0; i < numberOfChapters; i++) {
        const chapterData = dataArr[i];
        const chapter = await Chapter.create({
            ...chapterData,
            recordedCourse: recordedCourseId
        });
        chapters.push(chapter);
    }
    return chapters;
}

const getChapterById = async (id) => {
    const chapter = await Chapter.findById(id);
    if (!chapter) {
        throw new BaseError('Chapter not found', 404);
    }
    return chapter;
}

const deleteChapter = async (id) => {
    await getChapterById(id);
    const deletedChapter = await Chapter.findByIdAndDelete(id);
    if (!deletedChapter) {
        throw new BaseError("Chapter cannot be deleted", 500);
    }
    return deletedChapter;
}

const updateChapter = async (id, data) => {
    await getChapterById(id);
    const updatedChapter = await Chapter.findByIdAndUpdate(id, data, { new: true });
    if (!updatedChapter) {
        throw new BaseError("Cannot update chapter", 500);
    }
    return updatedChapter;
}

const getChaptersOfRecordedCourse = async (recordedCourseId) => {
    const chapters = await Chapter.find({ recordedCourse: recordedCourseId });
    return chapters;
}

module.exports = {
    createChapter,
    getChapterById,
    deleteChapter,
    updateChapter,
    getChaptersOfRecordedCourse
}