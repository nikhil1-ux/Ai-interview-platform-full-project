import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios.js';



const AssignedInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get("/auth/my-interviews");

        setInterviews(res.data.data.assignments);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInterviews();
  }, []);

    const startInterview = async (id) => {
    try {
      const res = await api.post(`/auth/assignment/${id}/start`);

      const sessionId = res.data.data.sessionId;

      navigate(`/interview/${sessionId}`);
    } catch (error) {
      console.log(error);
    }
  };

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

            <button onClick={()=>{startInterview(item._id )}}>
              {item.status === "assigned" ? "Start Interview" : "Continue"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AssignedInterview;