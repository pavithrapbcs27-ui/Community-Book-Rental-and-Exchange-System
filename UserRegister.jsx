import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/index.css";

export default function UserRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", upi: "", password: "", confirmpassword: "",
    gender: "", department: "", year: "", section: "", phone: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    if (!form.name || !form.email || !form.upi || !form.password || !form.confirmpassword ||
        !form.gender || !form.department || !form.year || !form.section || !form.phone) {
      alert("⚠️ Please fill all the fields!");
      return;
    }

    if (!/^[A-Z][a-zA-Z\s]*$/.test(form.name)) { alert("Name must start with a capital letter!"); return; }
    if (!form.email.endsWith("@gmail.com")) { alert("Email must end with @gmail.com!"); return; }
    if (!/^[\w.-]+@[\w]+$/.test(form.upi)) { alert("Enter a valid UPI ID!"); return; }
    if (form.password !== form.confirmpassword) { alert("Passwords do not match!"); return; }
    if (!/^\d{10}$/.test(form.phone)) { alert("Phone number must be 10 digits!"); return; }

    try {
      await axios.post("http://localhost:5000/api/users/register", form);
      alert("✅ User registered successfully!");
      navigate("/user/login");
    } catch (err) {
      alert(err.response?.data?.error || "❌ Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register">
      <h2>User Registration</h2>
      <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
      <input placeholder="Email ID" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
      <input placeholder="UPI ID (example@bank)" value={form.upi} onChange={e => setForm({...form, upi: e.target.value})} required />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
      <input type="password" placeholder="Confirm Password" value={form.confirmpassword} onChange={e => setForm({...form, confirmpassword: e.target.value})} required />
      <input type="text" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />

      <div className="gender">
        Gender:
        <label><input type="radio" name="gender" value="Male" checked={form.gender==="Male"} onChange={e=>setForm({...form, gender:e.target.value})}/> Male</label>
        <label><input type="radio" name="gender" value="Female" checked={form.gender==="Female"} onChange={e=>setForm({...form, gender:e.target.value})}/> Female</label>
      </div>

      <select value={form.department} onChange={e=>setForm({...form, department:e.target.value})} required>
        <option value="">Select Department</option>
        <option>CSE</option><option>IT</option><option>ECE</option><option>EEE</option>
        <option>MCA</option><option>MBA</option><option>Biotech</option><option>BME</option><option>BCE</option>
      </select>

      <select value={form.year} onChange={e=>setForm({...form, year:e.target.value})} required>
        <option value="">Select Year</option><option>1</option><option>2</option><option>3</option><option>4</option>
      </select>

      <select value={form.section} onChange={e=>setForm({...form, section:e.target.value})} required>
        <option value="">Select Section</option><option>A</option><option>B</option><option>C</option>
      </select>

      <button type="submit">Register</button>
      <p>Already have an account? <span className="login-link" onClick={()=>navigate("/user/login")}>Login</span></p>
    </form>
  );
}
