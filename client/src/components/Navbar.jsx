import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const sessiondata = sessionStorage.getItem("user");
  const user = sessiondata ? JSON.parse(sessiondata) : null;
  const dropdownRef = useRef();
const navigate=useNavigate()
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const handleLogout = () => {
  sessionStorage.removeItem('user');
  toast.success('Logged out successfully!');
  navigate('/'); 
};
  return (
<header className="w-full bg-blue-900 shadow-lg px-4 py-3 flex items-center justify-between fixed top-0 z-50 text-white">

     
      <div>
        <Link  to={user ? "/project" : "/"} className="text-2xl font-bold text-white hover:text-yellow-200 transition">
          🏠 Home
        </Link>
      </div>


    {user && (
        <div className="flex items-center gap-4 relative">

  <button
    onClick={handleLogout}
    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm sm:text-base transition"
  >
    <FiLogOut className="text-lg" />
    <span className="hidden sm:inline">Logout</span>
  </button>

  {/* User Icon with Dropdown */}
  <div className="relative" ref={dropdownRef}>
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="text-white bg-blue-800 hover:bg-blue-700 px-2 py-2 rounded-full text-xl transition"
    >
      <FaUserCircle />
    </button>

    {/* Dropdown */}
    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-56 bg-gray-200 text-gray-800 border rounded-lg shadow-xl p-4 z-50">
<p className="text-sm font-semibold mb-1">
  👤 {user.name[0].toUpperCase() + user.name.slice(1)}
</p>
        <p className="text-sm text-gray-600 break-words ml-4">{user.email}</p>
      </div>
    )}
  </div>
</div>
    )}

    </header>
  );
};

export default Navbar;
