const { BaseError } = require('../libs');
const { Category, Question } = require('../models');

const addCategory = async (name) => {
  const category = await Category.create({ name });
  if (!category) {
    throw new BaseError('failed to create category!', 400);
  }
  return category;
};
const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new BaseError('failed to delete category!', 400);
  }
  return category;
};
const getCategories = () => Category.find({});

const askQuestion = async (question, studentID, categoryID) => {
  if (!studentID) throw new BaseError('un-Authorized', 401);
  if (!categoryID) throw new BaseError('No category specified!', 400);
  const newQuestion = await Question.create({ question, studentID, categoryID })
  console.log(newQuestion);
  if (!newQuestion) throw new BaseError('failed to add question!', 400);
  return newQuestion;
}
const updateQuestion = async (id, question, studentID, categoryID) => {
  if (!studentID) throw new BaseError('un-Authorized', 401);
  const studentQuestion = await Question.findOneAndUpdate(
    { _id: id, studentID },
    { question, categoryID },
    { new: true })
  if (!studentQuestion) throw new BaseError('failed to update question', 400);
  return studentQuestion;
}

const answerQuestion = async (id, answer, teacherID) => {
  if (!teacherID) throw new BaseError('un-Authorized', 401);
  const question = await Question.findById(id);
  if(question.answer && !question.teacherID.equals(teacherID)) throw new BaseError('un-Authorized', 401);
  // add new answer or update your answer
  const newAnswer = await Question.findByIdAndUpdate(id, { answer, teacherID }, { new: true });
  return newAnswer;
}

module.exports = {
  addCategory,
  deleteCategory,
  getCategories,
  askQuestion,
  updateQuestion,
  answerQuestion
};
