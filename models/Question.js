const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    trim: true,
    minLength: 5,
    maxLength: 255,
    required: true,
  },
  answer: {
    type: String,
    trim: true,
    minLength: 5,
    maxLength: 255,
    trim: true,
  },
  studentID: {
    type: mongoose.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  teacherID: {
    type: mongoose.Types.ObjectId,
    ref: 'Teacher',
  },
  categoryID: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
  },

}, {
  timestamps: true,
});
const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
