const { Course } = require("../models");
const { BaseError } = require("../libs");

const addCourse = async (data) => {
  const course = await Course.create(data);

  if (!course) {
    throw new BaseError("Adding Course Failed", 500);
  }
};

module.exports = {
  addCourse,
};
