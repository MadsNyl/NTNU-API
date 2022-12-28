const express = require("express");
const router = express.Router();
const siteController = require("../controllers/site.controller.js");
const verifyJWT = require("../middleware/verifyJWT.middleware.js");
const verifyRole = require("../middleware/verifyRole.middleware.js");
const ROLES = require("../config/rolesList.js");

router.use(verifyJWT);

router
    .get("/", verifyRole(ROLES.Editor, ROLES.Admin), siteController.getSiteInfo)
    .get("/all", verifyRole(ROLES.Admin), siteController.getAll)
    .post("/create", verifyRole(ROLES.Admin), siteController.createSite)
    .post("/connect", verifyRole(ROLES.Admin), siteController.connectSiteToUser);

module.exports = router;