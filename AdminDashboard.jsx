import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/index.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("home");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const adminEmail = localStorage.getItem("adminEmail");

  // ----------------- Logout -----------------
  const logout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  // ----------------- Fetch Users -----------------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
      setActiveSection("users");
    } catch (err) {
      alert("Failed to fetch users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Fetch Books -----------------
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/books");
      setBooks(res.data);
      setActiveSection("books");
    } catch (err) {
      alert("Failed to fetch books: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------- ✅ Fetch Completed Transactions -----------------
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/transactions");

      // Data returned as { rentals: [...], exchanges: [...] }
      setRentals(res.data.rentals || []);
      setExchanges(res.data.exchanges || []);
      setTransactionSearch(""); // Reset search input when loading transactions
      setActiveSection("transactions");
    } catch (err) {
      console.error("Fetch transactions error:", err);
      alert("Failed to fetch transactions: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Sorting Logic -----------------
  const sortItems = (items, key) => {
    if (!key) return items;
    return [...items].sort((a, b) => {
      const valA = a[key]?.toString().toLowerCase();
      const valB = b[key]?.toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedUsers = sortItems(
    users.filter((u) => u.email.toLowerCase().includes(userSearch.toLowerCase())),
    sortConfig.key
  );

  const filteredBooks = sortItems(
    books.filter(
      (b) =>
        b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
        b.ownerEmail.toLowerCase().includes(bookSearch.toLowerCase())
    ),
    sortConfig.key
  );

  // ----------------- Filter Transactions by Search -----------------
  const filteredRentals = rentals.filter((r) => {
    const search = transactionSearch.toLowerCase();
    return (
      (r.bookTitle && r.bookTitle.toLowerCase().includes(search)) ||
      (r.renterEmail && r.renterEmail.toLowerCase().includes(search)) ||
      (r.ownerEmail && r.ownerEmail.toLowerCase().includes(search))
    );
  });

  const filteredExchanges = exchanges.filter((ex) => {
    const search = transactionSearch.toLowerCase();
    return (
      (ex.sender.book.title && ex.sender.book.title.toLowerCase().includes(search)) ||
      (ex.receiver.book.title && ex.receiver.book.title.toLowerCase().includes(search)) ||
      (ex.sender.email && ex.sender.email.toLowerCase().includes(search)) ||
      (ex.receiver.email && ex.receiver.email.toLowerCase().includes(search))
    );
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  // ----------------- Add Book Form Submit -----------------
  const handleAddBook = async (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const author = e.target.author.value.trim();
    const price = Number(e.target.price.value);
    const rentalDuration = e.target.rentalDuration.value;
    const quality = e.target.quality.value.toLowerCase();

    if (!title || !author) return alert("Book title and author cannot be empty");
    if (isNaN(price) || price < 100) return alert("Price must be at least ₹100");
    if (!["low", "medium", "high"].includes(quality)) return alert("Please select a valid quality");

    if (!adminEmail) return alert("Admin not logged in!");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/books", {
        title,
        author,
        price,
        rentalDuration,
        quality,
        ownerEmail: adminEmail,
        mode: "rental",
      });
      alert(res.data.message);
      e.target.reset();
      fetchBooks();
    } catch (err) {
      console.error("Add Book Error:", err.response?.data || err.message);
      alert("Failed to add book: " + (err.response?.data?.message || err.message));
    }
  };

  // ----------------- UI -----------------
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <button onClick={() => setActiveSection("home")}>🏠 Home</button>
        <button onClick={fetchUsers}>👥 Users</button>
        <button onClick={fetchBooks}>📚 Books</button>
        <button onClick={() => setActiveSection("addbook")}>➕ Add Book</button>
        <button onClick={fetchTransactions}>🧾 Transactions</button>
        <button onClick={logout}>🚪 Logout</button>
      </div>

      <div className="dashboard-content">
        {/* Home */}
        {activeSection === "home" && <h2>👑 Welcome Admin</h2>}

        {/* Users Section */}
        {activeSection === "users" && (
          <div>
            <h3>👥 Users</h3>
            <input
              type="text"
              placeholder="Search by email"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="search-input"
            />
            {loading ? (
              <p>Loading...</p>
            ) : sortedUsers.length > 0 ? (
              <table className="interactive-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("name")}>Name</th>
                    <th onClick={() => handleSort("email")}>Email</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Section</th>
                    <th>Phone</th>
                    <th>UPI</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((u, i) => (
                    <tr key={i}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.department}</td>
                      <td>{u.year}</td>
                      <td>{u.section}</td>
                      <td>{u.phone}</td>
                      <td>{u.upi || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        )}

        {/* Books Section */}
        {activeSection === "books" && (
          <div>
            <h3>📚 Books</h3>
            <input
              type="text"
              placeholder="Search by title, author, or owner"
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              className="search-input"
            />
            {loading ? (
              <p>Loading...</p>
            ) : filteredBooks.length > 0 ? (
              <table className="interactive-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Mode</th>
                    <th>Rental Duration</th>
                    <th>Quality</th>
                    <th>Owner</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((b, i) => (
                    <tr key={i}>
                      <td>{b.title}</td>
                      <td>{b.author}</td>
                      <td>{b.price}</td>
                      <td>{b.mode}</td>
                      <td>{b.rentalDuration || "-"}</td>
                      <td>{b.quality || "-"}</td>
                      <td>{b.ownerEmail}</td>
                      <td>{b.isAvailable ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No books found.</p>
            )}
          </div>
        )}

        {/* Add Book Section */}
        {activeSection === "addbook" && (
          <div className="add-book-form">
            <h3>➕ Add Rental Book</h3>
            <form onSubmit={handleAddBook}>
              <input type="text" name="title" placeholder="Book Title" required />
              <input type="text" name="author" placeholder="Author Name" required />
              <input type="number" name="price" placeholder="Price (min ₹100)" min="100" required />
              <select name="rentalDuration" required>
                <option value="">Select Duration</option>
                <option value="6 months">6 Months</option>
                <option value="1 year">1 Year</option>
              </select>

              <div style={{ display: "flex", flexDirection: "column", margin: "10px 0" }}>
                <p>Quality:</p>
                <label><input type="radio" name="quality" value="Low" required /> Low</label>
                <label><input type="radio" name="quality" value="Medium" required /> Medium</label>
                <label><input type="radio" name="quality" value="High" required /> High</label>
              </div>

              <p>Owner Email: <strong>{adminEmail}</strong></p>
              <button type="submit">Add Rental Book</button>
            </form>
          </div>
        )}

        {/* ✅ Transactions Section */}
        {activeSection === "transactions" && (
          <div>
            <h3>🧾 Completed Transactions</h3>
            <input
              type="text"
              placeholder="Search transactions by book title or email"
              value={transactionSearch}
              onChange={(e) => setTransactionSearch(e.target.value)}
              className="search-input"
              style={{ marginBottom: "1rem", width: "100%", maxWidth: "400px" }}
            />

            {loading && <p>Loading transactions...</p>}

            {/* Completed Rentals */}
            <h4>📗 Completed Rentals</h4>
            {filteredRentals.length > 0 ? (
              <table className="interactive-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Renter</th>
                    <th>Owner</th>
                    <th>Duration</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRentals.map((r, i) => (
                    <tr key={i}>
                      <td>{r.bookTitle}</td>
                      <td>{r.renterEmail}</td>
                      <td>{r.ownerEmail}</td>
                      <td>{r.rentalDuration}</td>
                      <td>{new Date(r.startDate).toLocaleDateString()}</td>
                      <td>{new Date(r.endDate).toLocaleDateString()}</td>
                      <td style={{ color: "green" }}>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No completed rentals found.</p>
            )}

            <hr />

            {/* Completed Exchanges */}
            <h4>🔄 Completed Exchanges</h4>
            {filteredExchanges.length > 0 ? (
              <table className="interactive-table">
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Sender Book</th>
                    <th>Receiver Book</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExchanges.map((ex, i) => (
                    <tr key={i}>
                      <td>{ex.sender.email}</td>
                      <td>{ex.receiver.email}</td>
                      <td>{ex.sender.book.title}</td>
                      <td>{ex.receiver.book.title}</td>
                      <td style={{ color: "green" }}>{ex.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No completed exchanges found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}