import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ---------------------------
// Helper: Generate JWT
// ---------------------------
const generateJWT = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ---------------------------
// Signup
// ---------------------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const token = generateJWT(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,              // REQUIRED for Vercel
      sameSite: "None",          // REQUIRED for cross-domain cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Signup successful",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// Login
// ---------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateJWT(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// Logout
// ---------------------------
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(0),
  });

  return res.json({ message: "Logged out successfully" });
});

// ---------------------------
// Get Logged In User
// ---------------------------
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ user: null });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.json({ user: null });
    }

    const user = await User.findById(decoded.id).select("-password");

    return res.json({ user });
  } catch (err) {
    console.error("ME Error:", err);
    res.json({ user: null });
  }
});

export default router;

