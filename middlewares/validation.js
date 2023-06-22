const Joi = require('joi');
const { BaseError } = require('../libs');

const validation = (schema) => async (req, res, next) => {
  const validationErr = [];
  ['body', 'params', 'query'].forEach((key) => {
    if (schema[key]) {
      const validations = schema[key].validate(req[key]);
      if (validations.error) {
        validationErr.push(validations.error);
      }
    }
  });
  if (validationErr.length > 0) {
    next(new BaseError(`validation error ${validationErr[0].details[0].message}`, 422));
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
      gender: Joi.string().valid('Male', 'Female').required(),
    }),
  },
};

module.exports = { validation, UsersValidator };
