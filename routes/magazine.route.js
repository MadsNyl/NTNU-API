const express = require("express");
const router = express.Router();
const magazineController = require("../controllers/magazine.controller.js");
const verifyJWT = require("../middleware/verifyJWT.middleware.js");
const verifyRole = require("../middleware/verifyRole.middleware.js");
const ROLES = require("../config/rolesList.js");
const multer  = require('multer')
const memoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: memoryStorage }).array("files");

router.use(verifyJWT);

router
    .get("/:id", verifyRole(ROLES.Admin, ROLES.Editor), magazineController.getMagazine)
    .delete("/delete", verifyRole(ROLES.Admin, ROLES.Editor), magazineController.deleteMagazine)
    .post("/create", [verifyRole(ROLES.Admin, ROLES.Editor), uploadStrategy], magazineController.createMagazine);



module.exports = router;