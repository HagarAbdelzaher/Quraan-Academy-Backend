const express = require('express');
const authRoutes = require('./auth');
const courseRoutes = require('./courses');
const testRoutes = require('./test');
const teacherRoutes = require('./teacher');
const questionRoutes = require('./QA');

const router = express.Router();

router.use('/', authRoutes);
router.use('/course', courseRoutes);
router.use('/teacher', teacherRoutes);
router.use('/meeting', testRoutes);
router.use('/question', questionRoutes);

module.exports = router;
