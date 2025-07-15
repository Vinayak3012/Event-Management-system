const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event");

router.post("/create", eventController.create);

//get event by filter
router.get("/filter", eventController.filter);

module.exports = router;
