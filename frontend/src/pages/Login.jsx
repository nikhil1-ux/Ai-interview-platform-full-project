import React from 'react'
import "../style/Login.css"
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

import { useForm } from "react-hook-form";


const Login = () => {

  const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm()

const navigate = useNavigate();
const onSubmit = async (data) => {
 
 try {
    const response = await api.post("/auth/login", {
      email: data.email,
      password: data.password,
      role: data.role,
    });
    

    localStorage.setItem(
      "accessToken",
      response.data.data.accessToken
    );
 
    console.log(
  "Stored:",
  localStorage.getItem("accessToken")
   );

    localStorage.setItem("role", data.role);

    if (data.role === "student") {
      navigate("/candidate-dashboard");
    } else {
      navigate("/recruiter-dashboard");
    }
  } catch (error) {
    console.log("Error:", error);
    console.log("Response:", error.response?.data);
  }
};

  return (
  <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
  <h2>Login</h2>

  <select
    className="input-field"
    {...register("role", {
      required: "Role is required",
    })}
  >
    <option value="">Select Role</option>
    <option value="student">Student</option>
    <option value="recruiter">Recruiter</option>
  </select>

  {errors.role && (
    <p className="error">{errors.role.message}</p>
  )}

  <input
    className="input-field"
    {...register("email", {
      required: "Email is required",
    })}
    placeholder="Email"
  />

  {errors.email && (
    <p className="error">{errors.email.message}</p>
  )}

  <input
    className="input-field"
    type="password"
    {...register("password", {
      required: "Password is required",
    })}
    placeholder="Password"
  />

  {errors.password && (
    <p className="error">{errors.password.message}</p>
  )}

  <button className="login-btn" type="submit">
    Login
  </button>
</form>
  )
}

export default Login