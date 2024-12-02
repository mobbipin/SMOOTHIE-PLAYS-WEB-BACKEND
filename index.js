const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    // Debugging: Log the Mongo URI to ensure it's loaded
    console.log('Mongo URI:', uri);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Connect to the database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Example Route
app.get('/', (req, res) => {
  res.send('Hello World! Welcome to Smoothie Plays');
});
const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    duration: { type: Number, required: true }, // duration in seconds
  });
  
  const Song = mongoose.model('Song', songSchema);
  
  // API to create a new song
  app.post('/api/songs', async (req, res) => {
    try {
      const newSong = new Song(req.body);
      const savedSong = await newSong.save();
      res.status(201).json(savedSong);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API to get all songs
  app.get('/api/songs', async (req, res) => {
    try {
      const songs = await Song.find();
      res.json(songs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
