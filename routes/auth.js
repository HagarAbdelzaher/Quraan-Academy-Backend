/* eslint-disable consistent-return */
const express = require('express');
const { authController } = require('../controllers');
const { asycnWrapper } = require('../libs');
const { validation, UsersValidator } = require('../middlewares/validation');
const { authAdmin } = require('../middlewares');

const router = express.Router();

router.post(
  '/signUp/student',
  validation(UsersValidator.signUp),
  async (req, res, next) => {
    const {
      body: {
        firstName, lastName, email, password, DOB, gender,
      },
    } = req;
    const student = authController.signUpStudent({
      firstName,
      lastName,
      email,
      password,
      DOB,
      gender,
    });
    const [error, data] = await asycnWrapper(student);
    if (error) {
      return next(error);
    }
    res.status(201).json({ sucess: true, data });
  },
);

router.post(
  '/signUp/Teacher',
  authAdmin,
  validation(UsersValidator.signUp),
  async (req, res, next) => {
    const {
      body: {
        firstName, lastName, email, password, DOB, gender,
      },
    } = req;
    const teacher = authController.signUpTeacher({
      firstName,
      lastName,
      email,
      password,
      DOB,
      gender,
    });
    const [error, data] = await asycnWrapper(teacher);
    if (error) {
      return next(error);
    }
    res.status(201).json({ sucess: true, data });
  },
);

router.post(
  '/login/student',
  validation(UsersValidator.login),
  async (req, res, next) => {
    const {
      body: { email, password },
    } = req;
    const student = authController.loginStudent(email, password);
    const [error, data] = await asycnWrapper(student);
    if (error) {
      return next(error);
    }
    res.status(200).json({ token: data.token });
  },
);

router.post(
  '/login/teacher',
  validation(UsersValidator.login),
  async (req, res, next) => {
    const {
      body: { email, password },
    } = req;
    const student = authController.loginTeacher(email, password);
    const [error, data] = await asycnWrapper(student);
    if (error) {
      return next(error);
    }
    res.status(200).json({ token: data.token });
  },
);

router.post(
  '/login/admin',
  validation(UsersValidator.login),
  async (req, res, next) => {
    const {
      body: { email, password },
    } = req;
    const admin = authController.loginAdmin(email, password);
    const [error, data] = await asycnWrapper(admin);
    if (error) {
      return next(error);
    }
    res.status(200).json({ token: data.token });
  },
);

module.exports = router;
