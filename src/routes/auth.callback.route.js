import { clerkClient } from "@clerk/clerk-sdk-node";
import express from "express";
import { User } from "../models/user.model.js";

const router = express.Router();

router.post("/callback", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.replace("Bearer ", "");
    const clerkUser = await clerkClient.users.getUserList({ limit: 1, externalId: token });

    if (!clerkUser || clerkUser.length === 0) 
      return res.status(401).json({ message: "Invalid token" });

    const { id, emailAddresses, firstName, lastName, imageUrl } = clerkUser[0];

    const email = emailAddresses[0]?.emailAddress || "";
    const fullName = `${firstName} ${lastName}`.trim();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        clerkId: id,
        fullName,
        email,
        imageUrl,
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
