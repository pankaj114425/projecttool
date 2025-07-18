const express = require('express');
const colors = require('colors'); 
const dotenv = require('dotenv');
const userroutes=require('./routes/userroutes')
const projectroutes=require('./routes/projectroutes')
const taskroutes=require('./routes/taskroutes')
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config(); 

const app = express();
app.use(express.json()); 

app.use(cors());
// Connect to MongoDB

connectDB()


app.use('/api/v1/user',userroutes)
app.use('/api/v1/project',projectroutes)
app.use('/api/v1/task',taskroutes)

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} mode on port ${port}`.bgCyan.white
  );
});
