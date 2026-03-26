//backend/src/models/User.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    refreshToken: {
      type: String,
      default: null,
      select: false   // never returned in queries by default
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
