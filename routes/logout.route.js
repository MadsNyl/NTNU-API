const express = require("express");
const router = express.Router();
const logoutController = require("../controllers/logout.controller.js");

router.put("/", logoutController.handleLogout);

module.exports = router;