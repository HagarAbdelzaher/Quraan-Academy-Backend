const express = require('express');
const authRoutes = require('./auth');
const courseRoutes = require('./courses');
const testRoutes = require('./test');
const teacherRoutes = require('./teacher');
const questionRoutes = require('./QA');
const adminRoutes = require("./admin");
const studentRoutes = require('./student')
const recordedCoursesRoutes = require('./recordedCourses');
const chapterRoutes = require('./chapter');
const sessionRoutes = require("./session");
const categoryRoutes = require("./category");
const { authAdmin } = require('../middlewares');

const router = express.Router();

router.use("/", authRoutes);
router.use("/course", courseRoutes);
router.use("/teacher", teacherRoutes);
router.use("/meeting", testRoutes);
router.use("/admin", authAdmin, adminRoutes);
router.use("/question", questionRoutes);
router.use("/recordedCourses", recordedCoursesRoutes);
router.use("/chapters", chapterRoutes);
router.use("/session", sessionRoutes);
router.use("/student", studentRoutes);
router.use("/category", categoryRoutes);

module.exports = router;
