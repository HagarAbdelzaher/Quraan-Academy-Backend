const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
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
