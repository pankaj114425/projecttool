import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import useConfigurator from '../context/Configurator';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';



const Tasks = () => {
  const params=useParams()
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    status: 'Todo',
    description: '',
    dueDate: '',
  });
const addtasksurl = "https://projecttool-ro73.onrender.com/api/v1/task/createtask";

const {projectDetail,setProjectDetail}=useConfigurator()
const navigate=useNavigate()
  const sessiondata = sessionStorage.getItem("user");
  const user = sessiondata ? JSON.parse(sessiondata) : null;
  const token = user?.token;
  const filteredProjects = tasks.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Todo' && project.status === 'Todo') ||
      (filter === 'In-Progress' && project.status === 'In-Progress')||
      (filter === 'Done' && project.status === 'Done');
    return matchesSearch && matchesFilter;
  });

  

  const handleDelete=async(id)=>{

    try {
      const res = await axios.delete(`https://projecttool-ro73.onrender.com/api/v1/task/project/${params.id}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Task deleted successfully");
        getAllTasks()
      } else {
        toast.error(res.data.message || "Failed to delete  task");
      }
    } catch (error) {
      console.error("Task deleting error:", error);
      toast.error(error.response?.data?.message || "Error deleting Task");
    }
}

  const handleEdit = (task) => {
    let formattedDate = '';

  if (task.dueDate) {
    const [day, month, year] = task.dueDate.split('/');
    // Convert to YYYY-MM-DD
    formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
    setNewTask({
      title: task.title,
      status: task.status,
      description: task.description,
      dueDate: formattedDate
    });
    setEditMode(true);
    setEditId(task.id);
    setShowForm(true);
  };


  const handleupdatebutton=async()=>{
    if(!newTask.title || !newTask.description ||!newTask.status || !newTask.dueDate){
      toast.error("All field are required !!");
      return;
    }
     const body = newTask;
    
    try {
      const res = await axios.put(`https://projecttool-ro73.onrender.com/api/v1/task/project/${params.id}/tasks/${editId}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
       setShowForm(false);
       setEditMode(false);
       setEditId(null);
       setNewTask({ title: "", status: "Todo", description: "" ,dueDate:"" });
        toast.success(res.data.message || "Task updated successfully");
        getAllTasks()
      } else {
        toast.error(res.data.message || "Failed to update  task");
      }
    } catch (error) {
      console.error("Task update error:", error);
      toast.error(error.response?.data?.message || "Error updating Task");
    }
}

    const getAllTasks = async () => {
    try {
      const res = await axios.get(`https://projecttool-ro73.onrender.com/api/v1/task/project/${params.id}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log(res.data)
      if (res.data.success) {
        const formattedtasks = res.data?.tasks.map((task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate:new Date(task.dueDate).toLocaleDateString(),
          createddate: new Date(task.createdAt).toLocaleDateString(),
          completeddate: new Date(task.updatedAt).toLocaleDateString(),  // format date
        }));

        setTasks(formattedtasks);
      } else {
        toast.error("Failed to fetch projects.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Something went wrong while fetching projects.");
    }
  };



useEffect(() => {
  if (token) {
    getAllTasks();
  }
}, [token]);



    const handlecreatetask = async () => {
      if(!newTask.title || !newTask.description ||!newTask.status || !newTask.dueDate){
        toast.error("All field are required !!");
        return;
      }
   
       const body = {... newTask,project:params.id};
 
      try {
        const res = await axios.post(addtasksurl, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (res.data.success) {
         setShowForm(false);
         setNewTask({ title: "", status: "Todo", description: "" ,dueDate : ""});
          toast.success(res.data.message || "Task created successfully");
          getAllTasks()
        } else {
          toast.error(res.data.message || "Failed to create task");
        }
      } catch (error) {
        console.error("Task creation error:", error);
        toast.error(error.response?.data?.message || "Error creating task");
      }
    };

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-[62px] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full  md:w-1/4 p-4 border-r bg-blue-950">
        <input
          type="text"
          placeholder="🔍 Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <div className="space-y-2">
          <h2 className="font-semibold text-white">Filters</h2>
          {['All', 'Todo', 'In-Progress','Done'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`block w-full text-left px-3 py-2 rounded ${
                filter === f ? 'bg-blue-100 text-black font-medium' : 'hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-3/4 p-4">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <div
      onClick={() => navigate("/project")}
      className="flex items-center gap-2 cursor-pointer text-base font-bold hover:text-blue-600 transition"
    >
      <FaArrowLeft size={20} />
      <h1 className='text-2xl font-bold'>Go Back</h1>
    </div>
          <button
            onClick={() => {
              setEditMode(false);
              setNewTask({ title: '', status: 'Todo', description: '', dueDate: '' });
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Task
          </button>
        </div>

        {/* Project List */}
       <div className="grid gap-4 max-h-[580px] overflow-y-auto pr-2">
    {filteredProjects.length > 0 ? (
     filteredProjects.map((project) => (
      <motion.div
        key={project.id}
        className="p-4 bg-white rounded shadow border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-lg font-semibold">Title: {project.title}</h3>
            <p className="text-gray-500">{project.description}</p>
            <p className=" text-gray-500">Due Date: {project.dueDate || 'Not set'}</p>
               <p className="text-gray-500">
                    Completed Date: {project.status === "Done"  ? project.completeddate  : '________'}
                  </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              { project.status}
            </span>
            <button
              onClick={() => handleEdit(project)}
              className="text-white bg-green-500 hover:bg-green-600"
            >
              Edit
            </button>
            <button
             onClick={() => handleDelete(project.id)}
               className="text-white bg-red-500 hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    ))
  ) : (
    <h1 className="text-center text-gray-500">No task found</h1>
  )}
</div>

      </main>

      {/* Add/Edit Project Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit Task' : 'Add New Task'}</h2>

              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full mb-3 px-3 py-2 border rounded"
              />

              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full mb-3 px-3 py-2 border rounded"
              />

              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full mb-3 px-3 py-2 border rounded"
              />

              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                className="w-full mb-4 px-3 py-2 border rounded"
              >
                <option value="Todo">Todo</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Done">Done</option>
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditMode(false);
                    setNewTask({ title: '', status: 'Todo', description: '', dueDate: '' });
                  }}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                    onClick={editMode ? handleupdatebutton :handlecreatetask}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editMode ? 'Update' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;
