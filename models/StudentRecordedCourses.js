/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const studentRecordedCoursesSchema = new Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        courseID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RecordedCourses",
            required: true,
        },
        progress: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            ref: "Chapter",
        },
    },
    {
        timestamps: true,
    },
);

const StudentRecordedCourses = mongoose.model('StudentRecordedCourses', studentRecordedCoursesSchema);

module.exports = StudentRecordedCourses;
