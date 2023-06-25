/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const recordedCoursesSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 25,
        },
        price: {
            type: Number,
            required: true,
        },
        numberOfChapters: {
            type: Number,
            required: true,
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: "RecordedCourseCategory",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const RecordedCourses = mongoose.model('RecordedCourses', recordedCoursesSchema);

module.exports = RecordedCourses;
