import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    const photoFile = req.file;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Email, password, and full name are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Process image
    let photoBase64 = '';
    if (photoFile) {
      photoBase64 = `data:${photoFile.mimetype};base64,${photoFile.buffer.toString('base64')}`;
    }

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      photo: photoBase64, // Store Base64 string
    });

    await newUser.save();

    res.status(201).json({
      userId: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      photo: newUser.photo,
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    res.status(200).json({
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      photo: user.photo,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};