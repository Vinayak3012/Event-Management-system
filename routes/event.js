const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event");

router.post("/", eventController.create);

//get event by filter
router.get("/upcoming", eventController.filter);

module.exports = router;
