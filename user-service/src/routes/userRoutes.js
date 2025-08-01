const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/userMiddleware');
const serviceAuth = require('../middleware/serviceAuthMiddleware');

// Public or shared routes
router.get('/', userController.getAllUsers);

// More specific route first
router.get('/profile/:id', protect, userController.getUserById);
router.get("/doctors", userController.getAllDoctors);

// Service-to-service route (internal)
router.get('/internal/:id', serviceAuth, userController.getUserById);
router.get('/by-auth/:authUserId', serviceAuth, userController.getUserByAuthId);

// User-protected CRUD
router.post('/', protect, userController.createUser);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUserById);
router.put('/by-auth/:authUserId', protect, userController.updateUserByAuthId);


module.exports = router;


