const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

// Initialize dotenv for environment variables
dotenv.config();

const app = express();
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    method: ["GET","POST","DELETE", "PUT"],
  }
  app.use(cors(corsOptions));
const PORT = process.env.PORT || 9000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose model (for example, a "User" model)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const User = mongoose.model('Dummy', userSchema);

// Routes

// Create a new user
app.post('/dummy', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const newUser = new User({ name, email, age });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all users
app.get('/dummy', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Update a user by ID
app.put('/dummy/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user by ID
app.delete('/dummy/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
