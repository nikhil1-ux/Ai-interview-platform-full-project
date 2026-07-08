import React from "react";
import { useForm } from "react-hook-form";
import "../style/Auth.css";
import "../style/Signup.css";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Signup = () => {

  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const role = watch("role", "");
  const password = watch("password");

const onSubmit = async (data) => {
  try {
    const response = await api.post("/auth/signup", data);

    toast.success("Signup successful!");

    // Save user/token if needed
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("user", JSON.stringify(response.data.data));

    setTimeout(() => {
      if (response.data.data.role === "student") {
        navigate("/candidate-dashboard");
      } else {
        navigate("/recruiter-dashboard");
      }
    }, 1000);

  } catch (error) {
    toast.error(error.response?.data?.message || "Signup failed!");
  }
};

  return (
    <div className="auth-page">
    <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
      <p className="auth-eyebrow">Case&nbsp;No. — New Intake</p>
      <h2>Create Account</h2>

      {/* Name */}
      <input
        className="input-field"
        placeholder="Full Name"
        {...register("name", {
          required: "Name is required",
        })}
      />
      {errors.name && (
        <p className="error">{errors.name.message}</p>
      )}

      {/* Email */}
      <input
        className="input-field"
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "Email is required",
        })}
      />
      {errors.email && (
        <p className="error">{errors.email.message}</p>
      )}

      {/* Password */}
      <input
        className="input-field"
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
      />
      {errors.password && (
        <p className="error">{errors.password.message}</p>
      )}

      {/* Confirm Password */}
      <input
        className="input-field"
        type="password"
        placeholder="Confirm Password"
        {...register("confirmPassword", {
          required: "Confirm Password is required",
          validate: (value) =>
            value === password || "Passwords do not match",
        })}
      />
      {errors.confirmPassword && (
        <p className="error">{errors.confirmPassword.message}</p>
      )}

      {/* Role */}
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

      {/* Student Fields */}
      {role === "student" && (
        <div className="form-grid">
          <div>
            <input
              className="input-field"
              placeholder="College Name"
              {...register("collegeName", {
                required: "College Name is required",
              })}
            />
            {errors.collegeName && (
              <p className="error">
                {errors.collegeName.message}
              </p>
            )}
          </div>

          <div>
            <input
              className="input-field"
              placeholder="Branch"
              {...register("branch", {
                required: "Branch is required",
              })}
            />
            {errors.branch && (
              <p className="error">
                {errors.branch.message}
              </p>
            )}
          </div>

          <div>
            <input
              className="input-field"
              placeholder="Year"
              {...register("year", {
                required: "Year is required",
              })}
            />
            {errors.year && (
              <p className="error">
                {errors.year.message}
              </p>
            )}
          </div>

          <div>
            <input
              className="input-field"
              placeholder="Skills"
              {...register("skills", {
                required: "Skills are required",
              })}
            />
            {errors.skills && (
              <p className="error">
                {errors.skills.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Recruiter Fields */}
      {role === "recruiter" && (
        <div className="form-grid">
          <div>
            <input
              className="input-field"
              placeholder="Company Name"
              {...register("companyName", {
                required: "Company Name is required",
              })}
            />
            {errors.companyName && (
              <p className="error">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div>
            <input
              className="input-field"
              placeholder="Designation"
              {...register("designation", {
                required: "Designation is required",
              })}
            />
            {errors.designation && (
              <p className="error">
                {errors.designation.message}
              </p>
            )}
          </div>

          <div style={{ gridColumn: "1 / 3" }}>
            <input
              className="input-field"
              placeholder="Company Website"
              {...register("companyWebsite")}
            />
          </div>
        </div>
      )}

      <button className="signup-btn" type="submit">
        Signup
      </button>

    <p className="auth-switch">
  Already have an account? <Link to="/login">Log in</Link>
    </p>
    </form>
    </div>
  );
};

export default Signup;