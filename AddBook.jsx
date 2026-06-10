import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom"; // You can uncomment this if you want to redirect after success

export default function AddBook() {
  // const navigate = useNavigate(); // Uncomment this line if using useNavigate
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    mode: "rental",
    rentalDuration: "6 months",
    quality: "",
  });
  // Add new state to handle the selected image file object
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ownerEmail = localStorage.getItem("userEmail");
    if (!ownerEmail) return alert("You must be logged in.");

    // Basic validation before sending to backend, including image check
    if (!form.title || !form.author || !form.mode || !form.quality || !imageFile) {
      return alert("All required fields must be filled, including the book image.");
    }

    if (form.mode === "rental") {
      if (!form.price || Number(form.price) < 100) {
        return alert("Rental price must be at least ₹100");
      }
    }

    try {
      // Use FormData to send both text data and the file binary data
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("mode", form.mode);
      formData.append("quality", form.quality);
      formData.append("ownerEmail", ownerEmail);
      formData.append("image", imageFile); // Append the image file here

      if (form.mode === "rental") {
        formData.append("price", Number(form.price));
        formData.append("rentalDuration", form.rentalDuration);
      }

      // Send the request with explicit content type header for FormData
      const res = await axios.post("http://localhost:5000/api/books/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);
      
      // Reset form fields
      setForm({
        title: "",
        author: "",
        price: "",
        mode: "rental",
        rentalDuration: "6 months",
        quality: "",
      });
      // Reset the image file state and clear the physical input value (if needed, this often requires using a ref)
      setImageFile(null); 
      // navigate('/user-dashboard'); // Uncomment to redirect user after success
      
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.error || "Failed to add book");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Book</h2>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <input
        placeholder="Author"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
        required
      />

      <select
        value={form.mode}
        onChange={(e) => setForm({ ...form, mode: e.target.value })}
      >
        <option value="rental">Rental</option>
        <option value="exchange">Exchange</option>
      </select>

      {form.mode === "rental" && (
        <>
          <input
            type="number"
            placeholder="Price (Min ₹100)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <select
            value={form.rentalDuration}
            onChange={(e) =>
              setForm({ ...form, rentalDuration: e.target.value })
            }
          >
            <option value="6 months">6 months</option>
            <option value="1 year">1 year</option>
          </select>
        </>
      )}

      {/* Add the file input field for the image */}
      <div>
        <label>Book Image:</label>
        <input
          type="file"
          accept="image/*" // Optional: restrict file types to images
          onChange={(e) => setImageFile(e.target.files[0])} // Get the first selected file object
          required
        />
      </div>

      <div>
        <label>Quality:</label>
        <label>
          <input
            type="radio"
            name="quality"
            value="low"
            checked={form.quality === "low"}
            onChange={(e) => setForm({ ...form, quality: e.target.value })}
            required
          />{" "}
          Low
        </label>
        <label>
          <input
            type="radio"
            name="quality"
            value="medium"
            checked={form.quality === "medium"}
            onChange={(e) => setForm({ ...form, quality: e.target.value })}
            required
          />{" "}
          Medium
        </label>
        <label>
          <input
            type="radio"
            name="quality"
            value="high"
            checked={form.quality === "high"}
            onChange={(e) => setForm({ ...form, quality: e.target.value })}
            required
          />{" "}
          High
        </label>
      </div>

      <button type="submit">Add Book</button>
    </form>
  );
}
