const mongoose = require('mongoose');

const StudentCourseSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    studentId: {
        type: mongoose.Types.ObjectId,
        ref: "Student",
        required: true,
    },
}, {
    timestamps: true,
});
const StudentCourses = mongoose.model('StudentCourses', StudentCourseSchema);
module.exports = StudentCourses;
