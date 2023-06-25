const { BaseError } = require('../libs');
const { Category, Question } = require('../models');

const addCategory = async (name) => {
  const category = await Category.create({name});
  if (!category) {
    throw new BaseError('failed to create category!', 500);
  }
  return category;
};
const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new BaseError('failed to delete category!', 500);
  }
  return category;
};
const getCategories = () => Category.find({});

const askQuestion = async (question, studentID, categoryID) => {
  if (!studentID) throw new BaseError('un-Authorized', 401);
  if (!categoryID) throw new BaseError('No category specified!', 400);
  const newQuestion = await Question.create({ question, studentID, categoryID })
  console.log(newQuestion);
  if (!newQuestion) throw new BaseError('failed to add question!', 500);
  return newQuestion;
}

module.exports = {
  addCategory,
  deleteCategory,
  getCategories,
  askQuestion,
};
