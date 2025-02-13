// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    clerkId: {
      type: String,
      // For mobile users, this may be absent or set to a default/dummy value.
      default: null,
      unique: false,
    },
    // New fields for mobile authentication:
    email: {
      type: String,
      unique: true,
      sparse: true, // Allow some users not to have an email (if only using Clerk)
    },
    passwordHash: {
      type: String,
      // Only used for mobile email/password login
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
