# RBAC Backend - Role-Based Access Control System

## Overview
This is the backend API for a Role-Based Access Control (RBAC) system built with Express.js and MongoDB. It implements user authentication, role hierarchy, permissions management, and admin features.

## Features
- ✅ User Authentication with JWT
- ✅ Role Hierarchy (Admin, Manager, User)
- ✅ Permission-Based Access Control
- ✅ User Management (Create, Read, Update, Delete)
- ✅ Role Assignment
- ✅ Admin Dashboard Stats
- ✅ Audit Logging
- ✅ Password Hashing with bcrypt

## Role Hierarchy & Permissions

### Admin
- **Permissions**: `read`, `write`, `delete`, `manage_users`, `view_reports`, `manage_roles`
- **Features**: Full system access, user management, role assignment

### Manager
- **Permissions**: `read`, `write`, `delete`, `view_reports`
- **Features**: View reports, manage data, team oversight

### User
- **Permissions**: `read`
- **Features**: Access to personal dashboard and data

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env` file and update values:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rbac_db
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRE=7d
   ```

4. **Start the server**
   ```bash
   npm start        # Production
   npm run dev      # Development (with nodemon)
   ```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)

### User Routes (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user (admin only)
- `DELETE /:id` - Delete user (admin only)

### Admin Routes (`/api/admin`)
- `GET /stats` - Get system statistics (admin only)
- `POST /assign-role` - Assign role to user (admin only)
- `POST /toggle-status` - Toggle user active status (admin only)
- `GET /audit-log` - Get audit log (admin only)

### Dashboard Routes (`/api/dashboard`)
- `GET /user` - Get user dashboard
- `GET /manager` - Get manager dashboard (manager/admin)
- `GET /admin` - Get admin dashboard (admin only)

## Demo Credentials

You can use these credentials to test the system:

```
Admin:
- Email: admin@test.com
- Password: password123

Manager:
- Email: manager@test.com
- Password: password123

User:
- Email: user@test.com
- Password: password123
```

## API Response Examples

### Login Success
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "648abc123def456",
    "name": "Admin User",
    "email": "admin@test.com",
    "role": "admin",
    "permissions": ["read", "write", "delete", "manage_users", "view_reports", "manage_roles"]
  }
}
```

### Unauthorized Access
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

## Middleware

### authMiddleware
- Verifies JWT token
- Extracts user ID and role
- Attaches to request object

### authorize(...roles)
- Checks if user has required role
- Redirects to 403 if unauthorized

### checkPermission(permission)
- Checks if user has specific permission
- Used for granular access control

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'manager', 'admin']),
  permissions: [String],
  isActive: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

### Role Model
```javascript
{
  name: String (enum: ['admin', 'manager', 'user']),
  description: String,
  permissions: [String],
  createdAt: Date
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

**Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token validation
- ✅ Role-based access control
- ✅ Permission-level authorization
- ✅ CORS enabled
- ✅ Input validation

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database permissions

### JWT Token Expired
- Token expires after 7 days by default
- User must login again to get new token
- Adjust `JWT_EXPIRE` in `.env` if needed

### Permission Denied
- Check user role and permissions
- Verify request includes valid JWT token
- Admin action requires admin role

## Future Enhancements
- [ ] Refresh token implementation
- [ ] More granular permissions
- [ ] Role templates
- [ ] Activity logging
- [ ] Email notifications
- [ ] Two-factor authentication
