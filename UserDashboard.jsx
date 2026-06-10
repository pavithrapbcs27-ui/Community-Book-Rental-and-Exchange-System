import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddBook from "./AddBook";
import MyBooks from "./MyBooks";
import RentedBooks from "./RentedBooks";

import "../styles/index.css";

export default function UserDashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  // Sidebar dropdown states
  const [profileOpen, setProfileOpen] = useState(false);
  const [booksOpen, setBooksOpen] = useState(false);
  const [transactionsOpen, setTransactionsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Main states
  const [activeSection, setActiveSection] = useState("home");
  const [subSection, setSubSection] = useState("");
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [myTransactions, setMyTransactions] = useState([]);

  // Notifications states
  const [notificationType, setNotificationType] = useState(""); // "sent" or "received"
  const [sentExchanges, setSentExchanges] = useState([]);
  const [receivedExchanges, setReceivedExchanges] = useState([]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/user/login");
  };

  // Fetch all other users' books
  useEffect(() => {
    if (activeSection !== "home") return;
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books");
        const otherBooks = res.data.filter((b) => b.ownerEmail !== userEmail);
        setBooks(otherBooks);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };
    fetchBooks();
  }, [activeSection, userEmail]);

  // Fetch user's transactions
  useEffect(() => {
    if (activeSection !== "transactions") return;
    const fetchMyTransactions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/rentals/user/${userEmail}`
        );
        setMyTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch rentals:", err);
      }
    };
    fetchMyTransactions();
  }, [activeSection, subSection, userEmail]);

  // Fetch notifications
  useEffect(() => {
    if (!notificationsOpen) return;
    const fetchNotifications = async () => {
      try {
        const sentRes = await axios.get(
          `http://localhost:5000/api/exchanges/sent/${userEmail}`
        );
        setSentExchanges(sentRes.data);

        const receivedRes = await axios.get(
          `http://localhost:5000/api/exchanges/received/${userEmail}`
        );
        setReceivedExchanges(receivedRes.data);
      } catch (err) {
        console.error("Failed to fetch exchanges:", err);
      }
    };
    fetchNotifications();
  }, [notificationsOpen, userEmail]);

  // Filter books by search query
  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase())
  );

  // Navigate to exchange page
  const handleExchangeClick = (book) => {
    navigate("/user/exchange", { state: { requestedBook: book } });
  };

  // Styles
  const bookCardStyle = {
    flex: "0 0 250px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const buyButtonStyle = (disabled) => ({
    marginTop: "10px",
    padding: "8px",
    backgroundColor: disabled ? "#ccc" : "#4CAF50",
    color: disabled ? "#666" : "white",
    border: "none",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button
          onClick={() => {
            setActiveSection("home");
            setSubSection("");
            setNotificationType("");
          }}
        >
          Home
        </button>

        <p
          className="sidebar-section"
          onClick={() => setProfileOpen(!profileOpen)}
          style={{ cursor: "pointer" }}
        >
          My Profile {profileOpen ? "▲" : "▼"}
        </p>
        {profileOpen && (
          <div className="dropdown-buttons">
            <button onClick={() => navigate("/user/profile")}>
              View Profile
            </button>
            <button onClick={() => navigate("/user/profile/update")}>
              Update Profile
            </button>
          </div>
        )}

        <p
          className="sidebar-section"
          onClick={() => setBooksOpen(!booksOpen)}
          style={{ cursor: "pointer" }}
        >
          Books {booksOpen ? "▲" : "▼"}
        </p>
        {booksOpen && (
  <div className="dropdown-buttons">
    <button
      onClick={() => {
        setActiveSection("books");
        setSubSection("add");
        setNotificationType("");
      }}
    >
      Add Book
    </button>
    <button
      onClick={() => {
        setActiveSection("books");
        setSubSection("mybooks");
        setNotificationType("");
      }}
    >
      My Books
    </button>
    <button
      onClick={() => {
        setActiveSection("books");
        setSubSection("rented");
        setNotificationType("");
      }}
    >
      Rented Books
    </button>
  </div>
)}


        <p
          className="sidebar-section"
          onClick={() => setTransactionsOpen(!transactionsOpen)}
          style={{ cursor: "pointer" }}
        >
          Transactions {transactionsOpen ? "▲" : "▼"}
        </p>
        {transactionsOpen && (
          <div className="dropdown-buttons">
            
            <button onClick={() => navigate("/user/myrentals")}>
  My Rental Books
</button>
          
            <button onClick={() => navigate("/user/myexchange")}>
  My Exchange Books
</button>


          </div>
        )}

        <p
          className="sidebar-section"
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          style={{ cursor: "pointer" }}
        >
          Notifications {notificationsOpen ? "▲" : "▼"}
        </p>
        {notificationsOpen && (
          <div className="dropdown-buttons">
            <button onClick={() => setNotificationType("sent")}>Sent</button>
            <button onClick={() => setNotificationType("received")}>
              Received
            </button>
          </div>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Right-side content */}
      <div className="dashboard-content">
        {/* HOME Section */}
        {(!notificationsOpen || notificationType === "") &&
          activeSection === "home" && (
            <>
              <h2>📚 Other Users' Books</h2>
              <input
                type="text"
                placeholder="Search by title or author"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  width: "100%",
                  fontSize: "16px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />

              {/* Rental Books */}
              <h3>Rental Books</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                {filteredBooks.filter((b) => b.mode === "rental").length > 0 ? (
                  filteredBooks
                    .filter((b) => b.mode === "rental")
                    .map((b) => (
                      <div key={b._id} style={bookCardStyle}>
                        <div>
                          <h3>{b.title}</h3>
                          <p>Author: {b.author}</p>
                          <p>Price: ₹{b.price}</p>
                          <p>Rental Duration: {b.rentalDuration}</p>
                          <p>Quality: {b.quality}</p>
                          <p>Owner: {b.ownerEmail}</p>
                          {!b.isAvailable && (
                            <p style={{ color: "red", fontWeight: "bold" }}>
                              Not Available
                            </p>
                          )}
                        </div>
                        <button
                          style={buyButtonStyle(!b.isAvailable)}
                          onClick={() =>
                            navigate("/user/transactions", { state: { book: b } })
                          }
                          disabled={!b.isAvailable}
                        >
                          Rent
                        </button>
                      </div>
                    ))
                ) : (
                  <p>No rental books found.</p>
                )}
              </div>

              {/* Exchange Books */}
              <h3 style={{ marginTop: "20px" }}>Exchange Books</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                {filteredBooks.filter((b) => b.mode === "exchange").length >
                0 ? (
                  filteredBooks
                    .filter((b) => b.mode === "exchange")
                    .map((b) => (
                      <div key={b._id} style={bookCardStyle}>
                        <div>
                          <h3>{b.title}</h3>
                          <p>Author: {b.author}</p>
                          <p>Quality: {b.quality}</p>
                          <p>Owner: {b.ownerEmail}</p>
                          {!b.isAvailable && (
                            <p style={{ color: "red", fontWeight: "bold" }}>
                              Not Available
                            </p>
                          )}
                        </div>
                        <button
                          style={buyButtonStyle(!b.isAvailable)}
                          onClick={() => handleExchangeClick(b)}
                          disabled={!b.isAvailable}
                        >
                          Exchange
                        </button>
                      </div>
                    ))
                ) : (
                  <p>No exchange books found.</p>
                )}
              </div>
            </>
          )}

        {/* BOOKS Section */}
        {(!notificationsOpen || notificationType === "") &&
          activeSection === "books" &&
          subSection === "add" && <AddBook />}
        {(!notificationsOpen || notificationType === "") &&
          activeSection === "books" &&
          subSection === "mybooks" && <MyBooks />}
        {/* Rented Books Section */}
{(!notificationsOpen || notificationType === "") &&
  activeSection === "books" &&
  subSection === "rented" && <RentedBooks />}


        {/* TRANSACTIONS Section */}
        {(!notificationsOpen || notificationType === "") &&
          activeSection === "transactions" && (
            <>
              <h2>
                {subSection === "rental"
                  ? "📚 My Rental Books"
                  : "🔄 My Exchange Books"}
              </h2>
              {myTransactions.filter((t) => t.mode === subSection).length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                  {myTransactions
                    .filter((t) => t.mode === subSection)
                    .map((t) => (
                      <div key={t._id} style={bookCardStyle}>
                        <div>
                          <h3>{t.bookTitle}</h3>
                          <p>Author: {t.bookAuthor}</p>
                          {t.bookPrice && <p>Price: ₹{t.bookPrice}</p>}
                          {t.rentalDuration && (
                            <p>Duration: {t.rentalDuration}</p>
                          )}
                          <p>Quality: {t.quality || "N/A"}</p>
                          <hr />
                          <h4>Owner Details</h4>
                          <p>Name: {t.ownerName}</p>
                          <p>Email: {t.ownerEmail}</p>
                          <p>UPI: {t.ownerUPI}</p>
                          <h4>Your Details</h4>
                          <p>Name: {t.renterName}</p>
                          <p>Email: {t.renterEmail}</p>
                          <p>UPI: {t.renterUPI}</p>
                          <hr />
                          <p>Payment Mode: {t.paymentMode}</p>
                          {t.paymentMode === "UPI" && <p>UPI ID: {t.upi}</p>}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p>No {subSection} books found.</p>
              )}
            </>
          )}

          {/* TRANSACTIONS Section */}
{(!notificationsOpen || notificationType === "") &&
  activeSection === "transactions" && (
    <>
      <h2>
        {subSection === "rental"
          ? "📚 My Rental Books"
          : "🔄 My Exchange Books"}
      </h2>
      {subSection === "exchange" ? (
        <>
          {myTransactions.filter(
            (t) =>
              t.mode === "exchange" &&
              t.status === "Completed" &&
              (t.senderEmail === userEmail || t.receiverEmail === userEmail)
          ).length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              {myTransactions
                .filter(
                  (t) =>
                    t.mode === "exchange" &&
                    t.status === "Completed" &&
                    (t.senderEmail === userEmail || t.receiverEmail === userEmail)
                )
                .map((t) => (
                  <div key={t._id} style={bookCardStyle}>
                    <div>
                      <h3>{t.bookTitle}</h3>
                      <p>Author: {t.bookAuthor}</p>
                      <p>Quality: {t.quality || "N/A"}</p>
                      <hr />
                      <h4>Sender Details</h4>
                      <p>Name: {t.senderName}</p>
                      <p>Email: {t.senderEmail}</p>
                      <h4>Receiver Details</h4>
                      <p>Name: {t.receiverName}</p>
                      <p>Email: {t.receiverEmail}</p>
                      <hr />
                      <p>Status: {t.status}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p>No completed exchange books found.</p>
          )}
        </>
      ) : (
        /* rental logic stays the same */
        myTransactions.filter((t) => t.mode === subSection).length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {myTransactions
              .filter((t) => t.mode === subSection)
              .map((t) => (
                <div key={t._id} style={bookCardStyle}>
                  <div>
                    <h3>{t.bookTitle}</h3>
                    <p>Author: {t.bookAuthor}</p>
                    {t.bookPrice && <p>Price: ₹{t.bookPrice}</p>}
                    {t.rentalDuration && <p>Duration: {t.rentalDuration}</p>}
                    <p>Quality: {t.quality || "N/A"}</p>
                    <hr />
                    <h4>Owner Details</h4>
                    <p>Name: {t.ownerName}</p>
                    <p>Email: {t.ownerEmail}</p>
                    <p>UPI: {t.ownerUPI}</p>
                    <h4>Your Details</h4>
                    <p>Name: {t.renterName}</p>
                    <p>Email: {t.renterEmail}</p>
                    <p>UPI: {t.renterUPI}</p>
                    <hr />
                    <p>Payment Mode: {t.paymentMode}</p>
                    {t.paymentMode === "UPI" && <p>UPI ID: {t.upi}</p>}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p>No {subSection} books found.</p>
        )
      )}
    </>
)}


        {/* NOTIFICATIONS */}
        {notificationsOpen && notificationType !== "" && (
          <div>
            <h2>🔔 Notifications</h2>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <button
                onClick={() => setNotificationType("sent")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor:
                    notificationType === "sent" ? "#4CAF50" : "#ccc",
                  color: notificationType === "sent" ? "white" : "#333",
                }}
              >
                Sent
              </button>
              <button
                onClick={() => setNotificationType("received")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor:
                    notificationType === "received" ? "#4CAF50" : "#ccc",
                  color: notificationType === "received" ? "white" : "#333",
                }}
              >
                Received
              </button>
            </div>

            {/* Notification Cards */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              {(notificationType === "sent"
                ? sentExchanges
                : receivedExchanges
              ).length > 0 ? (
                (notificationType === "sent"
                  ? sentExchanges
                  : receivedExchanges
                ).map((n) => {
                  const isSent = notificationType === "sent";
                  const myBook = isSent ? n.sender.book : n.receiver.book;
                  const otherUser = isSent ? n.receiver : n.sender;
                  const requestedBook = isSent
                    ? n.receiver.book
                    : n.sender.book;
                  const isProcessed =
                    n.status === "Completed" || n.status === "Rejected";

                  // DELETE
                  const handleDelete = async () => {
                    if (isProcessed) return;
                    try {
                      await axios.delete(
                        `http://localhost:5000/api/exchanges/cancel/${n._id}`
                      );
                      if (isSent)
                        setSentExchanges((prev) =>
                          prev.filter((ex) => ex._id !== n._id)
                        );
                      else
                        setReceivedExchanges((prev) =>
                          prev.filter((ex) => ex._id !== n._id)
                        );
                    } catch (err) {
                      console.error("Failed to delete notification:", err);
                    }
                  };

                  // DECLINE
                  const handleDecline = async () => {
                    if (isProcessed) return;
                    try {
                      await axios.put(
                        `http://localhost:5000/api/exchanges/reject/${n._id}`
                      );
                      setReceivedExchanges((prev) =>
                        prev.map((ex) =>
                          ex._id === n._id
                            ? { ...ex, status: "Rejected" }
                            : ex
                        )
                      );
                    } catch (err) {
                      console.error("Failed to decline request:", err);
                    }
                  };

                  // ACCEPT
                  const handleAccept = async () => {
                    if (isProcessed) return;
                    try {
                      await axios.put(
                        `http://localhost:5000/api/exchanges/accept/${n._id}`
                      );
                      // instant UI update
                      setReceivedExchanges((prev) =>
                        prev.map((ex) =>
                          ex._id === n._id
                            ? { ...ex, status: "Completed" }
                            : ex
                        )
                      );

                      const bookId = n.receiver.book._id;
                      const otherPending = receivedExchanges.filter(
                        (ex) =>
                          ex._id !== n._id &&
                          (ex.sender.book._id === bookId ||
                            ex.receiver.book._id === bookId) &&
                          ex.status === "pending"
                      );

                      for (let req of otherPending)
                        await axios.put(
                          `http://localhost:5000/api/exchanges/reject/${req._id}`
                        );

                      setReceivedExchanges((prev) =>
                        prev.map((ex) =>
                          ex._id !== n._id &&
                          (ex.sender.book._id === bookId ||
                            ex.receiver.book._id === bookId)
                            ? { ...ex, status: "Rejected" }
                            : ex
                        )
                      );

                      setSentExchanges((prev) =>
                        prev.map((ex) =>
                          (ex.sender.book._id === bookId ||
                            ex.receiver.book._id === bookId) &&
                          ex.status === "pending"
                            ? { ...ex, status: "Rejected" }
                            : ex
                        )
                      );
                    } catch (err) {
                      console.error("Failed to accept request:", err);
                    }
                  };

                  return (
                    <div
                      key={n._id}
                      style={{
                        flex: "0 0 350px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "15px",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      }}
                    >
                      <h4>
                        📖 My Book: {myBook.title} ({myBook.quality})
                      </h4>
                      <p>Author: {myBook.author}</p>
                      <h4>👤 With: {otherUser.name}</h4>
                      <p>Email: {otherUser.email}</p>
                      <p>Department: {otherUser.department}</p>
                      <p>
                        Year: {otherUser.year} | Class: {otherUser.className}
                      </p>
                      <h4>Requested Book: {requestedBook.title}</h4>
                      <p>Status: {n.status}</p>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "10px",
                        }}
                      >
                        {!isSent && n.status === "pending" && (
                          <>
                            <button
                              style={{
                                padding: "6px 12px",
                                borderRadius: "5px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                              }}
                              onClick={handleAccept}
                            >
                              Accept
                            </button>
                            <button
                              style={{
                                padding: "6px 12px",
                                borderRadius: "5px",
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                              }}
                              onClick={handleDecline}
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {isSent && n.status === "pending" && (
                          <button
                            style={{
                              padding: "6px 12px",
                              borderRadius: "5px",
                              backgroundColor: "#f44336",
                              color: "white",
                              border: "none",
                              cursor: "pointer",
                            }}
                            onClick={handleDelete}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No {notificationType} requests.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
