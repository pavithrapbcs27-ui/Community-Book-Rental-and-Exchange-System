import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Transactions() {
  const navigate = useNavigate();
  const location = useLocation();
  const book = location.state?.book;
  const userEmail = localStorage.getItem("userEmail");

  const [owner, setOwner] = useState({});
  const [renter, setRenter] = useState({});
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!book) {
      navigate("/user/dashboard");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Fetch renter (logged-in user)
        const renterRes = await axios.get(`http://localhost:5000/api/users/${userEmail}`);
        setRenter(renterRes.data);

        // Fetch owner (admin or regular user)
        // Fetch owner (admin or regular user)
let ownerRes;
if (book.ownerEmail === "admin@gmail.com") {
  ownerRes = await axios.get(`http://localhost:5000/api/admin/details/${book.ownerEmail}`);
} else {
  ownerRes = await axios.get(`http://localhost:5000/api/users/${book.ownerEmail}`);
}


        setOwner(ownerRes.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Failed to fetch user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [book, navigate, userEmail]);

  const handlePayment = async () => {
    if (!renter.upi) {
      return alert("Your UPI ID is missing! Please update your profile.");
    }
    if (!owner.upi) {
      return alert("Owner UPI ID is missing! Cannot proceed with payment.");
    }

    try {
      setPaymentLoading(true);

      const startDate = new Date();
      const endDate = new Date(startDate);

      if (book.rentalDuration) {
        const dur = book.rentalDuration.toLowerCase();
        if (dur.includes("month")) endDate.setMonth(endDate.getMonth() + 1);
        else if (dur.includes("year")) endDate.setFullYear(endDate.getFullYear() + 1);
        else if (dur.includes("week")) endDate.setDate(endDate.getDate() + 7);
        else endDate.setDate(endDate.getDate() + 30);
      }

      await axios.post("http://localhost:5000/api/rentals/create", {
        bookId: book._id,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookPrice: book.price,
        bookQuality: book.quality || "N/A",
        rentalDuration: book.rentalDuration,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ownerEmail: owner.email,
        ownerName: owner.name,
        ownerDept: owner.department || "N/A",
        ownerYear: owner.year || "N/A",
        ownerSection: owner.section || "N/A",
        ownerUPI: owner.upi,
        renterEmail: renter.email,
        renterName: renter.name,
        renterDept: renter.department || "N/A",
        renterYear: renter.year || "N/A",
        renterSection: renter.section || "N/A",
        renterUPI: renter.upi,
        upi: renter.upi
      });

      alert("✅ Transaction successful!");
      navigate("/user/dashboard");
    } catch (err) {
      console.error("Payment failed:", err.response?.data || err.message);
      alert(`❌ Payment failed: ${err.response?.data?.message || "Try again."}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading transaction details...</div>;
  }

  if (!book) return null;

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h2>📖 Confirm Transaction</h2>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        <Card title="Book Details">
          <p><strong>Title:</strong> {book.title}</p>
          <p><strong>Author:</strong> {book.author}</p>
          {book.mode === "rental" && <p><strong>Rental Duration:</strong> {book.rentalDuration}</p>}
          <p><strong>Price:</strong> ₹{book.price}</p>
          <p><strong>Quality:</strong> {book.quality || "N/A"}</p>
        </Card>

        <Card title="Owner Details">
          <p><strong>Name:</strong> {owner.name || "N/A"}</p>
          <p><strong>Email:</strong> {owner.email}</p>
          <p><strong>UPI:</strong> {owner.upi || "N/A"}</p>
          <p><strong>Dept:</strong> {owner.department || "N/A"}</p>
          <p><strong>Year:</strong> {owner.year || "N/A"}</p>
          <p><strong>Section:</strong> {owner.section || "N/A"}</p>
        </Card>

        <Card title="Your Details">
          <p><strong>Name:</strong> {renter.name || "N/A"}</p>
          <p><strong>Email:</strong> {renter.email}</p>
          <p><strong>UPI:</strong> {renter.upi || "N/A"}</p>
          <p><strong>Dept:</strong> {renter.department || "N/A"}</p>
          <p><strong>Year:</strong> {renter.year || "N/A"}</p>
          <p><strong>Section:</strong> {renter.section || "N/A"}</p>
        </Card>
      </div>

      <Card title="💳 Payment Details">
        <p><strong>From (Your UPI):</strong> {renter.upi}</p>
        <p><strong>To (Owner UPI):</strong> {owner.upi}</p>
        <p><strong>Amount:</strong> ₹{book.price}</p>
      </Card>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handlePayment} style={payBtn} disabled={paymentLoading}>
          {paymentLoading ? "Processing..." : "Confirm Payment"}
        </button>
        <button onClick={() => navigate("/user/dashboard")} style={cancelBtn}>Cancel</button>
      </div>
    </div>
  );
}

// Reusable card component
const Card = ({ title, children }) => (
  <div style={{
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    flex: 1,
    minWidth: "250px"
  }}>
    <h4>{title}</h4>
    {children}
  </div>
);

const payBtn = {
  padding: "10px 20px",
  backgroundColor: "#00aaff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "10px"
};

const cancelBtn = {
  padding: "10px 20px",
  backgroundColor: "#888",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
