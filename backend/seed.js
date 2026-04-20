/**
 * Seed script to populate MongoDB with demo users and roles
 * Run: node seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Role = require('./models/Role');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data (optional - comment out to preserve data)
    await User.deleteMany({});
    await Role.deleteMany({});
    console.log('✓ Cleared existing data');

    // Seed roles with permissions
    const roles = await Role.insertMany([
      {
        name: 'admin',
        description: 'Administrator with full system access',
        permissions: ['read', 'write', 'delete', 'manage_users', 'view_reports', 'manage_roles']
      },
      {
        name: 'manager',
        description: 'Manager with limited administrative access',
        permissions: ['read', 'write', 'delete', 'view_reports']
      },
      {
        name: 'user',
        description: 'Regular user with basic read access',
        permissions: ['read']
      }
    ]);
    console.log('✓ Seeded ' + roles.length + ' roles');

    // Seed demo users
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
        permissions: ['read', 'write', 'delete', 'manage_users', 'view_reports', 'manage_roles'],
        isActive: true
      },
      {
        name: 'Manager User',
        email: 'manager@test.com',
        password: 'password123',
        role: 'manager',
        permissions: ['read', 'write', 'delete', 'view_reports'],
        isActive: true
      },
      {
        name: 'Regular User',
        email: 'user@test.com',
        password: 'password123',
        role: 'user',
        permissions: ['read'],
        isActive: true
      },
      {
        name: 'John Doe',
        email: 'john.doe@test.com',
        password: 'password123',
        role: 'user',
        permissions: ['read'],
        isActive: true
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@test.com',
        password: 'password123',
        role: 'manager',
        permissions: ['read', 'write', 'delete', 'view_reports'],
        isActive: true
      }
    ];

    // Hash passwords and insert users
    for (let user of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }

    const users = await User.insertMany(demoUsers);
    console.log('✓ Seeded ' + users.length + ' users');

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('Demo Credentials:');
    console.log('================');
    console.log('Admin:   admin@test.com / password123');
    console.log('Manager: manager@test.com / password123');
    console.log('User:    user@test.com / password123');
    console.log('================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
