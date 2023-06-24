const { Teacher } = require("../models");
const { BaseError } = require("../libs");

const getTeachers = async (page, limit, gender) => {
  const conditions = {};
  if (gender) {
    conditions.gender = gender;
  }
  const skip = (page - 1) * limit;
  const teachers = await Teacher.find(conditions)
    .skip(skip)
    .limit(limit)
    .exec();
  if (!teachers) {
    throw new BaseError("No teachers found", 404);
  }
  return teachers;
};
module.exports = { getTeachers };
