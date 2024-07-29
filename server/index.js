const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Route to handle GitHub OAuth callback
app.use('/github', require('./routes/github'));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});