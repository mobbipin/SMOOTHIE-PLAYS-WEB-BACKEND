// controller/mobileAuth.controller.js
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";
import { User } from "../models/user.model.js";

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error uploading to Cloudinary", error);
    throw new Error("Image upload failed");
  }
};

export const mobileSignup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    let imageUrl = req.body.photo;
    if (req.files && req.files.photo) {
      imageUrl = await uploadToCloudinary(req.files.photo);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      fullName,
      imageUrl,
      email,
      passwordHash,
      clerkId: null,
    });

    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};
export const mobileLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT payload and sign the token
    const payload = {
      userId: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user._id,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
