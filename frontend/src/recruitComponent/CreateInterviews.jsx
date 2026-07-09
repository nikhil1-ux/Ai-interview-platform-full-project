import React from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios.js";
import "../recruitCompStyle/CreateInterview.css"
import toast from "react-hot-toast";

const CreateInterview = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

const onSubmit = async (data) => {
  try {
   
    toast.success(response.data.message || "Interview Created Successfully!");
    
    const response = await api.post(
      "/auth/create",
      data
    );
    
    
    reset();
  } 
  catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to create interview."
    );
  }
};

  return (
    <div className="createInterview">
      <h2>Create Interview</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Interview Title */}
        <div className="formGroup">
          <label htmlFor="title">Interview Title</label>
          <input
            id="title"
            type="text"
            placeholder="Frontend Developer Interview"
            {...register("title", {
              required: "Title is required",
            })}
          />
          <p>{errors.title?.message}</p>
        </div>

        {/* Company Name */}
        <div className="formGroup">
          <label htmlFor="company">Company Name</label>
          <input
            id="company"
            type="text"
            placeholder="Google"
            {...register("company", {
              required: "Company Name is required",
            })}
          />
          <p>{errors.company?.message}</p>
        </div>

        {/* Job Role */}
        <div className="formGroup">
          <label htmlFor="jobRole">Job Role</label>
          <input
            id="jobRole"
            type="text"
            placeholder="MERN Stack Developer"
            {...register("jobRole", {
              required: "Job role is required",
            })}
          />
          <p>{errors.jobRole?.message}</p>
        </div>

        {/* Job Description */}
        <div className="formGroup">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            placeholder="Enter complete job description..."
            {...register("description", {
              required: "Description is required",
            })}
          />
          <p>{errors.description?.message}</p>
        </div>

        {/* Skills */}
        <div className="formGroup">
          <label htmlFor="skills">Required Skills</label>
          <input
            id="skills"
            type="text"
            placeholder="React, Node.js, MongoDB"
            {...register("skills", {
              required: "Skills are required",
            })}
          />
          <p>{errors.skills?.message}</p>
        </div>

        {/* Questions */}
        <div className="formGroup">
          <label htmlFor="questions">Number of Questions</label>
          <input
            id="questions"
            type="number"
            placeholder="10"
            {...register("questions")}
          />
        </div>

        {/* Duration */}
        <div className="formGroup">
          <label htmlFor="duration">Duration (Minutes)</label>
          <input
            id="duration"
            type="number"
            placeholder="30"
            {...register("duration")}
          />
        </div>

        {/* Candidate Email */}
        <div className="formGroup">
          <label htmlFor="candidateEmail">Candidate Email</label>
          <input
            id="candidateEmail"
            type="email"
            placeholder="candidate@gmail.com"
            {...register("email", {
              required: "Email is required",
            })}
          />
          <p>{errors.email?.message}</p>
        </div>

        <button type="submit">
          Create Interview
        </button>
      </form>
    </div>
  );
};

export default CreateInterview;