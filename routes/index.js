const express = require("express");
const userRoutes = require("./users");
const courseRoutes = require("./courses");
const router = express.Router();

router.use("/user", userRoutes);
router.use("/course", courseRoutes);
module.exports = router;
