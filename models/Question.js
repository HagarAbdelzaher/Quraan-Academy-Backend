const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    ref: 'QuestionCategory',
  },

}, {
  timestamps: true,
});
QuestionSchema.plugin(mongoosePaginate);
const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
