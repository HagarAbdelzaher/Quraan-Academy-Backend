const express = require("express");
const authRoutes = require("./auth");
const courseRoutes = require("./courses");
const testRoutes = require("./test");
const teacherRoutes = require("./teacher");
const questionRoutes = require("./QA");
const adminRoutes = require('./admin');
const recordedCoursesRoutes = require('./recordedCourses');
const recordedCourseCategoryRoutes = require('./recordedCourseCategory');
const chapterRoutes = require('./chapter');
const sessionRoutes = require("./session");
const studentRoutes = require("./student");
const router = express.Router();

router.use("/", authRoutes);
router.use("/course", courseRoutes);
router.use("/teacher", teacherRoutes);
router.use("/meeting", testRoutes);
router.use("/admin", adminRoutes);
router.use("/question", questionRoutes);
router.use('/recordedCourses', recordedCoursesRoutes);
router.use('/recordedCourseCategory', recordedCourseCategoryRoutes);
router.use('/chapters', chapterRoutes);
router.use("/session", sessionRoutes);
router.use("/student",  studentRoutes);

module.exports = router;
