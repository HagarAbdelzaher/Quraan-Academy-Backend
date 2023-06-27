/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const chapterSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        media: {
            type: String,
            required: true
        },
        recordedCourse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RecordedCourses',
            required: true
        }
    },
    {
        timestamps: true,
    },
);

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;