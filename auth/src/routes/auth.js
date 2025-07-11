const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');
const axios = require('axios');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, medicalLicenseNumber } = req.body;
    if (role === 'doctor' && !medicalLicenseNumber) {
      return res.status(400).json({ message: "Medical license number is required for doctors." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      // If doctor, set medicalLicenseNumber and isApproved false
      medicalLicenseNumber: role === 'doctor' ? medicalLicenseNumber : undefined,
      isApproved: role === 'doctor' ? false : true
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    try {
  const axiosResponse = await axios.post("http://user:5002/api/users",
    {
      authUserId: newUser._id,
      firstName: newUser.name,
      lastName: "",
      email: newUser.email,
      gender: "",
      dob: "",
      address: "",
      role: newUser.role
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
    console.log("Axios response:", axiosResponse.data);
  } catch (axiosError) {
    console.error("Axios error details:", axiosError.response?.data || axiosError.message);
  }

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isApproved: newUser.isApproved
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(403).json({ message: "Your account is pending approval by the admin." });
    }

    res.status(200).json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile', protect, (req, res) => {
  res.json({ message: 'Welcome, authenticated user', user: req.user });
});


// Get all unapproved doctors (Admin only)
router.get('/unapproved-doctors', protect, async (req, res) => {
  try {
    // Ensure only admin can access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const doctors = await User.find({ role: 'doctor', isApproved: false }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve a doctor account by ID (Admin only)
router.post('/approve-doctor/:id', protect, async (req, res) => {
  try {
    // Ensure only admin can access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (doctor.isApproved) {
      return res.status(400).json({ message: 'Doctor is already approved' });
    }

    // Hash the license number before saving for security
    const bcrypt = require('bcryptjs');
    const hashedLicense = await bcrypt.hash(doctor.medicalLicenseNumber, 10);

    doctor.medicalLicenseNumber = hashedLicense;
    doctor.isApproved = true;

    await doctor.save();

    res.json({ message: 'Doctor approved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
