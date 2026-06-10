import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RentedBooks() {
  const userEmail = localStorage.getItem("userEmail");
  const [rentedBooks, setRentedBooks] = useState([]);

  useEffect(() => {
    const fetchRentedBooks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/rentals/rented/${userEmail}`
        );
        setRentedBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch rented books:", err);
      }
    };
    fetchRentedBooks();
  }, [userEmail]);

  const cardStyle = {
    width: "280px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    margin: "10px",
    backgroundColor: "#fff",
    boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📘 Rented Books</h2>
      {rentedBooks.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          {rentedBooks.map((item) => (
            <div key={item.book?._id} style={cardStyle}>
              <h3>{item.book?.title}</h3>
              <p>Author: {item.book?.author}</p>
              <p>Quality: {item.book?.quality}</p>
              <p>Mode: {item.book?.mode}</p>
              <p>Price: ₹{item.book?.price}</p>
              <p>Status: <b style={{ color: "red" }}>Rented</b></p>

              <hr />
              <h4>Rented To:</h4>
              <p><b>Name:</b> {item.rental?.renterName}</p>
              <p><b>Email:</b> {item.rental?.renterEmail}</p>
              <p><b>Duration:</b> {item.rental?.rentalDuration}</p>
              <p><b>Start:</b> {new Date(item.rental?.startDate).toLocaleDateString()}</p>
              <p><b>End:</b> {new Date(item.rental?.endDate).toLocaleDateString()}</p>
              <p><b>Status:</b> {item.rental?.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No rented books found.</p>
      )}
    </div>
  );
}
