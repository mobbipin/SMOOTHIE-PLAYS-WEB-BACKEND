// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, default: null },
    // For Google (Clerk) users; if using email signup, this remains null.
    clerkId: { type: String, default: null },
    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);
export const makeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user role
    user.role = "admin";
    await user.save();

    res.status(200).json({ message: "User promoted to admin", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const User = mongoose.model("User", userSchema);
