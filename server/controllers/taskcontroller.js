const Task = require('../models/TaskModel');

// Create Task
const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, project } = req.body;

    const task = new Task({
      title,
      description,
      status,
      dueDate,
      project,
      user: req.user.id
    });

    await task.save();

    res.status(201).send({
      message: 'Task created successfully',
      success: true,
      task
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all tasks for logged-in user
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({
      project: projectId,
      user: req.user.id
    });

    res.status(200).send({
      message: 'Tasks for this project fetched successfully',
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Update task
const updateTaskInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, project: projectId, user: req.user.id }, 
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).send({ message: 'Task not found in this project', success: false });
    }

    res.status(200).send({
      message: 'Task updated successfully',
      success: true,
      task
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Delete task
const deleteTaskInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      project: projectId,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).send({ message: 'Task not found in this project', success: false });
    }

    res.status(200).send({
      message: 'Task deleted successfully',
      success: true
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


module.exports = {
  createTask,
  getTasksByProject,
  updateTaskInProject,
  deleteTaskInProject
};
