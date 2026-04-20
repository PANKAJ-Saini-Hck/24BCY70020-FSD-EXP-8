const express = require('express');
const User = require('../models/User');
const { authMiddleware, authorize } = require('../middleware/auth');

const router = express.Router();

// Get user dashboard
router.get('/user', authMiddleware, authorize('user', 'manager', 'admin'), async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    res.status(200).json({
      message: 'User dashboard data retrieved',
      dashboard: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
          lastLogin: user.lastLogin
        },
        content: {
          title: `Welcome, ${user.name}!`,
          description: `You are logged in as a ${user.role}.`,
          features: user.permissions
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get manager dashboard
router.get('/manager', authMiddleware, authorize('manager', 'admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').limit(10);
    const stats = {
      totalUsers: users.length,
      reportsGenerated: Math.floor(Math.random() * 100)
    };

    res.status(200).json({
      message: 'Manager dashboard data retrieved',
      dashboard: {
        stats,
        recentUsers: users,
        features: ['View Reports', 'Manage Data', 'View Analytics']
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get admin dashboard
router.get('/admin', authMiddleware, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const managerCount = await User.countDocuments({ role: 'manager' });
    const userCount = await User.countDocuments({ role: 'user' });
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');

    res.status(200).json({
      message: 'Admin dashboard data retrieved',
      dashboard: {
        stats: {
          totalUsers,
          adminCount,
          managerCount,
          userCount
        },
        recentUsers,
        features: ['Manage All Users', 'View Reports', 'Manage Roles', 'View Audit Log']
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
