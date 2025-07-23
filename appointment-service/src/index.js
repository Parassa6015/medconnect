const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const appointmentRoutes = require('./routes/appointmentRoutes');
const cors = require("cors");
const availabilityRoutes = require("./routes/availabilityRoutes");


const app = express();
dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 5003;

app.use(express.json());

app.use('/api/appointment', appointmentRoutes);
app.use("/api/availability", availabilityRoutes);

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
