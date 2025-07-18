const express = require('express');
const {
  createTask,
  getTasksByProject,
  updateTaskInProject,
  deleteTaskInProject,
 
} = require('../controllers/taskcontroller');
const { auth } = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/createtask', auth, createTask);
router.get('/project/:projectId/tasks', auth, getTasksByProject);  //id:projectid
router.put('/project/:projectId/tasks/:taskId', auth, updateTaskInProject);
router.delete('/project/:projectId/tasks/:taskId', auth, deleteTaskInProject);

module.exports = router;
