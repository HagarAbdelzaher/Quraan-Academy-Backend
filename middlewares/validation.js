const Joi = require("joi");
const { BaseError } = require("../libs");

const validation = (schema) => async (req, res, next) => {
  const validationErr = [];
  ["body", "params", "query"].forEach((key) => {
    if (schema[key]) {
      const validations = schema[key].validate(req[key]);
      if (validations.error) {
        validationErr.push(validations.error);
      }
    }
  });
  if (validationErr.length > 0) {
    next(
      new BaseError(
        `validation error ${validationErr[0].details[0].message}`,
        422
      )
    );
  } else {
    next();
  }
};

const UsersValidator = {
  login: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  },
  signUp: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      firstName: Joi.string().required().min(3),
      lastName: Joi.string().required().min(3),
      DOB: Joi.date().required(),
      gender: Joi.string().valid("Male", "Female").required(),
    }),
  },
};
const CourseValidator = {
  addCourse: {
    body: Joi.object().keys({
      name: Joi.string().required(),
      level: Joi.string()
        .valid("beginner", "intermediate", "advanced")
        .required(),
      description: Joi.string().required(),
      numberOfSessions: Joi.number().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
      daysOfWeek: Joi.array()
        .items(
          Joi.string().valid(
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          )
        )
        .required(),
      teacher: Joi.string().required().length(24),
      price: Joi.number().required(),
    }),
  },
  getCourses: {
    query: Joi.object().keys({
      level: Joi.string().valid("beginner", "intermediate", "advanced"),
      teacher: Joi.string().length(24),
      page: Joi.number().min(1).max(1000),
    }),
  },
  updateCourse: {
    body: Joi.object().keys({
      name: Joi.string(),
      level: Joi.string().valid("beginner", "intermediate", "advanced"),
      description: Joi.string(),
      numberOfSessions: Joi.number(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      startTime: Joi.string(),
      endTime: Joi.string(),
      daysOfWeek: Joi.array().items(
        Joi.string().valid(
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        )
      ),
      teacher: Joi.string().length(24),
      price: Joi.number(),
    }),
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  deleteCourse: {
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
};
const TeacherValidator = {
  getTeachers: {
    query: Joi.object().keys({
      gender: Joi.string().valid("Male", "Female"),
      page: Joi.number().min(1).max(1000),
    }),
  },
};

const RecordedCoursesValidator = {
  addRecordedCourse: {
    body: Joi.object().keys({
      name: Joi.string().trim().min(3).max(25).required(),
      price: Joi.number().trim().required(),
      numberOfChapters: Joi.number().trim().required(),
      category: Joi.string().trim().required().length(24),
    }),
  },
  updateRecordeCourses: {
    body: Joi.object().keys({
      name: Joi.string().trim().min(3).max(25).required(),
      price: Joi.number().trim().required(),
      numberOfChapters: Joi.number().trim().required(),
      category: Joi.string().trim().required().length(24),
    }),
  }
};

module.exports = {
  validation,
  UsersValidator,
  CourseValidator,
  TeacherValidator,
  RecordedCoursesValidator
};
