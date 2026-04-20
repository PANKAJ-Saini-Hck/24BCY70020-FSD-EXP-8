const express = require('express');
const User = require('../models/User');
const { authMiddleware, authorize, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Admin dashboard stats (admin only)
router.get('/stats', authMiddleware, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const managerCount = await User.countDocuments({ role: 'manager' });
    const userCount = await User.countDocuments({ role: 'user' });

    res.status(200).json({
      message: 'Admin stats retrieved',
      stats: {
        totalUsers,
        adminCount,
        managerCount,
        userCount,
        activeUsers: await User.countDocuments({ isActive: true })
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Manage users (assign/change roles)
router.post('/assign-role', authMiddleware, authorize('admin'), async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rolePermissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'view_reports', 'manage_roles'],
      manager: ['read', 'write', 'delete', 'view_reports'],
      user: ['read']
    };

    user.role = newRole;
    user.permissions = rolePermissions[newRole] || ['read'];
    await user.save();

    res.status(200).json({
      message: `User role changed to ${newRole}`,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle user active status
router.post('/toggle-status', authMiddleware, authorize('admin'), async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User status updated to ${user.isActive ? 'active' : 'inactive'}`,
      user: {
        id: user._id,
        name: user.name,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get audit log (admin only)
router.get('/audit-log', authMiddleware, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('name email role lastLogin createdAt').sort({ lastLogin: -1 });
    
    res.status(200).json({
      message: 'Audit log retrieved',
      log: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
