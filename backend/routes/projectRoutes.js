const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
} = require("../controllers/projectController.js");
const { protect, authorize } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.use(protect); // every project needs a login

router.route("/").post(authorize("Admin"), createProject).get(getProjects);

router.route("/:id").get(getProjectById).put(authorize("Admin"), updateProject);

module.exports = router;
