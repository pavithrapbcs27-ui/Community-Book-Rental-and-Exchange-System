import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/index.css";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-hero">
      <div className="overlay">
        <h1 className="title">
          Welcome to <span>BookVerse</span>
        </h1>
        <p className="subtitle">
          Connect, Rent, and Exchange books with your community.
        </p>
        <div className="buttons">
          <button className="btn user-btn" onClick={() => navigate("/user/login")}>
            User
          </button>
          <button className="btn admin-btn" onClick={() => navigate("/admin/login")}>
            Admin
          </button>
        </div>
      </div>
    </div>
  );
}
