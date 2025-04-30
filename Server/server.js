const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./auth');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

// Routes
app.use('/api', authRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});