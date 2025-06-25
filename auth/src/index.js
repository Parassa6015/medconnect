const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authroutes = require('./routes/auth');  // ✅ Correct path

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use('/api/auth', authroutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB is connected");
  app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('MongoDB connection failed', err);
});
