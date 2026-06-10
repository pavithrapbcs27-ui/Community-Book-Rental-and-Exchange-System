import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/index.css";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!email) return navigate("/user/login");

    axios.get(`http://localhost:5000/api/users/${email}`)
      .then(res => setForm(res.data))
      .catch(err => alert("Failed to fetch user data"));
  }, [email, navigate]);

  if (!form) return <p>Loading profile...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!/^[A-Z][a-zA-Z\s]*$/.test(form.name)) {
      alert("Name must start with a capital letter!");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone number must be 10 digits!");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${email}`, {
        name: form.name,
        department: form.department,
        year: form.year,
        section: form.section,
        phone: form.phone
      });
      alert("Profile updated successfully!");
      navigate("/user/profile");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <div className="profile-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <button onClick={() => navigate("/user/dashboard")}>Home</button>
        <button onClick={() => navigate("/user/profile")}>Back to Profile</button>
        <button onClick={() => {
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userRole");
          navigate("/user/login");
        }}>Logout</button>
      </div>

      {/* Update Form */}
      <form onSubmit={handleSubmit} className="profile-card">
        <h2>Update Profile</h2>

        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          placeholder="Phone Number"
          value={form.phone || ""}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          required
        />

        <select
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
          required
        >
          <option value="">Select Department</option>
          <option>CSE</option><option>IT</option><option>ECE</option>
          <option>EEE</option><option>MCA</option><option>MBA</option>
          <option>Biotech</option><option>BME</option><option>BCE</option>
        </select>

        <select
          value={form.year}
          onChange={e => setForm({ ...form, year: e.target.value })}
          required
        >
          <option value="">Year</option>
          <option>1</option><option>2</option><option>3</option><option>4</option>
        </select>

        <select
          value={form.section}
          onChange={e => setForm({ ...form, section: e.target.value })}
          required
        >
          <option value="">Section</option>
          <option>A</option><option>B</option><option>C</option>
        </select>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button type="submit" style={{ backgroundColor: "#00aaff", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}>Update</button>
          <button
            type="button"
            onClick={() => navigate("/user/profile")}
            style={{ backgroundColor: "#888", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
