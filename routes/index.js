const express = require('express');
const authRoutes = require('./auth');
const courseRoutes = require('./courses');
const testRoutes = require('./test');
const teacherRoutes = require('./teacher');
const questionRoutes = require('./QA');
const adminRoutes = require("./admin");
const studentRoutes = require('./student')
const router = express.Router();

router.use('/', authRoutes);
router.use('/course', courseRoutes);
router.use('/teacher', teacherRoutes);
router.use('/meeting', testRoutes);
router.use("/admin", adminRoutes);
router.use('/question', questionRoutes);
router.use('/student', studentRoutes);


module.exports = router;
