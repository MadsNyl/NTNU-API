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
    .post("/connect", verifyRole(ROLES.Admin), siteController.connectSiteToUser)
    .delete("/remove", verifyRole(ROLES.Admin), siteController.removeUserFromSite)
    .delete("/delete", verifyRole(ROLES.Admin), siteController.deleteSite);

module.exports = router;