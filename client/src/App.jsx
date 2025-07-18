// import { useState } from 'react'
// import './App.css'
// import useConfigurator from './context/Configurator'
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Navbar from './components/Navbar';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Projects from './components/Projects';
// import Tasks from './components/Tasks';
// import PrivateRoute from './components/PrivateRoute';

// function App() {


//   return (
//     <>
 
//    <BrowserRouter>
//    <ToastContainer/>
//       <Navbar/>
//       <Routes>
//        <Route path="/" element={<Home/>} />
//         <PrivateRoute path="/project" element={<Projects/>}/>
//         <PrivateRoute path="/projecttask/:id" element={   <Tasks/> } />

//       </Routes>
//     </BrowserRouter>
    
//     </>
//   )
// }

// export default App
import './App.css';
import useConfigurator from './context/Configurator';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* ✅ Protect this route */}
          <Route
            path="/project"
            element={
              <PrivateRoute>
                <Projects />
              </PrivateRoute>
            }
          />

          {/* ✅ Protect this route */}
          <Route
            path="/projecttask/:id"
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
