import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../candidComp.style/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
      setName(res.data.data.name);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setMessage({ type: "", text: "" });
    setName(user?.name || "");
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: "error", text: "Name cannot be empty." });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await api.patch("/auth/update-profile", { name: name.trim() });
      setUser(res.data.data);
      setIsEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h1>👤 Profile</h1>
        <p className="profile-skeleton">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>👤 Profile</h1>
        <div className="profile-card">
          <p className="profile-message error">{error}</p>
          <div className="profile-actions">
            <button className="btn-primary" onClick={fetchProfile}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = (user?.name || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "—";

  return (
    <div className="page">
      <h1>👤 Profile</h1>

      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>

        <div className="profile-field">
          <label>Name</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
          ) : (
            <p>{user?.name}</p>
          )}
        </div>

        <div className="profile-field">
          <label>Email</label>
          <p>{user?.email}</p>
        </div>

        <div className="profile-field">
          <label>Role</label>
          <span className="profile-badge">{user?.role}</span>
        </div>

        <div className="profile-field">
          <label>Resume</label>
          <p>{user?.resumeUrl ? "Uploaded ✅" : "Not uploaded yet"}</p>
        </div>

        <div className="profile-field">
          <label>Member Since</label>
          <p>{memberSince}</p>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="btn-secondary" onClick={handleEditToggle} disabled={saving}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={handleEditToggle}>
              Edit Profile
            </button>
          )}
        </div>

        {message.text && (
          <p className={`profile-message ${message.type}`}>{message.text}</p>
        )}
      </div>
    </div>
  );
};

export default Profile;