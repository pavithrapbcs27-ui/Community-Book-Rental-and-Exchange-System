const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
  sender: {
    email: String,
    name: String,
    department: String,
    phone: String,
    year: String,
    class: String,
    book: {
      id: String,
      title: String,
      author: String,
      quality: String,
    },
  },
  receiver: {
    email: String,
    name: String,
    department: String,
    phone: String,
    year: String,
    class: String,
    book: {
      id: String,
      title: String,
      author: String,
      quality: String,
    },
  },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Exchange", exchangeSchema);
