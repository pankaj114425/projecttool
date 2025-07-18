// backend/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/UserModel');
const Project = require('./models/ProjectModel');
const Task = require('./models/TaskModel');
const connectDB = require('./config/db');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    connectDB()
 
const existingUser = await User.findOne({ email: 'test@example.com' });
let user;

if (!existingUser) {
  const hashedPassword = await bcrypt.hash('Test@123', 10);
  user = await User.create({
    name: 'testing user',
    email: 'test@example.com',
    password: hashedPassword,
  });
  console.log(' Test user created');
} else {
  user = existingUser;
  console.log('Test user already exists, using existing user');
}


await Project.deleteMany({ user: user._id });

const userProjects = await Project.find({ user: user._id });
const projectIds = userProjects.map((project) => project._id);

await Task.deleteMany({ projectId: { $in: projectIds } });

    
    const project1 = await Project.create({
      user: user._id,
      title: 'Project Example2',
      description: 'First project',
      status: 'Active',
    });

    const project2 = await Project.create({
      user: user._id,
      title: 'Project Example2',
      description: 'Second project',
      status: 'Completed',
    });

    // Add 3 tasks 
    const createTasks = async (projectId) => {
      const tasks = [
        { title: 'Task 1', description: 'First task', status: 'Todo', dueDate: new Date(),user: user._id, project:projectId },
        { title: 'Task 2', description: 'Second task', status: 'In-Progress', dueDate: new Date(),user: user._id,project: projectId },
        { title: 'Task 3', description: 'Third task', status: 'Done', dueDate: new Date(),user: user._id,project: projectId },
      ];
      await Task.insertMany(tasks);
    };

    await createTasks(project1._id);
    await createTasks(project2._id);

    console.log(' Seed data inserted!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error);
    process.exit(1);
  }
};

seed();
