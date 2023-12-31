const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const StudentCourseSchema = new mongoose.Schema(
  {
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
    teacherComment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

StudentCourseSchema.plugin(mongoosePaginate);
StudentCourseSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
const StudentCourses = mongoose.model("StudentCourses", StudentCourseSchema);
module.exports = StudentCourses;
