const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/userMiddleware');


router.get('/', userController.getAllUsers);

// Protected example route
router.get('/:id', protect, userController.getUserById);

router.post('/', userController.createUser);

router.delete('/:id', protect, userController.deleteUserById);

router.put('/:id', protect, userController.updateUser);


module.exports = router;
