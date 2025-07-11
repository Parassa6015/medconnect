const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/userMiddleware');
const serviceAuth = require('../middleware/serviceAuthMiddleware');

// Public or shared routes
router.get('/', userController.getAllUsers);

// More specific route first
router.get('/profile/:id', protect, userController.getUserById);

// Service-to-service route (internal)
router.get('/:id', serviceAuth, userController.getUserById);

// User-protected CRUD
router.post('/', protect, userController.createUser);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUserById);


module.exports = router;


