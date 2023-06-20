const express = require('express');
const userRoutes = require('./users');
const router = express.Router();

router.use('/user', userRoutes);

module.exports = router;
