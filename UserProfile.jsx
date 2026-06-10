import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/index.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!email) return navigate("/user/login");

    axios
      .get(`http://localhost:5000/api/users/${email}`)
      .then((res) => setUser(res.data))
      .catch((err) => alert("Failed to fetch user profile"));
  }, [email, navigate]);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <button onClick={() => navigate("/user/dashboard")}>Home</button>
        <button
          onClick={() => {
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userRole");
            navigate("/user/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-header">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        <div className="profile-details">
          <p><strong>UPI:</strong> {user.upi || "N/A"}</p>
          <p><strong>Gender:</strong> {user.gender || "N/A"}</p>
          <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
          <p><strong>Department:</strong> {user.department || "N/A"}</p>
          <p><strong>Year:</strong> {user.year || "N/A"}</p>
          <p><strong>Section:</strong> {user.section || "N/A"}</p>
        </div>

        <div className="profile-actions">
          <button
            className="edit-btn"
            onClick={() => navigate("/user/profile/update")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
