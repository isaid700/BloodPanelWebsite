const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://IHI01:BloodPanelProject@cluster0.51fmh.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
  origin: "http://localhost:3000"
}));
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  .on('error', (error) => {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  });


  // function to test connection from frontend
  app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is connected!' });
  });