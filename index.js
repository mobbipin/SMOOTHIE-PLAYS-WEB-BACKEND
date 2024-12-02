const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World! Welcome to Smoothie Plays');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
