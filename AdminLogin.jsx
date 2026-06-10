import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/index.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", { email, password });
      localStorage.setItem("adminEmail", res.data.email);
      localStorage.setItem("userRole", "admin");
      navigate("/admin/dashboard");
    } catch(err) {
      alert(err.response?.data?.error || "Admin login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="login">
      <h2>Admin Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
