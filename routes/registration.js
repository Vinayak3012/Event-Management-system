const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registration");

//registration
router.post("/", registrationController.create);

//all registration
router.get("/all", registrationController.all);

//cancel user registration
router.delete("/cancel/:user_id/:event_id", registrationController.cancel);

// event status
router.get("/status/:event_id", registrationController.status);

module.exports = router;
