const express = require('express');

const adminRoutes = express.Router();

// Import other routers
const recordedCoursesRoutes = require('./recordedCourses');
const recordedCourseCategoryRoutes = require('./recordedCourseCategory');
const chapterRoutes = require('./chapter');
const QARoutes = require('./QA');

// Mount other routers as sub-routers
adminRoutes.use('/recordedCourses', recordedCoursesRoutes);
adminRoutes.use('/recordedCourseCategory', recordedCourseCategoryRoutes);
adminRoutes.use('/chapters', chapterRoutes);
adminRoutes.use('/question', QARoutes);

module.exports = adminRoutes;
