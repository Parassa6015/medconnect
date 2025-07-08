const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");


// Create notification (could be called by another service)
router.post("/", controller.createNotification);

// Get all notifications for a user
router.get("/user/:userId", controller.getUserNotifications);

// Mark notification as read
router.put("/:id/read", controller.markAsRead);

module.exports = router;
