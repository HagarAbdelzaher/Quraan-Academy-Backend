/* eslint-disable consistent-return */
const express = require("express");
const { userController } = require("../controllers");
const { asycnWrapper } = require("../libs");
const { validation, UsersValidator } = require("../middlewares/validation");
const { BaseError } = require("../libs");
const { auth } = require("../middlewares");
const router = express.Router();


router.post(
  "/login",
  validation(UsersValidator.login),
  async (req, res, next) => {
    const {
      body: { userName, password },
    } = req;
    const user = userController.login(userName, password);
    const [error, data] = await asycnWrapper(user);
    if (error) {
      return next(error);
    }
    res.status(200).json({ token: data.token });
  }
);

router.post(
  "/signUp",
  validation(UsersValidator.signUp),
  async (req, res, next) => {
    const {
      body: { firstName, lastName, userName, password, DOB },
    } = req;
    const user = userController.signUp({
      firstName,
      lastName,
      userName,
      password,
      DOB,
    });
    const [error, data] = await asycnWrapper(user);
    if (error) {
      return next(error);
    }
    res.status(201).json({ sucess: true, data: data });
  }
);


module.exports = router;
