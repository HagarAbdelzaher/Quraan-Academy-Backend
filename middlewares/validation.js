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
  idParam: {
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
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
  updateTeacher: {
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().min(8),
      firstName: Joi.string().min(3),
      lastName: Joi.string().min(3),
      DOB: Joi.date(),
      gender: Joi.string().valid("Male", "Female"),
    }),
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  deleteTeacher: {
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  getTeacherById: {
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
};

const SessionValidator = {
  getSessions: {
    query: Joi.object().keys({
      month: Joi.number().min(1).max(12),
      year: Joi.number(),
    }),
  },
  createMeeting: {
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
};

const RecordedCoursesValidator = {
  addRecordedCourse: {
    body: Joi.object().keys({
      name: Joi.string().trim().min(3).max(25).required(),
      price: Joi.number().min(1).required(),
      category: Joi.string().trim().required().length(24),
    }),
  },
  getRecordedCourseById: {
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  updateRecordeCourses: {
    body: Joi.object().keys({
      name: Joi.string().trim().min(3).max(25),
      price: Joi.number().min(1),
      category: Joi.string().trim().length(24),
    }),
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  getAllRecordedCourses: {
    query: Joi.object()
      .required()
      .keys({
        page: Joi.number().required().min(1).max(1000),
        limit: Joi.number().min(1).max(1000),
        category: Joi.string().length(24).allow(''),
      }),
  },
  deleteRecordedCourse: {
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
};

const CategoryValidator = {
  addCategory: {
    body: Joi.object().keys({
      name: Joi.string().trim().min(2).max(30).required(),
      type: Joi.string().valid('question', 'recordedCourse').required(),
    }),
  },
  getAll: {
    query: Joi.object().keys({
      type: Joi.string().valid('question', 'recordedCourse', ''),
      page: Joi.number(),
      limit: Joi.number()
    }),
  },
  updateCat: {
    body: Joi.object().keys({
      name: Joi.string().trim().min(2).max(30)
    }),
  },
};

const QuestionValidator = {
  askQuestion: {
    body: Joi.object().keys({
      question: Joi.string().trim().min(5).max(255).required(),
      categoryID: Joi.string().length(24).required(),
    }),
  },
  updateQuestion: {
    body: Joi.object().keys({
      question: Joi.string().trim().min(5).max(255),
      categoryID: Joi.string().length(24),
    }),
  },
  answerQuestion: {
    body: Joi.object().keys({
      answer: Joi.string().trim().min(5).max(255).required(),
    }),
  },
};

const chapterValidator = {
  addChapter: {
    body: Joi.array()
      .required()
      .items(
        Joi.object().keys({
          title: Joi.string().min(3).required(),
          description: Joi.string().min(10).required(),
          media: Joi.string().required(),
        })
      ),
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  getChapterById: {
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  deleteChapter: {
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  updateChapter: {
    body: Joi.object().keys({
      title: Joi.string(),
      description: Joi.string().min(10),
      media: Joi.string(),
    }),
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  getAllChapters: {
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
};

const StudentValidator = {
  getStudents: {
    query: Joi.object().keys({
      gender: Joi.string().valid("Male", "Female"),
      DOB: Joi.date(),
      page: Joi.number().min(1).max(1000),
    }),
  },
  updateStudent: {
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().min(8),
      firstName: Joi.string().min(3),
      lastName: Joi.string().min(3),
      DOB: Joi.date(),
      gender: Joi.string().valid("Male", "Female"),
      level: Joi.string(),
    }),
    params: Joi.object()
      .required()
      .keys({
        id: Joi.string().length(24).required(),
      }),
  },
  enrollCourse: {
    idParam: {
      params: Joi.object()
        .required()
        .keys({
          id: Joi.string().length(24).required(),
        }),
    },
  },
  studentGetRecordedCourseChapters: {
    params: Joi.object().required().keys({
      id: Joi.string().length(24).required(),
    }),
  },
  studentFinishChapter: {
    params: Joi.object().required().keys({
      id: Joi.string().length(24).required(),
      chapterId: Joi.string().length(24).required(),
    }),
  },
  studentGetRecordedCourseDetails: {
    params: Joi.object().required().keys({
      id: Joi.string().length(24).required(),
    }),
  }
};

module.exports = {
  validation,
  UsersValidator,
  CourseValidator,
  TeacherValidator,
  RecordedCoursesValidator,
  // RecordedCourseCategoryValidator,
  CategoryValidator,
  QuestionValidator,
  chapterValidator,
  SessionValidator,
  StudentValidator,
};
