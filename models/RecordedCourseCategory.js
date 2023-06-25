/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const recordedCourseCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 25,
        },
    },
    {
        timestamps: true,
    },
);

const RecordedCourseCategory = mongoose.model('RecordedCourseCategory', recordedCourseCategorySchema);

module.exports = RecordedCourseCategory;
