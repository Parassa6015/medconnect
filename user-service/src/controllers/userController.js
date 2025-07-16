const User = require('../models/User');

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserByAuthId = async (req, res) => {
  const { authUserId } = req.params;
  const user = await User.findOne({ authUserId });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ user });
};


exports.getAllUsers = async (req, res) => {
  try {
    // Read query parameters
    let { page, limit } = req.query;

    // Convert to numbers and set default values if not provided
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    // Get total count for metadata
    const totalUsers = await User.countDocuments();

    // Query users with skip and limit
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .select('-password -__v'); // Example of excluding sensitive fields

    res.status(200).json({
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      pageSize: limit,
      users,
      message: "User-service is working!"
    }
  );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
};

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUserById = async(req,res) =>{
  try{

    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Not allowed to delete this user' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id); 
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  }catch (err){
    res.status(500).json({ error: err.message });
  }

}

exports.updateUser = async (req, res) => {
  try {
    // Optional: If using token-based user identity
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Not allowed to update this user' });
    }

    // Define which fields are allowed to be updated
    const allowedUpdates = ['firstName', 'lastName', 'gender', 'dob', 'address'];
    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Use findOneAndUpdate to look up by authUserId
    const updatedUser = await User.findOneAndUpdate(
      { authUserId: req.params.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateUserByAuthId = async (req, res) => {
  try {
    const { authUserId } = req.params;
    const updatedUser = await User.findOneAndUpdate(
      { authUserId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
