
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";
import { User } from "../models/user.model.js";

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

// ----- GOOGLE (Clerk-style) Authentication Callback -----

export const googleAuthCallback = async (req, res, next) => {
  try {

    const { id, fullName, email, imageUrl } = req.body;
    // Find an existing user by clerkId or email.
    let user = await User.findOne({ $or: [{ clerkId: id }, { email }] });
    if (!user) {

      user = await User.create({
        fullName,
        email,
        imageUrl,
        clerkId: id,
      });
    } else {
  
      if (!user.clerkId) {
        user.clerkId = id;
        await user.save();
      }
    }
    // FOR MOBILE USERS
    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({
      message: "Google authentication successful",
      token,
      user: {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ----- Email/Password Signup -----

export const emailSignup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    let imageUrl = req.body.photo; 

   
    if (req.files && req.files.photo) {
      imageUrl = await uploadToCloudinary(req.files.photo);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password.
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the user.
    const user = await User.create({
      fullName,
      email,
      imageUrl,
      passwordHash,
      clerkId: null,
    });


    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ----- Email/Password Login -----
export const emailLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
