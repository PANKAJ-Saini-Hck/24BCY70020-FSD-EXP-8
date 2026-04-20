const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['admin', 'manager', 'user']
  },
  description: String,
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'manage_users', 'view_reports', 'manage_roles']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define role hierarchy with permissions
const rolePermissions = {
  admin: ['read', 'write', 'delete', 'manage_users', 'view_reports', 'manage_roles'],
  manager: ['read', 'write', 'delete', 'view_reports'],
  user: ['read']
};

// Seed initial roles
roleSchema.statics.seedRoles = async function() {
  const roles = await this.find();
  if (roles.length === 0) {
    for (const [roleName, permissions] of Object.entries(rolePermissions)) {
      await this.create({
        name: roleName,
        description: `${roleName.charAt(0).toUpperCase() + roleName.slice(1)} role`,
        permissions
      });
    }
    console.log('Roles seeded successfully');
  }
};

module.exports = mongoose.model('Role', roleSchema);
