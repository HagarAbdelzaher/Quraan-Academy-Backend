const { RecordedCourses, StudentRecordedCourses } = require("../models");
const { BaseError } = require("../libs");

const addRecordedCourse = async (data) => {
    const recordedCourse = await RecordedCourses.create(data);
    if (!recordedCourse) {
        throw new BaseError("can't create recorded course", 500);
    }
    return recordedCourse;
}

const getAllRecordedCourses = async (page, limit) => {
    const skip = (page - 1) * limit;
    const recordedCourses = await RecordedCourses.find().skip(skip).limit(limit);
    if (!recordedCourses) {
        throw new BaseError("can't get recorded courses", 500);
    }
    return recordedCourses;
}

const updateRecordedCourse = async (id, data) => {
    const recordedCourse = await RecordedCourses.findById(id);
    if (!recordedCourse) {
        throw new BaseError("course not found", 404);
    }
    const updatedRecordedCourse = await RecordedCourses.findByIdAndUpdate(id, data, { new: true });
    return updatedRecordedCourse;
}

const deleteRecordedCourse = async (id) => {
    const recordedCourse = await RecordedCourses.findById(id);
    if (!recordedCourse) {
        throw new BaseError("course not found", 404);
    }
    const enrolledStudentInRecordedCourse = await StudentRecordedCourses.findOne({ courseID: id });
    if (enrolledStudentInRecordedCourse) {
        throw new BaseError("Cannot delete recorded course with enrolled students", 400);
    }
    const deletedRecordedCourse = await RecordedCourses.findByIdAndDelete(id);
    return deletedRecordedCourse;
}

module.exports = {
    addRecordedCourse,
    getAllRecordedCourses,
    updateRecordedCourse,
    deleteRecordedCourse
}