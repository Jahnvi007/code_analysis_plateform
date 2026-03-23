//backend/src/controllers/auth.controller.js
import crypto from "crypto";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/** Hashes a plain token for safe DB storage */
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user including refreshToken field
    const user = await User.findOne({ email }).select("+refreshToken +password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Issue access token (short-lived)
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // Issue refresh token (long-lived JWT stored hashed in DB)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
    );
    await User.findByIdAndUpdate(user._id, { refreshToken: hashToken(refreshToken) });

    res.json({
      message: "Login successful",
      token,
      refreshToken,
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= REFRESH ACCESS TOKEN ================= */
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify the token signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    // Find user and confirm stored token matches
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== hashToken(refreshToken)) {
      return res.status(403).json({ message: "Refresh token revoked or not found" });
    }

    // Issue a fresh access token
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({ token: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: "Token refresh failed" });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};
