const express = require('express');
const authRoutes = require('./auth');
const courseRoutes = require('./courses');

const router = express.Router();

router.use('/', authRoutes);
router.use('/course', courseRoutes);

module.exports = router;
