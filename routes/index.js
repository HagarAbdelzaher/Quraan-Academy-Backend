const express = require("express");
const authRoutes = require("./auth");
const courseRoutes = require("./courses");
const testRoutes = require("./test");
const teacherRoutes = require("./teacher");
const router = express.Router();

router.use("/", authRoutes);
router.use("/course", courseRoutes);
router.use("/teacher", teacherRoutes);
router.use("/meeting", testRoutes);

module.exports = router;
