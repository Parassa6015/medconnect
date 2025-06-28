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

exports.getAllUsers = (req, res) => {
  res.json({ message: "User-service is working!" });
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

exports.deleteUserByEmail = async(req,res) =>{
  try{
    const deletedUser = await User.findOneAndDelete({email: req.params.email});
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  }catch (err){
    res.status(500).json({ error: err.message });
  }

}

exports.updateUser = async(req,res) =>{
  try{
    const updatedUser = await User.findOneAndUpdate({email: req.params.email},req.body,{ new: true, runValidators: true });
    if(!updatedUser){
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}


// You can later add updateProfile, deleteUser, etc.
