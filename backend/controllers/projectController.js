const mongoose = require("mongoose");
const Project = require("../models/Project.js");
const User = require("../models/User.js");

const membersAreValid = async (members) => {
  if (!members.every((id) => mongoose.isValidObjectId(id))) return false;
  const count = await User.countDocuments({ _id: { $in: members } });
  return count === members.length;
};

exports.createProject = async (req, res) => {
  const { name, key, description, members = [] } = req.body;
  if (!name || !key) {
    return res.status(400).json({
      message: "All field are required",
    });
  }

  if (!(await membersAreValid(members))) {
    return res.status(400).json({
      message: "One or more members are invalid",
    });
  }
  try {
    const existingProject = await Project.findOne({ key: key.toUpperCase() });
    if (existingProject) {
      return res.status(409).json({
        message: "Project key already exists",
      });
    }

    const project = await Project.create({
      name,
      key,
      description,
      members,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const filter = req.user.role === "Admin" ? {} : { members: req.user._id };

    const projects = await Project.find(filter)
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project id",
      });
    }

    const project = await Project.findById(req.params.id).populate(
      "members",
      "name email role",
    );
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some((m) => m._id.equals(req.user._id));
    if (req.user.role !== "Admin" && !isMember) {
      return res.status(403).json({
        message: "You do not have access to this project",
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid project id",
      });
    }

    const project = await Projcts.findById(req.params.id);
    if (!project) {
      res.status(404).json({
        message: "Project not found",
      });
    }

    const { name, description, members } = req.body;

    if (members !== undefined) {
      if (!(await membersAreValid(members))) {
        returnres.status(400).json({
          message: "One or more members are invalid",
        });
      }
      project.members = members;
    }

    if (name) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
