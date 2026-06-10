import User from "../models/User.js";
import Admin from "../models/Admin.js";


// ---------------------- REGISTER USER ----------------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, upi, password, confirmpassword, gender, department, year, section, phone } = req.body;

    // ---------------- Validation ----------------
    if (!/^[A-Z][a-zA-Z\s]*$/.test(name))
      return res.status(400).json({ error: "Name must start with a capital letter" });

    if (!email.endsWith("@gmail.com"))
      return res.status(400).json({ error: "Email must end with @gmail.com" });

    if (!upi || !/^[\w.-]+@[\w]+$/.test(upi))
      return res.status(400).json({ error: "Enter a valid UPI ID" });

    if (password !== confirmpassword)
      return res.status(400).json({ error: "Passwords do not match" });

    if (!/^\d{10}$/.test(phone))
      return res.status(400).json({ error: "Phone number must be 10 digits" });

    if (!gender || !department || !year || !section)
      return res.status(400).json({ error: "All fields are required" });

    // ---------------- Check Existing User ----------------
    const existingUser = await User.findOne({ $or: [{ email }, { upi }] });
    if (existingUser)
      return res.status(400).json({ error: "Email or UPI already registered" });

    // ---------------- Save New User ----------------
    const user = new User({ name, email, upi, password, gender, department, year, section, phone });
    await user.save();

    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(400).json({ error: "User registration failed" });
  }
};

// ---------------------- LOGIN USER ----------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User not found" });

    if (user.password !== password)
      return res.status(400).json({ error: "Invalid password" });

    res.json({
      message: "✅ Login successful",
      email: user.email,
      role: "user"
    });
  } catch (error) {
    console.error("❌ Login failed:", error);
    res.status(400).json({ error: "Login failed" });
  }
};

// ---------------------- GET USER DETAILS ----------------------
export const getUserDetails = async (req, res) => {
  try {
    const { email } = req.params;

    // Try to find user in the Users collection
    let user = await User.findOne({ email }).select("-password");

    // If not found in Users, try Admins
    if (!user) {
      const admin = await Admin.findOne({ email }).select("-password");
      if (admin) {
        user = {
          name: admin.name || "Admin",
          email: admin.email,
          upi: admin.upi || "N/A",
          department: "N/A",
          year: "N/A",
          section: "N/A",
          role: "admin"
        };
      }
    }

    // Still not found → return error
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("❌ Fetch user failed:", error);
    res.status(500).json({ error: "Error fetching user details" });
  }
};


// ---------------------- UPDATE USER DETAILS ----------------------
export const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, department, year, section, phone, upi } = req.body;

    // Validation
    if (!/^[A-Z][a-zA-Z\s]*$/.test(name))
      return res.status(400).json({ error: "Name must start with a capital letter" });

    if (phone && !/^\d{10}$/.test(phone))
      return res.status(400).json({ error: "Phone number must be 10 digits" });

    if (upi) {
      const existingUPI = await User.findOne({ upi, email: { $ne: email } });
      if (existingUPI)
        return res.status(400).json({ error: "UPI already in use by another user" });
    }

    const updated = await User.findOneAndUpdate(
      { email },
      { name, department, year, section, phone, ...(upi && { upi }) },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "User not found" });

    res.json({ message: "✅ Profile updated successfully", user: updated });
  } catch (err) {
    console.error("❌ Update failed:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
