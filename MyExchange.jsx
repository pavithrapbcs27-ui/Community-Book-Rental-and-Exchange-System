import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyExchange() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/exchanges/user/${userEmail}`
        );

        // ✅ Filter only completed exchanges involving the current user
        const completedExchanges = res.data.filter(
          (ex) =>
            ex.status === "Completed" &&
            (ex.sender.email === userEmail || ex.receiver.email === userEmail)
        );

        setExchanges(completedExchanges);
      } catch (err) {
        console.error("Failed to fetch exchanges:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchExchanges();
  }, [userEmail]);

  if (loading) return <p>Loading your exchange records...</p>;

  if (exchanges.length === 0)
    return (
      <div style={{ padding: "20px" }}>
        <button onClick={() => navigate("/user/dashboard")} style={backBtnStyle}>
          ← Back
        </button>
        <p style={{ color: "red", marginTop: "10px" }}>
          No completed exchanges found.
        </p>
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔙 Back to dashboard button */}
      <button onClick={() => navigate("/user/dashboard")} style={backBtnStyle}>
        ← Back
      </button>

      <h2>🔄 My Completed Exchange Books</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {exchanges.map((ex) => {
          const isSender = ex.sender.email === userEmail;
          const myBook = isSender ? ex.sender.book : ex.receiver.book;
          const otherUser = isSender ? ex.receiver : ex.sender;
          const requestedBook = isSender ? ex.receiver.book : ex.sender.book;

          return (
            <div
              key={ex._id}
              style={{
                flex: "0 0 350px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h4>📘 My Book: {myBook.title} ({myBook.quality})</h4>
              <p>Author: {myBook.author}</p>

              <h4>👤 Exchanged With: {otherUser.name}</h4>
              <p>Email: {otherUser.email}</p>
              {otherUser.department && <p>Department: {otherUser.department}</p>}
              {otherUser.year && otherUser.class && (
                <p>
                  Year: {otherUser.year} | Class: {otherUser.class}
                </p>
              )}

              <h4>📗 Received/Requested Book: {requestedBook.title}</h4>
              <p>Author: {requestedBook.author}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: "green" }}>{ex.status}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const backBtnStyle = {
  marginBottom: "15px",
  padding: "8px 16px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
