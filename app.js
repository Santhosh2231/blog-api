const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler.js');
const authRoutes = require('./routes/authRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

dotenv.config();

// Create the Express app
const app = express();

// Set up middleware
app.use(express.json());
app.use(cors());

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// Set up error handling middleware
app.use(errorHandler);

// Connect to the database
mongoose.connect(process.env.MONGODB_URI , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to database'))
.catch((err) => console.log('Error connecting to database:', err));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
