const Project = require('../models/ProjectModel');

// Create a project
const createProject = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const project = new Project({
      title,
      description,
      status,
      user: req.user.id
    });
    await project.save();
    res.status(201).send({message:"project created successfully",success:true,project});
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });

    res.status(200).send({
      message: "Projects fetched successfully",
      success: true,
      projects
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Update a project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).send({
        message: 'Project not found',
        success: false
      });
    }

    res.status(200).send({
      message: 'Project updated successfully',
      success: true,
      project
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Delete a project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({ _id: id, user: req.user.id });

    if (!project) {
      return res.status(404).send({
        message: 'Project not found',
        success: false
      });
    }

    res.status(200).send({
      message: 'Project deleted successfully',
      success: true
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject
};
