import React, { useEffect, useState } from "react";
import api from "../api"; // your axios instance

const AssignedInterview = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get("/my-interviews");

        setInterviews(res.data.data.assignments);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="page">
      <h1>🎤 Assigned Interviews</h1>

      {interviews.length === 0 ? (
        <p>No interviews assigned yet</p>
      ) : (
        interviews.map((item) => (
          <div className="card" key={item._id}>
            <h3>{item.interviewId?.title}</h3>
            <p>Status: {item.status}</p>

            <button>
              {item.status === "assigned" ? "Start Interview" : "Continue"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AssignedInterview;