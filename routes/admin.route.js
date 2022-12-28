const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller.js");
const verifyJWT = require("../middleware/verifyJWT.middleware.js");
const verifyRole = require("../middleware/verifyRole.middleware.js");
const ROLES = require("../config/rolesList.js");

router.use(verifyJWT);

router
    .get("/users", verifyRole(ROLES.Admin), adminController.getAllUsers)
    .get("/users/:id", verifyRole(ROLES.Admin), adminController.getUser);

module.exports = router;