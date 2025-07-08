const Notification = require("../models/Notification");

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: "userId and message are required." });
    }

    const notification = new Notification({
      userId,
      type,
      message
    });

    await notification.save();

    res.status(201).json({ message: "Notification created successfully.", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json({ message: "Notification marked as read.", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
