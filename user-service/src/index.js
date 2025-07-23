const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cors = require("cors");
const medicalProfileRoutes = require('./routes/medicalProfileRoutes');


const app = express();
dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 5002;

app.use(express.json());

app.use('/api/medical-profiles', medicalProfileRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB is connected");
    app.listen(PORT, () => {
      console.log(`User service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed', err);
  });
