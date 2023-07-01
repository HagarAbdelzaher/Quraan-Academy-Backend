/* eslint-disable consistent-return */
const express = require("express");
const { teacherController } = require("../controllers");
const { asycnWrapper } = require("../libs");
const { validation, TeacherValidator } = require("../middlewares/validation");
const { authAdmin } = require("../middlewares");

const router = express.Router();

// -> get teachers // pagination // filter by gender
//  By Admin
// -> add teacher // In sign up -> DONE
// -> update teacher
// -> delete teacher

router.get(
  "/",
  validation(TeacherValidator.getTeachers),
  async (req, res, next) => {
    const { gender, page = 1 } = req.query;
    if (page < 1 || page > 1000) {
      page = 1;
    }
    const limit = 6;
    const teachers = teacherController.getTeachers(page, limit, gender);
    const [error, data] = await asycnWrapper(teachers);

    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  }
);

// -> get teachers // not pagination
//  By Admin
router.get("/allTeachers", async (req, res, next) => {
  const teachers = teacherController.getTeachersNotPaginated();
  const [error, data] = await asycnWrapper(teachers);

  if (error) {
    return next(error);
  }
  res.status(200).json(data);
});

router.get(
  "/:id",
  validation(TeacherValidator.getTeacherById),
  async (req, res, next) => {
    const teacherId = req.params.id;
    const teacher = teacherController.getTeacherById(teacherId);
    const [error, data] = await asycnWrapper(teacher);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  }
);

router.patch(
  "/:id",
  authAdmin,
  validation(TeacherValidator.updateTeacher),
  async (req, res, next) => {
    const teacherId = req.params.id;
    const newData = req.body;
    const teacher = teacherController.updateTeacher(teacherId, newData);
    const [error, data] = await asycnWrapper(teacher);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  }
);

router.delete(
  "/:id",
  authAdmin,
  validation(TeacherValidator.deleteTeacher),
  async (req, res, next) => {
    const teacherId = req.params.id;
    const teacher = teacherController.deleteTeacher(teacherId);
    const [error, data] = await asycnWrapper(teacher);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  }
);

module.exports = router;
