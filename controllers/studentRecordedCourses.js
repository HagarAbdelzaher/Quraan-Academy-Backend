const { Student, StudentRecordedCourses, Chapter, RecordedCourses } = require("../models");
const { BaseError } = require("../libs");


const getStudentRecordedCourses = async (studentId) => {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new BaseError("Student not found", 404);
    }
    const recordedCourses = await StudentRecordedCourses.find({ studentId: studentId }).populate("courseID");
    if (!recordedCourses) {
        throw new BaseError("student isn't enrolled in any recorded courses", 400);
    }
    return recordedCourses;
}

const getStudentRecordedCourseDetails = async (studentId, recordedCourseId) => {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new BaseError("Student not found", 404);
    }
    const recordedCourse = await StudentRecordedCourses.findOne({ studentId: studentId,  courseID: recordedCourseId }).populate("courseID");
    if (!recordedCourse) {
        throw new BaseError("student isn't enrolled in that course", 400);
    }
    return recordedCourse;
}

const studentGetRecordedCourseChapters = async (studentId, recordedCourseId) => {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new BaseError("Student not found", 404);
    }
    const course = await RecordedCourses.findById(recordedCourseId);
    if (!course) {
        throw new BaseError("Recorded course not found", 404);
    }
    const recordedCourse = await StudentRecordedCourses.findOne({ studentId, courseID: recordedCourseId }).exec();
    if (!recordedCourse) {
        throw new BaseError("student isn't enrolled in that recorded course", 400);
    }
    const chapters = Chapter.find({ recordedCourse: recordedCourseId });
    return chapters;
}

const studentFinishChapter = async (studentId, recordedCourseId, chapterId) => {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new BaseError("Student not found", 404);
    }
    const course = await RecordedCourses.findById(recordedCourseId);
    if (!course) {
        throw new BaseError("Recorded course not found", 404);
    }
    const chapter = await Chapter.findById(chapterId);
    if (!chapter || !chapter.recordedCourse.equals(course._id)) {
        throw new BaseError("Chapter not found or not part of this recorded course", 404);
    }
    const recordedCourse = await StudentRecordedCourses.findOne({ studentId, courseID: recordedCourseId }).populate("courseID").exec();
    if (!recordedCourse) {
        throw new BaseError("student isn't enrolled in that recorded course", 400);
    }
    if (recordedCourse.progress.includes(chapterId)) {
        throw new BaseError("Chapter is already marked as complete", 400);
    }
    if (recordedCourse.progress.length == course.numberOfChapters) {
        throw new BaseError("All chapters of this recorded course are already completed", 400);
    }
    if (recordedCourse.progress.length < course.numberOfChapters) {
        recordedCourse.progress.push(chapterId);
        await recordedCourse.save();
        return recordedCourse;
    } else {
        throw new BaseError("can't mark the chapter", 500);
    }
}







module.exports = {
    getStudentRecordedCourses,
    studentGetRecordedCourseChapters,
    studentFinishChapter,
    getStudentRecordedCourseDetails
}