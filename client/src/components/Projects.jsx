import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import useConfigurator from "../context/Configurator";
import { useNavigate } from "react-router-dom";



const Projects = () => {
  const getprojectsurl = "https://projecttool-ro73.onrender.com/api/v1/project/getallprojects";
  const addprojectsurl = "https://projecttool-ro73.onrender.com/api/v1/project/createproject";


const navigate=useNavigate()
const {projectDetail,setProjectDetail}=useConfigurator()
  const sessiondata = sessionStorage.getItem("user");
  const user = sessiondata ? JSON.parse(sessiondata) : null;
  const token = user?.token;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
   const [editMode, setEditMode] = useState(false);
    const [projectId, setProjectId] = useState(null);
  const [newProject, setNewProject] = useState({
    title: "",
    status: "Active",
    description: "",
  });

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "Active" && project.status === "Active") ||
      (filter === "Completed" && project.status === "Completed");
    return matchesSearch && matchesFilter;
  });

  

  const getAllProjects = async () => {
    try {
      const res = await axios.get(getprojectsurl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const formattedprojects = res.data.projects.map((proj) => ({
          id: proj._id,
          title: proj.title,
          description: proj.description,
          status: proj.status,
          createddate: new Date(proj.createdAt).toLocaleDateString(),
          completeddate: new Date(proj.updatedAt).toLocaleDateString(),  // format date
        }));

        setProjects(formattedprojects);
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
    getAllProjects();
  }
}, [token]);


  const handlecreateproject = async () => {
    if(!newProject.title || !newProject.description ||!newProject.status){
      toast.error("All field are required !!");
      return;
    }
     const body = newProject;

    try {
      const res = await axios.post(addprojectsurl, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
       setShowForm(false);
       setNewProject({ title: "", status: "Active", description: "" });
        toast.success(res.data.message || "Project created successfully");
        getAllProjects()
      } else {
        toast.error(res.data.message || "Failed to create project");
      }
    } catch (error) {
      console.error("Project creation error:", error);
      toast.error(error.response?.data?.message || "Error creating project");
    }
  };

const capitalizefirstletter = (str) => {
  return str?.charAt(0).toUpperCase() + str?.slice(1);
};

const handleEdit=(project)=>{
 setNewProject({
      title: project.title,
      status: project.status,
      description: project.description,
    });
    setEditMode(true);
    setProjectId(project.id);
    setShowForm(true);
}


const handleDelete=async(id)=>{

    try {
      const res = await axios.delete(`https://projecttool-ro73.onrender.com/api/v1/project/deleteproject/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Project deleted successfully");
        getAllProjects()
      } else {
        toast.error(res.data.message || "Failed to delete  project");
      }
    } catch (error) {
      console.error("Project deleting error:", error);
      toast.error(error.response?.data?.message || "Error deleting project");
    }
}

const handleupdatebutton=async()=>{
    if(!newProject.title || !newProject.description ||!newProject.status){
      toast.error("All field are required !!");
      return;
    }
     const body = newProject;

    try {
      const res = await axios.put(`https://projecttool-ro73.onrender.com/api/v1/project/updateproject/${projectId}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
       setShowForm(false);
       setEditMode(false);
       setProjectId(null);
       setNewProject({ title: "", status: "Active", description: "" });
        toast.success(res.data.message || "Project updated successfully");
        getAllProjects()
      } else {
        toast.error(res.data.message || "Failed to update  project");
      }
    } catch (error) {
      console.error("Project update error:", error);
      toast.error(error.response?.data?.message || "Error updating project");
    }
}

const handleProjectClick=(project)=>{
       setProjectDetail(project);
       navigate(`/projecttask/${project.id}`)
}
  return (
  <div className="flex flex-col md:flex-row min-h-screen pt-[62px] bg-gray-50">
    {/* Sidebar */}
    <aside className="w-full h-auto  md:w-1/4 p-4 border-r bg-blue-950">
      <input
        type="text"
        placeholder="🔍 Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 mb-4 border rounded"
      />
      <div className="space-y-2">
        <h2 className="font-semibold text-white">Filters</h2>
        {["All", "Active", "Completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`block w-full text-left px-3 py-2 rounded ${
              filter === f
                ? "bg-blue-100 text-black font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
    </aside>

    {/* Main Content */}
    <main className="w-full md:w-3/4 p-4">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Project
        </button>
      </div>

      {/* Project List */}
      <div className="grid gap-4 max-h-[580px] overflow-y-auto pr-2">
        {filteredProjects.length === 0 ? (
          <h1 className="text-center text-gray-500 py-8">No projects found.</h1>
        ) : (
          filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="p-4 bg-white rounded shadow border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold cursor-pointer"  onClick={() => handleProjectClick(project)}>
                   Title: {capitalizefirstletter(project.title)}
                  </h3>
                  <p className="text-gray-500">
                    {capitalizefirstletter(project.description)}
                  </p>
                    <p className="text-gray-500">
                    Created Date: {project.createddate}
                  </p>
                   <p className="text-gray-500">
                    Completed Date: {project.status === "Completed"  ? project.completeddate  : '________'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    {project.status}
                  </span>
                  <div className="flex gap-3">
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
              </div>
            </motion.div>
          ))
        )}
      </div>
    </main>

    {/* Add Project Modal */}
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
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h2 className="text-xl text-center font-semibold mb-4">{editMode ? 'Edit Project' : 'Add New Project'}</h2>

            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              required
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              required
              className="w-full mb-3 px-3 py-2 border rounded"
            />

            <select
              value={newProject.status}
              onChange={(e) =>
                setNewProject({ ...newProject, status: e.target.value })
              }
              required
              className="w-full mb-4 px-3 py-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={editMode ? handleupdatebutton :handlecreateproject}
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

export default Projects;
