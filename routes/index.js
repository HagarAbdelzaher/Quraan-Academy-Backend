const express = require('express');
const authRoutes = require('./auth');
const courseRoutes = require('./courses');
const testRoutes = require('./test');

const router = express.Router();

router.use('/', authRoutes);
router.use('/course', courseRoutes);
router.use('/meeting', testRoutes);

module.exports = router;
