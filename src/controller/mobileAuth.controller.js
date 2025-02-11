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


