// Backend/models/User.js
import mongoose from "mongoose";

// Define schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Create model
const User = mongoose.model("User", userSchema);

// ✅ Default export so you can use: import User from "../models/User.js"
export default User;

