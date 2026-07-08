import React from 'react'
import "../style/Auth.css"
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
    });

    const { accessToken, user } = response.data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("role", user.role);

    // Warn if the role picked at login doesn't match the account's actual role
    if (data.role && data.role !== user.role) {
      console.warn(
        `Selected role "${data.role}" does not match account role "${user.role}". Using the account's actual role.`
      );
    }

    if (user.role === "student") {
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
  <div className="auth-page">
  <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
  <p className="auth-eyebrow">Case&nbsp;No. — Access</p>
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

  <p className="auth-switch">
    New here? <a href="/signup">Create an account</a>
  </p>
</form>
  </div>
  )
}

export default Login