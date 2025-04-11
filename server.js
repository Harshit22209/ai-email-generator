const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.CLIENT_URL || 'https://your-app-name.herokuapp.com'] 
      : ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Import error handler
const errorHandler = require('./middleware/errorHandler');

// Apply error handler middleware
app.use(errorHandler);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});