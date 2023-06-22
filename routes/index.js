const express = require("express");
const userRoutes = require("./users");
const studentRoutes = require("./student/student");
const teacherRoutes = require("./teacher/teacher");
const adminRoutes = require("./admin/admin");
const router = express.Router();

router.use("/user", userRoutes);

module.exports = router;
