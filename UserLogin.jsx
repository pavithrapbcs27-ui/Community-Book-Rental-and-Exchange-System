import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
      console.log("Login response:", res.data); // debug
      localStorage.setItem("userEmail", res.data.email); 
      localStorage.setItem("userRole", "user");
      navigate("/user/dashboard");
    } catch(err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>User Login</h2>

      <input 
        placeholder="Email" 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        required 
      />

      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        required 
      />

      <button type="submit">Login</button>

      <p>
        Don't have an account?{" "}
        <span 
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/user/register")}
        >
          Register
        </span>
      </p>
    </form>
  );
}
