const { BaseError } = require('../libs');
const { Category, Question } = require('../models');

const askQuestion = async (question, studentID, categoryID) => {
  if (!studentID) throw new BaseError('un-Authorized', 401);
  if (!categoryID) throw new BaseError('No category specified!', 400);
  const category = await Category.findById(categoryID);
  if (!category) throw new BaseError('category not found', 404);
  if (category.type !== 'question') throw new BaseError('category invalid', 400);

  const newQuestion = await Question.create({ question, studentID, categoryID });
  if (!newQuestion) throw new BaseError('failed to add question!', 400);
  return newQuestion;
};

const updateQuestion = async (id, question, studentID, categoryID) => {
  if (!studentID) throw new BaseError('un-Authorized', 401);
  const questionAnswered = await Question.findById(id);
  if (questionAnswered.answer) { throw new BaseError('Cannot update an answered question!', 400); }

  if (categoryID) {
    const category = await Category.findById(categoryID);
    if (!category) throw new BaseError('category not found', 404);
    if (category.type !== 'question') throw new BaseError('category invalid', 400);
  }

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
      sort: { 'createdAt': -1 },
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

  const questions = await Question.paginate(query, {
    page: page || 1,
    limit: limit > 0 && limit < 100 ? limit : 20,
    sort: { 'createdAt': -1 },
    populate: [{ path: 'teacherID', select: 'firstName lastName' },
    { path: 'categoryID', select: 'name' }],
  });
  return questions;
};

const deleteQuestion = async (role, id, studentID) => {
  let deletedQuestion;
  if (role === 'admin') {
    deletedQuestion = await Question.findByIdAndDelete(id);
  } else if (role === 'student') {
    deletedQuestion = await Question.findOneAndDelete(
      {
        _id: id,
        studentID,
        answer: { $exists: false },
      },
    );
  }

  if (!deletedQuestion) throw new BaseError('cannot delete question', 400);
  return deletedQuestion;
};

const deleteAnswer = async (role, id, teacherID) => {
  let deletedAnswer;
  if (role === 'admin') {
    deletedAnswer = await Question.findOneAndUpdate(
      { _id: id, answer: { $exists: true } },
      { $unset: { answer: '', teacherID: '' } },
      { new: true },
    );
  } else if (role === 'teacher') {
    deletedAnswer = await Question.findOneAndUpdate(
      { _id: id, teacherID },
      { $unset: { answer: '', teacherID: '' } },
      { new: true },
    );
  }

  if (!deletedAnswer) throw new BaseError('cannot delete answer', 400);
  return deletedAnswer;
};

module.exports = {
  askQuestion,
  updateQuestion,
  answerQuestion,
  getAllQuestions,
  getUserQuestions,
  deleteQuestion,
  deleteAnswer,
};
