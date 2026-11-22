const express = require("express");
const { getUsers } = require("../controllers/userController.js");
const { protect, authorize } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/", protect , authorize("Admin"), getUsers);

module.exports = router;
