import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../recruitCompStyle/ManageInterviews.css";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";

const ManageInterviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // editing state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [editError, setEditError] = useState("");

  // deleting state
  const [deletingId, setDeletingId] = useState(null); // id pending confirmation
  const [removingId, setRemovingId] = useState(null); // id currently being deleted (API in flight)
  const [deleteError, setDeleteError] = useState("");

  const fetchInterviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/recruiter/interviews");
      setInterviews(res.data.data.interviews);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load your interviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // ---------- EDIT ----------
  const startEdit = (e, interview) => {
    e.stopPropagation();
    setEditingId(interview.interviewId);
    setEditError("");
    setExpandedId(interview.interviewId);
    setEditForm({
      title: interview.title || "",
      company: interview.company || "",
      jobRole: interview.jobRole || "",
      skills: Array.isArray(interview.skills)
        ? interview.skills.join(", ")
        : interview.skills || "",
      questions: interview.questions ?? "",
      duration: interview.duration ?? "",
    });
  };

  const cancelEdit = (e) => {
    e?.stopPropagation();
    setEditingId(null);
    setEditForm(null);
    setEditError("");
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (e, interviewId) => {
    e.stopPropagation();
    setSavingId(interviewId);
    setEditError("");
    try {
      const payload = {
        title: editForm.title,
        company: editForm.company,
        jobRole: editForm.jobRole,
        skills: editForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        questions: editForm.questions === "" ? undefined : Number(editForm.questions),
        duration: editForm.duration === "" ? undefined : Number(editForm.duration),
      };

      const res = await api.patch(
        `/auth/recruiter/interviews/${interviewId}`,
        payload
      );
      const updated = res.data.data.interview;

      setInterviews((prev) =>
        prev.map((i) =>
          i.interviewId === interviewId
            ? {
                ...i,
                title: updated.title,
                company: updated.company,
                jobRole: updated.jobRole,
                skills: updated.skills,
                questions: updated.questions,
                duration: updated.duration,
              }
            : i
        )
      );

      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      setEditError(
        err.response?.data?.message || "Failed to update the interview."
      );
    } finally {
      setSavingId(null);
    }
  };

  // ---------- DELETE ----------
  const askDelete = (e, interviewId) => {
    e.stopPropagation();
    setDeletingId(interviewId);
    setDeleteError("");
  };

  const cancelDelete = (e) => {
    e?.stopPropagation();
    setDeletingId(null);
    setDeleteError("");
  };

  const confirmDelete = async (e, interviewId) => {
    e.stopPropagation();
    setRemovingId(interviewId);
    setDeleteError("");
    try {
      await api.delete(`/auth/recruiter/interviews/${interviewId}`);
      setInterviews((prev) =>
        prev.filter((i) => i.interviewId !== interviewId)
      );
      if (expandedId === interviewId) setExpandedId(null);
      setDeletingId(null);
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Failed to delete the interview."
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="manage-interviews">
        <h1>Manage Interviews</h1>
        <p>Loading your interviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-interviews">
        <h1>Manage Interviews</h1>
        <p className="dashboard-error">{error}</p>
        <button onClick={fetchInterviews}>Retry</button>
      </div>
    );
  }

  return (
    <div className="manage-interviews">
      <div className="manage-header">
        <div>
          <h1>Manage Interviews</h1>
          <p>All interviews you've created, with candidate progress.</p>
        </div>
        <button className="primaryBtn" onClick={() => navigate("../create-interview")}>
          + Create Interview
        </button>
      </div>

      {interviews.length === 0 ? (
        <div className="empty-state-box">
          <p>You haven't created any interviews yet.</p>
          <button className="primaryBtn" onClick={() => navigate("../create-interview")}>
            Create your first interview
          </button>
        </div>
      ) : (
        <div className="interview-list">
          {interviews.map((i) => {
            const isEditing = editingId === i.interviewId;
            const isConfirmingDelete = deletingId === i.interviewId;
            const isRemoving = removingId === i.interviewId;

            return (
              <div className="interview-item" key={i.interviewId}>
                <div
                  className="interview-item-header"
                  onClick={() => toggleExpand(i.interviewId)}
                >
                  <div>
                    <h3>{i.title}</h3>
                    <span className="muted">
                      {i.company} · {i.jobRole}
                    </span>
                  </div>

                  <div className="interview-item-meta">
                    <span className="meta-pill">{i.total} assigned</span>
                    <span className="meta-pill completed">{i.completed} completed</span>
                    <span className="meta-pill pending">{i.pending} pending</span>

                    <button
                      type="button"
                      className="iconBtn"
                      title="Edit interview"
                      onClick={(e) => startEdit(e, i)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="iconBtn iconBtnDanger"
                      title="Delete interview"
                      onClick={(e) => askDelete(e, i.interviewId)}
                    >
                      <Trash2 size={16} />
                    </button>

                    <span className="expand-arrow">
                      {expandedId === i.interviewId ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </span>
                  </div>
                </div>

                {isConfirmingDelete && (
                  <div className="confirm-delete-bar" onClick={(e) => e.stopPropagation()}>
                    <p>
                      Delete <strong>{i.title}</strong>? This removes it and every
                      candidate assignment/session tied to it. This can't be undone.
                    </p>
                    {deleteError && <p className="dashboard-error">{deleteError}</p>}
                    <div className="confirm-delete-actions">
                      <button
                        type="button"
                        className="dangerBtn"
                        disabled={isRemoving}
                        onClick={(e) => confirmDelete(e, i.interviewId)}
                      >
                        {isRemoving ? "Deleting..." : "Yes, delete"}
                      </button>
                      <button type="button" onClick={cancelDelete} disabled={isRemoving}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {expandedId === i.interviewId && (
                  <div className="interview-item-body">
                    {isEditing ? (
                      <div className="edit-interview-form" onClick={(e) => e.stopPropagation()}>
                        <div className="edit-grid">
                          <label>
                            Title
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => handleEditChange("title", e.target.value)}
                            />
                          </label>
                          <label>
                            Company
                            <input
                              type="text"
                              value={editForm.company}
                              onChange={(e) => handleEditChange("company", e.target.value)}
                            />
                          </label>
                          <label>
                            Job Role
                            <input
                              type="text"
                              value={editForm.jobRole}
                              onChange={(e) => handleEditChange("jobRole", e.target.value)}
                            />
                          </label>
                          <label>
                            Questions
                            <input
                              type="number"
                              min="0"
                              value={editForm.questions}
                              onChange={(e) => handleEditChange("questions", e.target.value)}
                            />
                          </label>
                          <label>
                            Duration (mins)
                            <input
                              type="number"
                              min="0"
                              value={editForm.duration}
                              onChange={(e) => handleEditChange("duration", e.target.value)}
                            />
                          </label>
                          <label className="edit-skills">
                            Skills (comma separated)
                            <input
                              type="text"
                              value={editForm.skills}
                              onChange={(e) => handleEditChange("skills", e.target.value)}
                            />
                          </label>
                        </div>

                        {editError && <p className="dashboard-error">{editError}</p>}

                        <div className="edit-actions">
                          <button
                            type="button"
                            className="primaryBtn"
                            disabled={savingId === i.interviewId}
                            onClick={(e) => saveEdit(e, i.interviewId)}
                          >
                            {savingId === i.interviewId ? "Saving..." : "Save changes"}
                          </button>
                          <button type="button" onClick={cancelEdit} disabled={savingId === i.interviewId}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="interview-details">
                          <p>
                            <strong>Skills:</strong>{" "}
                            {Array.isArray(i.skills) ? i.skills.join(", ") : i.skills}
                          </p>
                          <p>
                            <strong>Questions:</strong> {i.questions || "—"} &nbsp;|&nbsp;
                            <strong> Duration:</strong> {i.duration || "—"} mins
                          </p>
                          <p>
                            <strong>Created:</strong>{" "}
                            {new Date(i.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <table className="mini-table">
                          <thead>
                            <tr>
                              <th>Candidate</th>
                              <th>Email</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {i.candidates.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="muted">
                                  No candidate assigned yet.
                                </td>
                              </tr>
                            ) : (
                              i.candidates.map((c, idx) => (
                                <tr key={idx}>
                                  <td>{c.name}</td>
                                  <td>{c.email}</td>
                                  <td>
                                    <span className={`status-tag ${c.status}`}>
                                      {c.status}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageInterviews;