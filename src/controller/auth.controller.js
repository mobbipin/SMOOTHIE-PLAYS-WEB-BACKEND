import bcrypt from 'bcrypt';
import { uploadToCloudinary } from '../lib/cloudinary.js';
import { generateToken } from '../lib/jwt.js';

export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const profileImage = req.files?.profileImage;

    if (!profileImage) {
      return res.status(400).json({ message: 'Profile image is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const imageUrl = await uploadToCloudinary(profileImage);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      imageUrl,
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
  }
};