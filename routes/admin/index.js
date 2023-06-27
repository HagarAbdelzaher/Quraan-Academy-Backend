const express = require("express");
const adminRoutes = express.Router();

// Import other routers
const recordedCoursesRoutes = require("./recordedCourses");
const recordedCourseCategoryRoutes = require("./recordedCourseCategory");
const chapterRoutes = require("./chapter");

// Mount other routers as sub-routers
adminRoutes.use("/recordedCourses", recordedCoursesRoutes);
adminRoutes.use("/recordedCourseCategory", recordedCourseCategoryRoutes);
adminRoutes.use("/chapters", chapterRoutes);

module.exports = adminRoutes;