const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");
const ROLES = require("../config/rolesList.js");

router.post("/", authController.handleLogin);

module.exports = router;