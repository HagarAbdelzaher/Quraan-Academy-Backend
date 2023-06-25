const express = require("express");
const authRoutes = require("./auth");
const courseRoutes = require("./courses");
const testRoutes = require("./test");
const teacherRoutes = require("./teacher");
const adminRoutes = require("./admin");
const router = express.Router();

router.use("/", authRoutes);
router.use("/course", courseRoutes);
router.use("/teacher", teacherRoutes);
router.use("/meeting", testRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
