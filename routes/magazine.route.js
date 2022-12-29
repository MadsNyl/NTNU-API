const express = require("express");
const router = express.Router();
const magazineController = require("../controllers/magazine.controller.js");
const verifyJWT = require("../middleware/verifyJWT.middleware.js");
const verifyRole = require("../middleware/verifyRole.middleware.js");
const ROLES = require("../config/rolesList.js");

router.use(verifyJWT);

router.get("/:id", verifyRole(ROLES.Admin, ROLES.Editor), magazineController.getMagazine);


module.exports = router;