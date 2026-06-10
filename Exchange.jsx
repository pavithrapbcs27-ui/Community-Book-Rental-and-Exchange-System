import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Exchange() {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedBook = location.state?.requestedBook;
  const userEmail = (localStorage.getItem("userEmail") || "").trim();

  const [myBooks, setMyBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [senderDetails, setSenderDetails] = useState({});
  const [receiverDetails, setReceiverDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch sender details
  useEffect(() => {
    if (!userEmail) return;
    axios
      .get(`http://localhost:5000/api/users/${userEmail}`)
      .then((res) => setSenderDetails(res.data))
      .catch((err) => console.error("Error fetching sender:", err));
  }, [userEmail]);

  // Fetch receiver details
  useEffect(() => {
    if (!requestedBook) return;
    const fetchReceiver = async () => {
      try {
        if (!requestedBook.ownerName) {
          const res = await axios.get(
            `http://localhost:5000/api/users/${requestedBook.ownerEmail}`
          );
          setReceiverDetails({
            name: res.data.name || "N/A",
            email: requestedBook.ownerEmail,
            department: res.data.department || "N/A",
            phone: res.data.phone || "N/A",
            year: res.data.year || "N/A",
            section: res.data.section || "N/A",
          });
        } else {
          setReceiverDetails({
            name: requestedBook.ownerName,
            email: requestedBook.ownerEmail,
            department: requestedBook.ownerDept || "N/A",
            phone: requestedBook.ownerPhone || "N/A",
            year: requestedBook.ownerYear || "N/A",
            section: requestedBook.ownerSection || "N/A",
          });
        }
      } catch (err) {
        console.error("Error fetching receiver:", err);
      }
    };
    fetchReceiver();
  }, [requestedBook]);

  // Fetch user's books for exchange
  useEffect(() => {
    if (!userEmail) return;
    const fetchMyBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books");
        const exchangeBooks = res.data.filter(
          (b) =>
            b.ownerEmail.toLowerCase() === userEmail.toLowerCase() &&
            b.mode === "exchange" &&
            b.isAvailable
        );
        setMyBooks(exchangeBooks);
        if (exchangeBooks.length === 1) setSelectedBook(exchangeBooks[0]);
      } catch (err) {
        console.error("Error fetching your books:", err);
      }
    };
    fetchMyBooks();
  }, [userEmail]);

  const handleSendRequest = async () => {
    if (!selectedBook) return alert("Select a book to exchange!");
    setErrorMessage(""); // reset previous errors

    const data = {
      sender: {
        email: userEmail,
        name: senderDetails.name || "N/A",
        department: senderDetails.department || "N/A",
        phone: senderDetails.phone || "N/A",
        year: senderDetails.year || "N/A",
        class: senderDetails.section || "N/A",
        book: {
          id: selectedBook._id,
          title: selectedBook.title,
          author: selectedBook.author,
          quality: selectedBook.quality,
        },
      },
      receiver: {
        email: receiverDetails.email,
        name: receiverDetails.name,
        department: receiverDetails.department,
        phone: receiverDetails.phone,
        year: receiverDetails.year,
        class: receiverDetails.section,
        book: {
          id: requestedBook._id,
          title: requestedBook.title,
          author: requestedBook.author,
          quality: requestedBook.quality,
        },
      },
      status: "pending",
      createdAt: new Date(),
    };

    try {
      await axios.post("http://localhost:5000/api/exchanges", data);
      alert("Exchange request sent successfully!");
      navigate("/user/dashboard");
    } catch (err) {
      console.error("Error sending request:", err);

      // 🧩 Display meaningful backend error message if available
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else if (err.code === "ERR_NETWORK") {
        setErrorMessage("Network error. Please check your server connection.");
      } else {
        setErrorMessage("Unexpected error. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setSelectedBook(null);
    setErrorMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔄 Exchange Book</h2>

      {/* Requested Book & Owner */}
      {requestedBook && (
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
          <div style={{ border: "1px solid #ccc", padding: "10px", flex: 1 }}>
            <h4>Requested Book</h4>
            <p>ID: {requestedBook._id}</p>
            <p>Title: {requestedBook.title}</p>
            <p>Author: {requestedBook.author}</p>
            <p>Quality: {requestedBook.quality}</p>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "10px", flex: 1 }}>
            <h4>Owner Details</h4>
            <p>Name: {receiverDetails.name || "N/A"}</p>
            <p>Email: {receiverDetails.email || "N/A"}</p>
            <p>Dept: {receiverDetails.department || "N/A"}</p>
            <p>Phone: {receiverDetails.phone || "N/A"}</p>
            <p>Year: {receiverDetails.year || "N/A"}</p>
            <p>Class: {receiverDetails.section || "N/A"}</p>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "10px", flex: 1 }}>
            <h4>Your Details</h4>
            <p>Name: {senderDetails.name || "N/A"}</p>
            <p>Email: {userEmail}</p>
            <p>Dept: {senderDetails.department || "N/A"}</p>
            <p>Phone: {senderDetails.phone || "N/A"}</p>
            <p>Year: {senderDetails.year || "N/A"}</p>
            <p>Class: {senderDetails.section || "N/A"}</p>
          </div>
        </div>
      )}

      {/* Combo Box: User's exchange books */}
      <h3>Select Your Book to Offer:</h3>
      {myBooks.length > 0 ? (
        <>
          <select
            value={selectedBook?._id || ""}
            onChange={(e) => {
              const book = myBooks.find((b) => b._id === e.target.value);
              setSelectedBook(book);
              setErrorMessage("");
            }}
            style={{ padding: "8px", borderRadius: "5px", minWidth: "250px" }}
          >
            <option value="" disabled>
              -- Select your book --
            </option>
            {myBooks.map((b) => (
              <option key={b._id} value={b._id}>
                {b.title} ({b.quality})
              </option>
            ))}
          </select>

          {/* Show selected book details */}
          {selectedBook && (
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                border: "1px solid #ccc",
                width: "fit-content",
                borderRadius: "5px",
              }}
            >
              <h4>Selected Book Details:</h4>
              <p>ID: {selectedBook._id}</p>
              <p>Title: {selectedBook.title}</p>
              <p>Author: {selectedBook.author}</p>
              <p>Quality: {selectedBook.quality}</p>
            </div>
          )}
        </>
      ) : (
        <p style={{ color: "red" }}>You have no books for exchange.</p>
      )}

      {/* 🧩 Error Message */}
      {errorMessage && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#ffe0e0",
            color: "red",
            border: "1px solid red",
            borderRadius: "5px",
            maxWidth: "600px",
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Buttons */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={handleSendRequest}
          disabled={!selectedBook}
          style={{
            padding: "10px 20px",
            backgroundColor: !selectedBook ? "#ccc" : "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: !selectedBook ? "not-allowed" : "pointer",
          }}
        >
          Send Exchange Request
        </button>

        <button
          onClick={handleCancel}
          disabled={!selectedBook}
          style={{
            padding: "10px 20px",
            backgroundColor: !selectedBook ? "#ccc" : "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: !selectedBook ? "not-allowed" : "pointer",
          }}
        >
          Cancel
        </button>

        <button
          onClick={() => navigate("/user/dashboard")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#555",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
