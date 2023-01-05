const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const verifyJWT = require("../middleware/verifyJWT.middleware.js");
const verifyRole = require("../middleware/verifyRole.middleware.js");
const ROLES = require("../config/rolesList.js");

router.use(verifyJWT);

router
    .get("/me", userController.getProfile)
    .put("/username", userController.updateUsername)

module.exports = router;