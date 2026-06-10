import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books");

        // ✅ Show all books belonging to the logged-in user, regardless of availability
        const myBooks = res.data.filter((b) => b.ownerEmail === userEmail);
        setBooks(myBooks);
      } catch (err) {
        console.error("Failed to fetch my books:", err);
      }
    };
    fetchMyBooks();
  }, [userEmail]);

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    padding: "20px",
  };

  const cardStyle = {
    display: "inline-block",
    width: "250px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  };

  const statusStyle = (isAvailable) => ({
    color: isAvailable ? "green" : "red",
    fontWeight: "bold",
  });

  return (
    <div>
      <h2 style={{ marginLeft: "20px" }}>📚 My Uploaded Books</h2>

      {books.length > 0 ? (
        <div style={containerStyle}>
          {books.map((b) => (
            <div key={b._id} style={cardStyle}>
              <h3>{b.title}</h3>
              <p>Author: {b.author}</p>
              <p>Quality: {b.quality}</p>
              <p>Mode: {b.mode}</p>

              {b.mode === "rental" && (
                <>
                  <p>
                    Rental Duration:{" "}
                    {b.rentalDuration ? b.rentalDuration : "Not specified"}
                  </p>
                  <p>Price: ₹{b.price}</p>
                </>
              )}

              <p>
                Status:{" "}
                <span style={statusStyle(b.isAvailable)}>
                  {b.isAvailable ? "Available" : "Not Available"}
                </span>
              </p>

              {/* ✅ Extra detail: show who you exchanged/rented it to when not available */}
              {!b.isAvailable && b.mode === "exchange" && (
                <p style={{ color: "gray" }}>
                  (This book is currently exchanged with another user)
                </p>
              )}
              {!b.isAvailable && b.mode === "rental" && (
                <p style={{ color: "gray" }}>
                  (This book is currently rented out)
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginLeft: "20px" }}>You haven’t added any books yet.</p>
      )}
    </div>
  );
}
