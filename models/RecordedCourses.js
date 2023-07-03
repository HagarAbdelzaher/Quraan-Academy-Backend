/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const recordedCoursesSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
        },
        price: {
            type: Number,
            required: true,
        },
        numberOfChapters: {
            type: Number,
            default: 0,
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);
recordedCoursesSchema.plugin(mongoosePaginate);

const RecordedCourses = mongoose.model('RecordedCourses', recordedCoursesSchema);

module.exports = RecordedCourses;
