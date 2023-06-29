const { RecordedCourses, StudentRecordedCourses, Chapter } = require("../models");
const { BaseError } = require("../libs");

const addRecordedCourse = async (data) => {
    const recordedCourse = await RecordedCourses.create(data);
    if (!recordedCourse) {
        throw new BaseError("can't create recorded course", 500);
    }
    return recordedCourse;
}

const getRecordedCourseById = async (id) => {
    const recordedCourse = await RecordedCourses.findById(id);
    if (!recordedCourse) {
        throw new BaseError("course not found", 404);
    }
    return recordedCourse;
}

const getAllRecordedCourses = async (page, limit, category) => {
    let conditions = {};
    if (category) {
        conditions.category = category;
    }
    const skip = (page - 1) * limit;
    const recordedCourses = await RecordedCourses.find(conditions).skip(skip).limit(limit).populate("category", "name");
    if (!recordedCourses) {
        throw new BaseError("can't get recorded courses", 500);
    }
    return recordedCourses;
}

const updateRecordedCourse = async (id, data) => {
    await getRecordedCourseById(id);
    const updatedRecordedCourse = await RecordedCourses.findByIdAndUpdate(id, data, { new: true });
    return updatedRecordedCourse;
}

const deleteRecordedCourse = async (id) => {
    await getRecordedCourseById(id);
    const enrolledStudentInRecordedCourse = await StudentRecordedCourses.findOne({ courseID: id });
    if (enrolledStudentInRecordedCourse) {
        throw new BaseError("Cannot delete recorded course with enrolled students", 400);
    }
    const deletedRecordedCourse = await RecordedCourses.findByIdAndDelete(id);
    if (!deletedRecordedCourse) {
        throw new BaseError("Chapter cannot be deleted", 500);
    }
    await Chapter.deleteMany({ recordedCourse: id });
    return deletedRecordedCourse;
}

module.exports = {
    addRecordedCourse,
    getRecordedCourseById,
    getAllRecordedCourses,
    updateRecordedCourse,
    deleteRecordedCourse
}