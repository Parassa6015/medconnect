const express = require("express");
const router = express.Router();
const axios = require("axios");
const protect = require("../middleware/authMiddleware");

const NOTIFICATION_URL = "http://notification:5004/api/notification";

// Fetch notifications for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const response = await axios.get(`${NOTIFICATION_URL}/user/${req.user.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.SERVICE_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark a notification as read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const response = await axios.put(`${NOTIFICATION_URL}/${req.params.id}/read`, {}, {
      headers: {
        Authorization: `Bearer ${process.env.SERVICE_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
