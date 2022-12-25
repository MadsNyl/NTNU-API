const express = require("express");
const router = express.Router();
const registerController = require("../controllers/register.controller.js");
const verifyJWT = require("../middleware/verifyJWT.middleware.js");


router.use(verifyJWT);

router.post("/", registerController.handleNewUser);

module.exports = router;