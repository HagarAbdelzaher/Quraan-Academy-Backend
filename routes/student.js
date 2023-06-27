/* eslint-disable consistent-return */
const express = require('express');
const { studentController } = require('../controllers');
const { asycnWrapper } = require('../libs');
const { validation, StudentValidator } = require('../middlewares/validation');


const router = express.Router();


router.get(
  '/',
  validation(StudentValidator.getStudents),
  async (req, res, next) => {
    const { gender, DOB, page = 1 } = req.query;
    if (page < 1 || page > 1000) {
      page = 1;
    }
    const limit = 6;
    const students = studentController.getStudents(page, limit, gender, DOB);
    const [error, data] = await asycnWrapper(students);

    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

router.patch(
  '/:id',
  validation(StudentValidator.updateStudent),
  async (req, res, next) => {
    const studentId = req.params.id;
    const newData = req.body;
    const student = studentController.updateStudent(studentId, newData);
    const [error, data] = await asycnWrapper(student);
    if (error) {
      return next(error);
    }
    res.status(200).json(data);
  },
);

router.get('/:id', 
validation(StudentValidator.idParam),
async (req, res, next) => {
  const { id } = req.params;
  const [err, data] = await asycnWrapper(studentController.getStudentById(id));
  if (err) return next(err);
  res.status(200).json( data );
})


module.exports = router;
