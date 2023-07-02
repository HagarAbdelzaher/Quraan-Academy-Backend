const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced", "kids"],
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    numberOfSessions: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    daysOfWeek: {
      type: [
        {
          type: String,
          enum: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
        },
      ],
      required: true,
    },
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
courseSchema.plugin(mongoosePaginate);
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
