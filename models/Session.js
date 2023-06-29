const mongoose = require('mongoose');

const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    courseID: {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    date: {
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
    progressComment: {
      type: String,
    },
    startUrl: {
      type: String,
    },
    joinUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
