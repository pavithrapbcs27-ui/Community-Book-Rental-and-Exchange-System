import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import navigation hook
import axios from "axios";

export default function MyRentals() {
  const navigate = useNavigate(); // 👈 for navigation
  const userEmail = localStorage.getItem("userEmail");
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/rentals/user/${userEmail}`
        );
        setRentals(res.data);
      } catch (err) {
        console.error("Failed to fetch rentals:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchRentals();
  }, [userEmail]);

  if (loading) return <p>Loading your rentals...</p>;

  if (rentals.length === 0)
    return (
      <div style={{ padding: "20px" }}>
        <button
          onClick={() => navigate("/user-dashboard")}
          style={{
            marginBottom: "15px",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <p style={{ color: "red" }}>No rental books found.</p>
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔙 Back button */}
      <button
        onClick={() => navigate("/user/dashboard")}
        style={{
          marginBottom: "15px",
          padding: "8px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h2>📚 My Rental Books</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {rentals.map((r) => (
          <div
            key={r._id}
            style={{
              flex: "0 0 300px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{r.bookTitle}</h3>
            <p>Author: {r.bookAuthor}</p>
            {r.bookPrice && <p>Price: ₹{r.bookPrice}</p>}
            {r.rentalDuration && <p>Duration: {r.rentalDuration}</p>}
            {r.startDate && r.endDate && (
              <p>
                From: {new Date(r.startDate).toLocaleDateString()} To:{" "}
                {new Date(r.endDate).toLocaleDateString()}
              </p>
            )}
            <p>Quality: {r.quality || "N/A"}</p>
            <hr />
            <h4>Owner Details</h4>
            <p>Name: {r.ownerName}</p>
            <p>Email: {r.ownerEmail}</p>
            <p>Department: {r.ownerDept}</p>
            <p>
              Year: {r.ownerYear} | Class: {r.ownerSection}
            </p>
            <p>UPI: {r.ownerUPI}</p>
            <hr />
            <h4>Your Details</h4>
            <p>Name: {r.renterName}</p>
            <p>Email: {r.renterEmail}</p>
            <p>Department: {r.renterDept}</p>
            <p>
              Year: {r.renterYear} | Class: {r.renterSection}
            </p>
            <p>UPI: {r.renterUPI}</p>
            <hr />
            <p>Payment Mode: {r.paymentMode}</p>
            {r.paymentMode === "UPI" && <p>UPI ID: {r.upi}</p>}
            <p>Status: {r.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
