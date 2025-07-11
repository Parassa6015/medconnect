const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const notificationRoutes = require('./routes/notificationRoutes');
const cors = require("cors");


const app = express();
dotenv.config();
app.use(cors());
const PORT = process.env.PORT || 5004;

app.use(express.json());

app.use('/api/notification', notificationRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB is connected");
    app.listen(PORT, () => {
      console.log(`Appointment service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed', err);
  });
