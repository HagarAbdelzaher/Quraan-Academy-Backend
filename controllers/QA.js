const { BaseError } = require('../libs');
const { QuestionCategory, Question } = require('../models');

const addCategory = async (name) => {
  const category = await QuestionCategory.create({ name });
  if (!category) {
    throw new BaseError('failed to create category!', 400);
  }
  return category;
};
const deleteCategory = async (id) => {
  const category = await QuestionCategory.findByIdAndDelete(id);
  if (!category) {
    throw new BaseError('failed to delete category!', 400);
  }
  return category;
};
const getCategories = () => QuestionCategory.find({});

const askQuestion = async (question, studentID, categoryID) => {
  if (!studentID) throw new BaseError('un-Authorized', 401);
  if (!categoryID) throw new BaseError('No category specified!', 400);
  const newQuestion = await Question.create({ question, studentID, categoryID });
  if (!newQuestion) throw new BaseError('failed to add question!', 400);
  return newQuestion;
};
const updateQuestion = async (id, question, studentID, categoryID) => {
  if (!studentID) throw new BaseError('un-Authorized', 401);
  const questionAnswered = await Question.findById(id);

  if (questionAnswered.answer) { throw new BaseError('Cannot update an answered question!', 400); }

  const studentQuestion = await Question.findOneAndUpdate(
    { _id: id, studentID },
    { question, categoryID },
    { new: true },
  );
  if (!studentQuestion) throw new BaseError('failed to update question', 400);
  return studentQuestion;
};

const answerQuestion = async (id, answer, teacherID) => {
  if (!teacherID) { throw new BaseError('un-Authorized', 401); }

  const question = await Question.findById(id);
  if (question.answer && !question.teacherID.equals(teacherID)) { throw new BaseError('un-Authorized', 401); }

  // add new answer or update your answer
  const newAnswer = await Question.findByIdAndUpdate(id, { answer, teacherID }, { new: true });
  return newAnswer;
};

const getAllQuestions = async (page, limit, filter) => {
  const query = {};

  if (filter.categoryID) {
    query.categoryID = filter.categoryID;
  }
  if (filter.teacherID) {
    query.teacherID = filter.teacherID;
  }

  const questions = await Question.paginate(
    query,
    {
      page: page || 1,
      limit: limit > 0 && limit < 100 ? limit : 20,
      populate: [{ path: 'studentID', select: 'firstName lastName' },
      { path: 'teacherID', select: 'firstName lastName' },
      { path: 'categoryID', select: 'name' },
      ],
    },
  );
  return questions;
};

const getUserQuestions = async (page, limit, filter) => {
  if (!filter.studentID) throw new BaseError('Un-Authorized', 401);

  const query = { studentID: filter.studentID };

  if (filter.categoryID) {
    query.categoryID = filter.categoryID;
  }
  if (filter.teacherID) {
    query.teacherID = filter.teacherID;
  }

  const questions = await Question.paginate(query, {
    page: page || 1,
    limit: limit > 0 && limit < 100 ? limit : 20,
    populate: [{ path: 'teacherID', select: 'firstName lastName' },
    { path: 'categoryID', select: 'name' }],
  });

  return questions;
};

const deleteQuestion = async (role, id, studentID) => {
  let deletedQuestion;
  if (role === 'admin') // admin can delete question with answer
    deletedQuestion = await Question.findByIdAndDelete(id);
  else if (role === 'student') // student cannot delete answered question
    deletedQuestion = await Question.findOneAndDelete({ _id: id, studentID, answer: { $exists: false } });
  
  if (!deletedQuestion) throw new BaseError('cannot delete question', 400);
  return deletedQuestion;
}

module.exports = {
  addCategory,
  deleteCategory,
  getCategories,
  askQuestion,
  updateQuestion,
  answerQuestion,
  getAllQuestions,
  getUserQuestions,
  deleteQuestion
};
