

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useConfigurator from '../context/Configurator';

const Register = () => {
  const { setUser } = useConfigurator();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // for password visibility

  const registerurl = 'https://projecttool-ro73.onrender.com/api/v1/user/register';
  const loginurl = 'https://projecttool-ro73.onrender.com/api/v1/user/login';
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleregister = async (data) => {
    try {
      if (!data.name || !data.email || !data.password) {
        toast.warning("All fields are required");
        return;
      }

      setLoading(true);

      const body = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const res = await axios.post(registerurl, body);

      if (res.data.success) {
        toast.success(res.data.message || "Registered successfully!");
        reset();
        setIsLogin(true);
      } else {
        toast.error(res.data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handlelogin = async (data) => {
    try {
      if (!data.email || !data.password) {
        toast.warning("All fields are required");
        return;
      }

      setLoading(true);

      const body = {
        email: data.email,
        password: data.password,
      };

      const res = await axios.post(loginurl, body);

      if (res.data.success) {
        const { token, name, email, userid } = res.data;
        sessionStorage.setItem("user", JSON.stringify({ token, name, email, userid }));
        setUser(true);
        toast.success(res.data.message || "Logged in successfully!");
        navigate('/project');
      } else {
        toast.error(res.data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    console.log(isLogin ? 'Login Data:' : 'Register Data:', data);
    isLogin ? handlelogin(data) : handleregister(data);
  };

  return (
    <div className="min-h-screen pt-[62px] bg-blue-950 flex flex-col items-center justify-center px-4 py-10">
      {/* Heading */}
      <div className="bg-orange-600 text-white text-center px-6 py-4 rounded-lg shadow-lg mb-8 w-full max-w-xl mt-[20px]">
        <h1 className="text-2xl font-bold">Welcome to Project Management Tool</h1>
        <p className="text-sm mt-1 text-blue-100">Manage tasks, teams, and timelines efficiently.</p>
      </div>

      {/* Form Card */}
      <div
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md"
        style={{ backgroundImage: `url('/bgform.jpg')` }}
      >
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-6">
          {isLogin ? 'Login Form' : 'Register Form'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name (only for register) */}
          {!isLogin && (
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password with eye icon */}
          <div>
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full mt-1 p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className="absolute right-3 top-4 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-2 rounded transition ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-800'
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 108 8h-4l3 3 3-3h-4a8 8 0 01-8 8z"
                ></path>
              </svg>
            )}
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-700 hover:underline font-medium"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;

