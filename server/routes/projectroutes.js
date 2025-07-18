const express = require('express');
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} = require('../controllers/projectcontroller');
const { auth } = require('../middleware/authmiddleware');

const router = express.Router();

router.post('/createproject', auth, createProject);
router.get('/getallprojects', auth, getProjects);
router.put('/updateproject/:id', auth, updateProject);
router.delete('/deleteproject/:id', auth, deleteProject);

module.exports = router;
