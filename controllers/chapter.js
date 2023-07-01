const { Chapter, RecordedCourses, StudentRecordedCourses } = require('../models');
const { BaseError } = require("../libs");

const createChapter = async (recordedCourseId, dataArr) => {
    const recordedCourse = await RecordedCourses.findById(recordedCourseId);
    if (!recordedCourse) {
        throw new BaseError('Recorded course not found', 404);
    }
    const chapters = [];
    for (let i = 0; i < dataArr.length; i++) {
        const chapterData = dataArr[i];
        const chapter = await Chapter.create({
            ...chapterData,
            recordedCourse: recordedCourseId
        });
        chapters.push(chapter);
    }
    await RecordedCourses.findByIdAndUpdate(recordedCourseId, { $inc: { numberOfChapters: chapters.length } });
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
    const chapter = await getChapterById(id);

    const enrolledStudentInRecordedCourse = await StudentRecordedCourses.findOne({ courseID: chapter.recordedCourse });
    if (enrolledStudentInRecordedCourse) {
        throw new BaseError("Cannot delete recorded course chapter with enrolled students", 400);
    }

    const deletedChapter = await Chapter.findByIdAndDelete(id);
    if (!deletedChapter) {
        throw new BaseError("Chapter cannot be deleted", 500);
    }
    const updateRecordedCourse = await RecordedCourses.findByIdAndUpdate(
        deletedChapter.recordedCourse,
        { $inc: { numberOfChapters: -1 } }
    );
    if (!updateRecordedCourse) {
        throw new BaseError("Cannot update recorded course", 500);
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
    const recordedCourse = await RecordedCourses.findById(recordedCourseId);
    if (!recordedCourse) {
        throw new BaseError('Recorded course not found', 404);
    }
    const chapters = await Chapter.find({ recordedCourse: recordedCourseId }).populate('recordedCourse', 'name');
    return chapters;
}

module.exports = {
    createChapter,
    getChapterById,
    deleteChapter,
    updateChapter,
    getChaptersOfRecordedCourse
}